(() => {
  const CURRENT_YEAR = new Date().getFullYear();

  window.AD_CONFIG = {
    popup: {
      delay: 5000,
      interval: 5000,
      effect: "fade",
      titleInterval: 4000,
      titles: [
        "The Only Planner You Need. Tasks, Calendar & Habits in One Flow.",
        "All Premium Features, 100% Free. The Smarter Way to Plan.",
        "Stop Overthinking. Start Doing. The Daily Planner for Focus.",
        `The ${CURRENT_YEAR} Productivity Standard. Simple, Fast, and Free.`,
      ],
      slides: [
        {
          desktop:
            "https://smarter.day/hs-fs/hubfs/Screenshots/Day%20Structure/001/light.webp?width=3368&height=6870&name=light.webp",
          mobile:
            "https://smarter.day/hs-fs/hubfs/Screenshots/Day%20Structure/001/light.webp?width=3368&height=6870&name=light.webp",
          link: "https://apps.apple.com/app/apple-store/id6736619323?pt=127277764&ct=petr&mt=8",
        },
        {
          desktop:
            "https://smarter.day/hs-fs/hubfs/Screenshots/Day%20Structure/002/light.webp?width=3368&height=6870&name=light.webp",
          mobile:
            "https://smarter.day/hs-fs/hubfs/Screenshots/Day%20Structure/002/light.webp?width=3368&height=6870&name=light.webp",
          link: "https://apps.apple.com/app/apple-store/id6736619323?pt=127277764&ct=petr&mt=8",
        },
      ],
    },
  };
})();
