/**
 * Example Configuration for Smarter.day Ads Engine
 *
 * This config demonstrates all available ad types and options.
 * Use this as a reference when creating new partner configurations.
 */
(() => {
  const CURRENT_YEAR = new Date().getFullYear();

  const APP_STORE_LINK =
    "https://apps.apple.com/app/apple-store/id6736619323?pt=127277764&ct=example&mt=8";

  const SCREENSHOTS = {
    light1:
      "https://smarter.day/hs-fs/hubfs/Screenshots/Day%20Structure/001/light.webp?width=3368&height=6870&name=light.webp",
    light2:
      "https://smarter.day/hs-fs/hubfs/Screenshots/Day%20Structure/002/light.webp?width=3368&height=6870&name=light.webp",
  };

  window.AD_CONFIG = {
    // =========================================================================
    // AD SLOT A: Hero Content Banner (Fade Effect with Multiple Slides)
    // =========================================================================
    // Demonstrates: fade transitions, multiple slides, auto-rotation
    "#ad-slot": {
      interval: 4000, // Rotate every 4 seconds
      effect: "fade", // Smooth fade transition
      slides: [
        {
          desktop: SCREENSHOTS.light1,
          mobile: SCREENSHOTS.light1,
          link: APP_STORE_LINK,
        },
        {
          desktop: SCREENSHOTS.light2,
          mobile: SCREENSHOTS.light2,
          link: APP_STORE_LINK,
        },
      ],
    },

    // =========================================================================
    // AD SLOT B: Compact Card (Single Static Image)
    // =========================================================================
    // Demonstrates: single image, no rotation (interval: 0)
    "#ad-slot-2": {
      interval: 0, // No rotation - static image
      effect: "fade",
      slides: [
        {
          desktop: SCREENSHOTS.light1,
          mobile: SCREENSHOTS.light1,
          link: APP_STORE_LINK,
        },
      ],
    },

    // =========================================================================
    // AD SLOT C: Grid Card (Slide Effect)
    // =========================================================================
    // Demonstrates: slide transitions (horizontal carousel)
    "#ad-slot-3": {
      interval: 3000, // Rotate every 3 seconds
      effect: "slide", // Horizontal slide transition
      slides: [
        {
          desktop: SCREENSHOTS.light1,
          mobile: SCREENSHOTS.light1,
          link: APP_STORE_LINK,
        },
        {
          desktop: SCREENSHOTS.light2,
          mobile: SCREENSHOTS.light2,
          link: APP_STORE_LINK,
        },
      ],
    },

    // =========================================================================
    // AD SLOT D: Footer Banner (Wide Format with Slow Rotation)
    // =========================================================================
    // Demonstrates: longer rotation interval, wide banner format
    "#ad-slot-4": {
      interval: 6000, // Rotate every 6 seconds (slower)
      effect: "fade",
      slides: [
        {
          desktop: SCREENSHOTS.light1,
          mobile: SCREENSHOTS.light1,
          link: APP_STORE_LINK,
        },
        {
          desktop: SCREENSHOTS.light2,
          mobile: SCREENSHOTS.light2,
          link: APP_STORE_LINK,
        },
      ],
    },

    // =========================================================================
    // POPUP: Full-Featured Modal Ad
    // =========================================================================
    // Demonstrates: all popup features including rotating titles
    popup: {
      delay: 5000, // Show after 5 seconds
      showEveryHours: 1, // Show popup at most once per hour
      interval: 5000, // Rotate images every 5 seconds
      effect: "fade", // Fade transition for images
      titleInterval: 4000, // Rotate titles every 4 seconds
      titles: [
        "The Only Planner You Need. Tasks, Calendar & Habits in One Flow.",
        "All Premium Features, 100% Free. The Smarter Way to Plan.",
        "Stop Overthinking. Start Doing. The Daily Planner for Focus.",
        `The ${CURRENT_YEAR} Productivity Standard. Simple, Fast, and Free.`,
      ],
      slides: [
        {
          desktop: SCREENSHOTS.light1,
          mobile: SCREENSHOTS.light1,
          link: APP_STORE_LINK,
        },
        {
          desktop: SCREENSHOTS.light2,
          mobile: SCREENSHOTS.light2,
          link: APP_STORE_LINK,
        },
      ],
    },
  };
})();
