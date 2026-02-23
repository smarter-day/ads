# Smarter.day Ads Engine

A lightweight, privacy-focused ad engine for displaying targeted advertisements to iOS and macOS users. Supports popups, sliders, faders, and in-content banners with fully customizable configurations.

## Table of Contents

- [Features](#features)
- [Partner Integration Guide](#partner-integration-guide)
  - [Step 1: Get Your Config URL](#step-1-get-your-config-url)
  - [Step 2: Add Scripts to Your Website](#step-2-add-scripts-to-your-website)
  - [Step 3: Add Ad Slots (Optional)](#step-3-add-ad-slots-optional)
- [Ad Types](#ad-types)
- [Configuration Reference](#configuration-reference)
- [Development](#development)
- [CI/CD Pipeline](#cicd-pipeline)
- [Adding a New Partner](#adding-a-new-partner)

---

## Features

- **Platform Targeting**: Automatically detects and displays ads only on iOS and macOS devices
- **Multiple Ad Formats**: Popups, in-content banners, sliders, and faders
- **Rotating Content**: Support for multiple slides with configurable rotation intervals
- **Rotating Titles**: Independent title rotation for popup ads
- **Image Preloading**: Automatically preloads upcoming slides for smooth transitions
- **Responsive Design**: Separate image URLs for desktop and mobile viewports
- **Zero Dependencies**: Vanilla JavaScript with no external libraries required
- **Lightweight**: Minified bundle under 5KB
- **Easy Integration**: Simple script tag inclusion with remote configuration

---

## Partner Integration Guide

### Step 1: Get Your Config URL

Your personalized config file is located in the `dist/configs/` directory. Use the static host URL:

```text
https://static-ads.smarter.day/configs/YOUR_NAME.config.js
```

**Example:**

```text
https://static-ads.smarter.day/configs/foodshelf.life.config.js
```

In all integration snippets below, the cache-busting value is generated in JavaScript from the current date (`YYYYMMDD`) and appended as `?v=<date>`.

### Step 2: Add Scripts to Your Website

Choose the integration method that best fits your technology stack.

#### Option A: Plain HTML (Recommended)

Add these script tags before the closing `</body>` tag:

```html
<!-- Smarter.day Ads Engine -->
<script>
  const adsVersion = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  window.AD_CONFIG_URL = `https://static-ads.smarter.day/configs/YOUR_NAME.config.js?v=${adsVersion}`;

  const adsScript = document.createElement("script");
  adsScript.src = `https://static-ads.smarter.day/index.js?v=${adsVersion}`;
  adsScript.async = true;
  document.body.appendChild(adsScript);
</script>
```

#### Option B: React / Next.js

**Using Next.js Script Component (Recommended for Next.js):**

```jsx
// components/AdsEngine.jsx
import Script from "next/script";

export default function AdsEngine() {
  return (
    <>
      <Script
        id="ads-engine-loader"
        strategy="afterInteractive"
      >{`
        (() => {
          const adsVersion = new Date().toISOString().slice(0, 10).replace(/-/g, "");
          window.AD_CONFIG_URL = "https://static-ads.smarter.day/configs/YOUR_NAME.config.js?v=" + adsVersion;

          const script = document.createElement("script");
          script.src = "https://static-ads.smarter.day/index.js?v=" + adsVersion;
          script.async = true;
          document.body.appendChild(script);
        })();
      `}</Script>
    </>
  );
}
```

**Using React Helmet or standard React:**

```jsx
// components/AdsEngine.jsx
import { useEffect } from "react";

export default function AdsEngine() {
  useEffect(() => {
    const adsVersion = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    window.AD_CONFIG_URL =
      `https://static-ads.smarter.day/configs/YOUR_NAME.config.js?v=${adsVersion}`;

    const script = document.createElement("script");
    script.src = `https://static-ads.smarter.day/index.js?v=${adsVersion}`;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
}
```

Include the component in your layout or root component.

#### Option C: Vue / Nuxt

**Nuxt 3 Plugin (`plugins/ads-engine.client.ts`):**

```typescript
export default defineNuxtPlugin(() => {
  if (typeof window !== "undefined") {
    const adsVersion = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    window.AD_CONFIG_URL =
      `https://static-ads.smarter.day/configs/YOUR_NAME.config.js?v=${adsVersion}`;

    const script = document.createElement("script");
    script.src = `https://static-ads.smarter.day/index.js?v=${adsVersion}`;
    script.async = true;
    document.body.appendChild(script);
  }
});
```

**Vue 3 Composable:**

```typescript
// composables/useAdsEngine.ts
import { onMounted, onUnmounted } from "vue";

export function useAdsEngine(configUrl: string) {
  let script: HTMLScriptElement | null = null;

  onMounted(() => {
    const adsVersion = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const separator = configUrl.includes("?") ? "&" : "?";
    window.AD_CONFIG_URL = `${configUrl}${separator}v=${adsVersion}`;

    script = document.createElement("script");
    script.src = `https://static-ads.smarter.day/index.js?v=${adsVersion}`;
    script.async = true;
    document.body.appendChild(script);
  });

  onUnmounted(() => {
    if (script) {
      document.body.removeChild(script);
    }
  });
}
```

### Step 3: Add Ad Slots (Optional)

If your configuration includes in-content banner ads, add placeholder elements with matching CSS selectors:

```html
<!-- Ad slot that matches "#ad-slot" selector in config -->
<div id="ad-slot"></div>

<!-- Ad slot that matches ".sidebar-ad" selector in config -->
<div class="sidebar-ad"></div>
```

The ads engine automatically populates these containers when the page loads.

---

## Ad Types

### Popup

A modal overlay that appears after a configurable delay.

| Feature | Description |
|---------|-------------|
| Delay | Configurable appearance delay (default: 5 seconds) |
| Close Button | Appears after 5 seconds to prevent accidental dismissal |
| Titles | Rotating headlines displayed above the image |
| Slides | Multiple images with independent rotation |
| Effects | Supports `fade` and `slide` transitions |

### In-Content Banners

Embedded ad units that render inside designated containers on your page.

| Feature | Description |
|---------|-------------|
| Targeting | Uses CSS selectors to find placement containers |
| Responsive | Automatically fits container dimensions |
| Rotation | Multiple slides with configurable intervals |
| Effects | Supports `fade` and `slide` transitions |

---

## Configuration Reference

Each config file defines `window.AD_CONFIG` with the following structure:

```javascript
(() => {
  const CURRENT_YEAR = new Date().getFullYear();

  window.AD_CONFIG = {
    // In-content banner (CSS selector as key)
    "#ad-slot": {
      interval: 4000,        // Rotation interval in milliseconds (0 = disabled)
      effect: "fade",        // Transition effect: "fade" or "slide"
      slides: [
        {
          desktop: "https://example.com/banner-desktop.webp",
          mobile: "https://example.com/banner-mobile.webp",
          link: "https://example.com/landing-page",
        },
        // Additional slides...
      ],
    },

    // Popup configuration
    popup: {
      delay: 5000,           // Delay before showing popup (milliseconds)
      interval: 5000,        // Slide rotation interval (milliseconds)
      effect: "fade",        // Transition effect: "fade" or "slide"
      titleInterval: 4000,   // Title rotation interval (milliseconds)
      titles: [
        "Your Headline Here",
        `Special Offer for ${CURRENT_YEAR}`,
      ],
      slides: [
        {
          desktop: "https://example.com/popup-desktop.webp",
          mobile: "https://example.com/popup-mobile.webp",
          link: "https://example.com/app-store-link",
        },
        // Additional slides...
      ],
    },
  };
})();
```

### Configuration Options

#### Banner Options

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `interval` | `number` | No | Rotation interval in ms. Set to `0` to disable rotation. |
| `effect` | `string` | No | Transition effect: `"fade"` (default) or `"slide"`. |
| `slides` | `array` | Yes | Array of slide objects. |

#### Popup Options

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `delay` | `number` | No | Delay before showing popup (default: 5000ms). |
| `interval` | `number` | No | Slide rotation interval in ms. |
| `effect` | `string` | No | Transition effect: `"fade"` (default) or `"slide"`. |
| `titleInterval` | `number` | No | Title rotation interval in ms. |
| `titles` | `array` | No | Array of headline strings. |
| `slides` | `array` | Yes | Array of slide objects. |

#### Slide Object

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `desktop` | `string` | Yes | Image URL for viewports ≥768px wide. |
| `mobile` | `string` | Yes | Image URL for viewports <768px wide. |
| `link` | `string` | Yes | Destination URL when clicked. |

### Disabling Features

- **Disable popup**: Remove or comment out the `popup` key from the config.
- **Disable a banner slot**: Remove or comment out the corresponding selector key.
- **Disable rotation**: Set `interval` to `0`.

---

## Development

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Setup

```bash
git clone https://github.com/smarter-day/ads.git
cd ads
npm install
```

### Build

```bash
npm run build
```

This command:

1. Bundles and minifies `index.js` → `dist/index.js`
2. Minifies all config files in `configs/` → `dist/configs/`
3. Optimizes images from `images/` → `dist/images/` as WebP (max 1920x1920)
4. Rewrites built config image paths (`images/...`) to `https://static-ads.smarter.day/images/...`
5. Minifies `index.html` → `dist/index.html`

### Image Assets

- Put source screenshots in `images/` and reference them in partner configs as `images/<file>.<ext>`.
- Supported source formats: `.png`, `.jpg`, `.jpeg`, `.webp`, `.avif`.
- During build, all supported images are converted to optimized `.webp` and copied to `dist/images/`.
- Source `configs/*.js` are unchanged for local root testing (`index.html` + `./configs/...` + `./images/...`).
- Built `dist/configs/*.config.js` get production image URLs: `https://static-ads.smarter.day/images/<file>.webp`.

### Local Testing

Start a local server to test the ads engine:

```bash
npx serve .
```

Then open `http://localhost:3000` in a browser. For accurate testing, use Safari on macOS or the iOS Simulator.

### Project Structure

```text
ads/
├── .github/
│   └── workflows/
│       └── build.yml       # CI/CD pipeline
├── configs/
│   └── foodshelf.life.config.js      # Partner configurations (source)
├── images/
│   └── ...                            # Source screenshots (original formats)
├── dist/
│   ├── configs/
│   │   └── foodshelf.life.config.js  # Minified configs (auto-generated)
│   ├── images/
│   │   └── ...                        # Optimized WebP assets (auto-generated)
│   ├── index.html          # Minified test page
│   └── index.js            # Minified ads engine
├── build.mjs               # Build script
├── index.html              # Test page (source)
├── index.js                # Ads engine (source)
├── package.json
└── README.md
```

---

## CI/CD Pipeline

The repository includes a GitHub Actions workflow that automatically:

1. **Triggers** on every push to `main` or `master` branches
2. **Installs** dependencies using `yarn install --frozen-lockfile`
3. **Builds** and minifies all source files
4. **Uploads** the `dist/` folder to a Cloudflare R2 bucket (S3-compatible)

This ensures partners always have access to the latest minified files from your R2 deployment target.

### Required GitHub Secrets

- `CLOUDFLARE_R2_ACCESS_KEY_ID`
- `CLOUDFLARE_R2_SECRET_ACCESS_KEY`

### Required GitHub Variables

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_R2_BUCKET`
- `CLOUDFLARE_R2_PREFIX` (optional folder prefix in the bucket)

### Workflow File

Located at `.github/workflows/build.yml`.

---

## Adding a New Partner

1. **Create the config file:**

   ```bash
   cp configs/foodshelf.life.config.js configs/partner-name.config.js
   ```

2. **Customize the configuration:**
   - Update slide images and links
   - Modify popup titles
   - Adjust timing intervals as needed

3. **Push to the repository:**

   ```bash
   git add configs/partner-name.config.js
   git commit -m "Add partner-name config"
   git push origin main
   ```

4. **Share the integration details:**

   Config URL:

   ```text
   https://static-ads.smarter.day/configs/partner-name.config.js
   ```

   Engine URL:

   ```text
   https://static-ads.smarter.day/index.js
   ```

---

## Browser Support

The ads engine targets Apple platforms and supports:

- Safari on macOS (all versions)
- Safari on iOS/iPadOS (all versions)
- Chrome, Firefox, and Edge on macOS

The engine automatically exits on non-Apple platforms without executing any code.

---

## License

Proprietary. All rights reserved.

---

## Support

For questions or issues, contact the Smarter.day team.
