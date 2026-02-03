import { build } from "esbuild";
import { minify } from "html-minifier-terser";
import { mkdir, readFile, writeFile, readdir } from "fs/promises";
import { basename, join } from "path";

const distDir = new URL("./dist/", import.meta.url);
const configsDistDir = new URL("./dist/configs/", import.meta.url);
const configsSrcDir = new URL("./configs/", import.meta.url);
const htmlPath = new URL("./index.html", import.meta.url);

// Create dist directories
await mkdir(distDir, { recursive: true });
await mkdir(configsDistDir, { recursive: true });

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
