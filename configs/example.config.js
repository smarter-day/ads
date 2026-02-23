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

  const SCREENSHOTS = [
    "images/daily,planner,today,tasks,habits,ios,app,screenshot,01.png",
    "images/daily,planner,timeline,schedule,timeblocking,ios,app,screenshot,02.png",
    "images/daily,planner,habit,tracker,workout,meditation,ios,app,screenshot,03.png",
    "images/daily,planner,event,duration,editor,ios,app,screenshot,05.png",
    "images/habit-tracker,planner,todo-list.png",
    "images/productivity,inbox,tasks,list,priorities,ios,app,screenshot,09.png",
  ];

  const ALL_SLIDES = SCREENSHOTS.map((image) => ({
    desktop: image,
    mobile: image,
    link: APP_STORE_LINK,
  }));

  window.AD_CONFIG = {
    // =========================================================================
    // AD SLOT A: Hero Content Banner (Fade Effect with Multiple Slides)
    // =========================================================================
    // Demonstrates: fade transitions, multiple slides, auto-rotation
    "#ad-slot": {
      interval: 4000, // Rotate every 4 seconds
      effect: "fade", // Smooth fade transition
      slides: ALL_SLIDES,
    },

    // =========================================================================
    // AD SLOT B: Compact Card (Single Static Image)
    // =========================================================================
    // Demonstrates: single image, no rotation (interval: 0)
    "#ad-slot-2": {
      interval: 3000, // Rotate to showcase full image set
      effect: "fade",
      slides: ALL_SLIDES,
    },

    // =========================================================================
    // AD SLOT C: Grid Card (Slide Effect)
    // =========================================================================
    // Demonstrates: slide transitions (horizontal carousel)
    "#ad-slot-3": {
      interval: 3000, // Rotate every 3 seconds
      effect: "slide", // Horizontal slide transition
      slides: ALL_SLIDES,
    },

    // =========================================================================
    // AD SLOT D: Footer Banner (Wide Format with Slow Rotation)
    // =========================================================================
    // Demonstrates: longer rotation interval, wide banner format
    "#ad-slot-4": {
      interval: 6000, // Rotate every 6 seconds (slower)
      effect: "fade",
      slides: ALL_SLIDES,
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
      slides: ALL_SLIDES,
    },
  };
})();
