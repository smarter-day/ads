(() => {
  const CURRENT_YEAR = new Date().getFullYear();
  const APP_STORE_LINK =
    "https://apps.apple.com/app/apple-store/id6736619323?pt=127277764&ct=foodshelf.life&mt=8";
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
    "#ad-slot": {
      interval: 4000,
      effect: "fade",
      slides: ALL_SLIDES,
    },
    "#ad-slot-2": {
      interval: 3000,
      effect: "fade",
      slides: ALL_SLIDES,
    },
    "#ad-slot-3": {
      interval: 3000,
      effect: "slide",
      slides: ALL_SLIDES,
    },
    "#ad-slot-4": {
      interval: 6000,
      effect: "fade",
      slides: ALL_SLIDES,
    },
    popup: {
      delay: 5000,
      interval: 5000,
      effect: "fade",
      titleInterval: 5000,
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
