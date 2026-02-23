import { build } from "esbuild";
import { minify } from "html-minifier-terser";
import sharp from "sharp";
import { mkdir, readFile, writeFile, readdir, stat } from "fs/promises";
import { extname, join, relative, dirname } from "path";

const distDir = new URL("./dist/", import.meta.url);
const configsDistDir = new URL("./dist/configs/", import.meta.url);
const configsSrcDir = new URL("./configs/", import.meta.url);
const imagesSrcDir = new URL("./images/", import.meta.url);
const imagesDistDir = new URL("./dist/images/", import.meta.url);
const htmlPath = new URL("./index.html", import.meta.url);
const IMAGE_CDN_BASE = "https://static-ads.smarter.day/images";
const IMAGE_MAX_DIMENSION = 1920;
const imageExtensions = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif"]);

async function listFilesRecursively(directoryPath) {
  const entries = await readdir(directoryPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = join(directoryPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFilesRecursively(fullPath)));
      continue;
    }
    if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

async function buildImages() {
  await mkdir(imagesDistDir, { recursive: true });

  let sourceExists = true;
  try {
    await stat(imagesSrcDir);
  } catch {
    sourceExists = false;
  }

  if (!sourceExists) {
    console.log("Skipped images: images/ directory not found");
    return;
  }

  const allFiles = await listFilesRecursively(imagesSrcDir.pathname);
  const sourceImages = allFiles.filter((filePath) =>
    imageExtensions.has(extname(filePath).toLowerCase())
  );

  if (sourceImages.length === 0) {
    console.log("Skipped images: no supported files in images/");
    return;
  }

  for (const sourcePath of sourceImages) {
    const sourceRelativePath = relative(imagesSrcDir.pathname, sourcePath);
    const distRelativePath = sourceRelativePath.replace(/\.[^.]+$/, ".webp");
    const targetPath = join(imagesDistDir.pathname, distRelativePath);

    await mkdir(dirname(targetPath), { recursive: true });

    await sharp(sourcePath)
      .resize(IMAGE_MAX_DIMENSION, IMAGE_MAX_DIMENSION, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 82, effort: 4 })
      .toFile(targetPath);

    console.log(`Built: dist/images/${distRelativePath}`);
  }
}

function rewriteConfigImageUrls(configContent) {
  return configContent.replace(
    /(["'])images\/([^"'?]+\.(?:png|jpe?g|webp|avif))(?:\?[^"']*)?\1/gi,
    (fullMatch, quote, imagePath) => {
      const webpPath = imagePath.replace(/\.[^.]+$/i, ".webp");
      return `${quote}${IMAGE_CDN_BASE}/${webpPath}${quote}`;
    }
  );
}

// Create dist directories
await mkdir(distDir, { recursive: true });
await mkdir(configsDistDir, { recursive: true });
await buildImages();

// Build and minify main script
await build({
  entryPoints: ["index.js"],
  bundle: true,
  minify: true,
  target: "es2017",
  platform: "browser",
  outfile: new URL("./dist/index.js", import.meta.url).pathname,
});

console.log("Built: dist/index.js");

// Build and minify all config files
const configFiles = await readdir(configsSrcDir);
const jsConfigs = configFiles.filter((f) => f.endsWith(".config.js"));

for (const configFile of jsConfigs) {
  const inputPath = join(configsSrcDir.pathname, configFile);
  const outputPath = join(configsDistDir.pathname, configFile);

  await build({
    entryPoints: [inputPath],
    bundle: false,
    minify: true,
    target: "es2017",
    platform: "browser",
    outfile: outputPath,
  });

  const builtConfig = await readFile(outputPath, "utf8");
  const rewrittenConfig = rewriteConfigImageUrls(builtConfig);
  await writeFile(outputPath, rewrittenConfig);

  console.log(`Built: dist/configs/${configFile}`);
}

// Minify HTML (for local testing)
const html = await readFile(htmlPath, "utf8");
const minifiedHtml = await minify(html, {
  collapseWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeEmptyAttributes: true,
  useShortDoctype: true,
  keepClosingSlash: true,
  minifyCSS: true,
  minifyJS: true,
});

await writeFile(new URL("./dist/index.html", import.meta.url), minifiedHtml);
console.log("Built: dist/index.html");

console.log("\nBuild complete!");
