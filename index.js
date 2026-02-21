(function () {
  // --- APPLE DEVICE DETECTION ---
  function isAppleDevice() {
    const ua = navigator.userAgent;
    const isIpadOS = ua.includes("Mac") && navigator.maxTouchPoints > 1;
    const isMacOS = ua.includes("Mac") && navigator.maxTouchPoints === 0;
    return /iPad|iPhone|iPod/.test(ua) || isIpadOS || isMacOS;
  }

  // Exit early when not on iOS or macOS
  if (!isAppleDevice()) {
    return;
  }

  // --- CONFIG ---
  const CONFIG_URL = window.AD_CONFIG_URL;

  if (!CONFIG_URL) {
    console.warn("Smarter.day Ads: No AD_CONFIG_URL set. Ads will not load.");
    return;
  }

  function loadRemoteConfig() {
    if (window.AD_CONFIG) {
      return Promise.resolve(window.AD_CONFIG);
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = CONFIG_URL;
      script.async = true;
      script.onload = () => resolve(window.AD_CONFIG || {});
      script.onerror = () =>
        reject(new Error(`Failed to load config: ${CONFIG_URL}`));
      document.head.appendChild(script);
    });
  }

  // --- ENGINE ---

  // Use screen width to choose between mobile/desktop image URLs
  const isSmallScreen = window.innerWidth < 768;
  const CURRENT_YEAR = new Date().getFullYear();
  const POPUP_LAST_SHOWN_KEY = "smarter_day_popup_last_shown_at";

  function getPopupCooldownMs(config) {
    const hours = Number(config?.showEveryHours);
    const safeHours = Number.isFinite(hours) && hours > 0 ? hours : 1;
    return safeHours * 60 * 60 * 1000;
  }

  function canShowPopup(config) {
    try {
      const raw = localStorage.getItem(
        config?.localStorageKey || POPUP_LAST_SHOWN_KEY
      );
      if (!raw) return true;
      const lastShownAt = Number(raw);
      if (!Number.isFinite(lastShownAt)) return true;
      return Date.now() - lastShownAt >= getPopupCooldownMs(config);
    } catch (error) {
      // If storage is unavailable, do not block popup display.
      return true;
    }
  }

  function markPopupShown(config) {
    try {
      localStorage.setItem(
        config?.localStorageKey || POPUP_LAST_SHOWN_KEY,
        String(Date.now())
      );
    } catch (error) {
      // Ignore storage failures (private mode / blocked storage).
    }
  }

  function init(config) {
    Object.keys(config).forEach((selector) => {
      const slotConfig = config[selector];

      if (selector === "popup") {
        if (canShowPopup(slotConfig)) {
          setTimeout(() => createPopup(slotConfig), slotConfig.delay || 0);
        }
      } else {
        const containers = document.querySelectorAll(selector);
        containers.forEach((container) => mountAd(container, slotConfig));
      }
    });
  }

  function getImgSrc(slide) {
    return isSmallScreen && slide.mobile ? slide.mobile : slide.desktop;
  }

  function preloadSlides(slides) {
    slides.forEach((slide) => {
      const img = new Image();
      img.src = getImgSrc(slide);
    });
  }

  function mountAd(container, config) {
    if (!container) return;

    container.style.position = "relative";
    container.style.overflow = "hidden";
    container.style.display = "flex";

    if (config.effect === "slide") {
      mountSlider(container, config);
    } else {
      mountFader(container, config);
    }
  }

  function mountSlider(container, config) {
    preloadSlides(config.slides);
    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.transition = "transform 0.5s ease-in-out";
    wrapper.style.width = "100%";
    wrapper.style.height = "100%";

    config.slides.forEach((slide) => {
      const link = document.createElement("a");
      link.href = slide.link;
      link.target = "_blank";
      link.style.flex = "0 0 100%";
      link.style.display = "flex";
      link.style.alignItems = "center";
      link.style.justifyContent = "center";
      link.style.height = "100%";

      const img = document.createElement("img");
      img.src = getImgSrc(slide);
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "contain";
      img.style.display = "block";

      link.appendChild(img);
      wrapper.appendChild(link);
    });

    container.appendChild(wrapper);

    if (config.slides.length > 1 && config.interval > 0) {
      let currentIndex = 0;
      setInterval(() => {
        currentIndex = (currentIndex + 1) % config.slides.length;
        wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
      }, config.interval);
    }
  }

  function mountFader(container, config) {
    preloadSlides(config.slides);
    const slidesEls = config.slides.map((slide, index) => {
      const link = document.createElement("a");
      link.href = slide.link;
      link.target = "_blank";
      Object.assign(link.style, {
        position: index === 0 ? "relative" : "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        opacity: index === 0 ? 1 : 0,
        transition: "opacity 0.8s ease-in-out",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      });

      const img = document.createElement("img");
      img.src = getImgSrc(slide);
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "contain";
      img.style.display = "block";

      link.appendChild(img);
      container.appendChild(link);
      return link;
    });

    if (config.slides.length > 1 && config.interval > 0) {
      let activeIndex = 0;
      setInterval(() => {
        const nextIndex = (activeIndex + 1) % slidesEls.length;
        slidesEls[activeIndex].style.opacity = 0;
        slidesEls[nextIndex].style.opacity = 1;

        slidesEls[activeIndex].style.position = "absolute";
        slidesEls[nextIndex].style.position = "relative";

        activeIndex = nextIndex;
      }, config.interval);
    }
  }

  function createPopup(config) {
    markPopupShown(config);

    const overlay = document.createElement("div");
    overlay.className = "smarter-day-popup-overlay";
    Object.assign(overlay.style, {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(0,0,0,0.5)",
      zIndex: 99999,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      opacity: 0,
      transition: "opacity 0.3s",
      userSelect: "none",
      WebkitUserSelect: "none",
      WebkitTouchCallout: "none",
    });

    overlay.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });

    const content = document.createElement("div");
    Object.assign(content.style, {
      position: "relative",
      width: "90vw",
      maxWidth: "600px",
      maxHeight: "90vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      gap: "0",
      background: "transparent",
      userSelect: "none",
      WebkitUserSelect: "none",
      WebkitTouchCallout: "none",
    });

    const close = document.createElement("button");
    const closeDelayMs = config.closeDelay ?? 5000;
    const countdownSeconds = Math.max(0, Math.ceil(closeDelayMs / 1000));
    let remainingSeconds = countdownSeconds;
    let canClose = remainingSeconds === 0;
    close.textContent = canClose ? "✕" : String(remainingSeconds);
    Object.assign(close.style, {
      position: "absolute",
      top: "-15px",
      right: "-15px",
      width: "30px",
      height: "30px",
      borderRadius: "50%",
      border: "none",
      background: "#fff",
      color: "#000",
      cursor: "pointer",
      fontSize: "20px",
      fontWeight: "bold",
      zIndex: 10,
      boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
      opacity: 1,
      pointerEvents: canClose ? "auto" : "none",
      transition: "transform 0.2s ease",
    });
    const closePopup = () => {
      if (!canClose || !overlay.parentNode) return;
      overlay.style.opacity = 0;
      setTimeout(() => {
        if (overlay.parentNode) {
          document.body.removeChild(overlay);
        }
      }, 300);
    };
    close.onclick = closePopup;

    if (!canClose) {
      const countdownInterval = setInterval(() => {
        remainingSeconds -= 1;
        if (remainingSeconds <= 0) {
          canClose = true;
          close.textContent = "✕";
          close.style.pointerEvents = "auto";
          clearInterval(countdownInterval);
          return;
        }
        close.textContent = String(remainingSeconds);
      }, 1000);
    }

    content.appendChild(close);

    const popupLink = config.slides?.[0]?.link;
    const title = document.createElement(popupLink ? "a" : "div");
    if (popupLink) {
      title.href = popupLink;
      title.target = "_blank";
      title.rel = "noreferrer noopener";
    }
    Object.assign(title.style, {
      display: "block",
      width: "100%",
      textAlign: "center",
      lineHeight: "1.4",
      margin: "0",
      background:
        "linear-gradient(135deg, #ffffff 0%, #f8fafc 40%, #e2e8f0 100%)",
      padding: "12px 16px",
      borderRadius: "12px 12px 0 0",
      boxShadow:
        "0 18px 40px rgba(15, 23, 42, 0.3), 0 6px 12px rgba(15, 23, 42, 0.18)",
      textDecoration: "none",
      boxSizing: "border-box",
    });

    const titles =
      config.titles && config.titles.length
        ? config.titles
        : [
            "The Only Planner You Need. Tasks, Calendar & Habits in One Flow.",
            "All Premium Features, 100% Free. The Smarter Way to Plan.",
            "Stop Overthinking. Start Doing. The Daily Planner for Focus.",
            `The ${CURRENT_YEAR} Productivity Standard. Simple, Fast, and Free.`,
          ];
    let titleIndex = 0;
    const titleText = document.createElement("span");
    titleText.textContent = titles[titleIndex];
    Object.assign(titleText.style, {
      display: "inline-block",
      fontSize: "16px",
      fontWeight: "700",
      backgroundImage:
        "linear-gradient(135deg, #0ea5e9 0%, #6366f1 45%, #ec4899 100%)",
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
      WebkitTextFillColor: "transparent",
    });
    title.appendChild(titleText);
    content.appendChild(title);

    if (titles.length > 1 && config.titleInterval > 0) {
      setInterval(() => {
        titleIndex = (titleIndex + 1) % titles.length;
        titleText.textContent = titles[titleIndex];
      }, config.titleInterval);
    }

    const adWrapper = document.createElement("div");
    adWrapper.style.width = "100%";
    adWrapper.style.height = "80vh";
    adWrapper.style.position = "relative";
    adWrapper.style.overflow = "hidden";
    adWrapper.style.display = "flex";
    adWrapper.style.background = "#ffffff";
    adWrapper.style.borderRadius = "0 0 16px 16px";
    adWrapper.style.padding = "0";
    adWrapper.style.boxSizing = "border-box";
    adWrapper.style.boxShadow =
      "0 24px 48px rgba(15, 23, 42, 0.25), inset 0 0 0 1px rgba(148, 163, 184, 0.22)";

    const adViewport = document.createElement("div");
    Object.assign(adViewport.style, {
      position: "relative",
      width: "100%",
      height: "100%",
      padding: "12px 0",
      boxSizing: "border-box",
      background: "transparent",
      zIndex: "4",
    });

    const adMedia = document.createElement("div");
    Object.assign(adMedia.style, {
      position: "relative",
      width: "100%",
      height: "100%",
      overflow: "hidden",
      borderRadius: "0 0 12px 12px",
      background: "transparent",
    });

    if (config.effect === "slide") {
      mountSlider(adMedia, config);
    } else {
      mountFader(adMedia, config);
    }

    const sideFx = document.createElement("div");
    Object.assign(sideFx.style, {
      position: "absolute",
      inset: "12px 0",
      borderRadius: "0 0 12px 12px",
      overflow: "hidden",
      pointerEvents: "none",
      zIndex: "2",
    });

    const premiumFx = document.createElement("div");
    Object.assign(premiumFx.style, {
      position: "absolute",
      inset: "12px 0",
      borderRadius: "0 0 12px 12px",
      overflow: "hidden",
      pointerEvents: "none",
      zIndex: "6",
    });

    const leftGlow = document.createElement("div");
    Object.assign(leftGlow.style, {
      position: "absolute",
      top: "-10%",
      left: "-52%",
      width: "58%",
      height: "120%",
      background:
        "radial-gradient(circle at 18% 50%, rgba(14,165,233,0.5) 0%, rgba(14,165,233,0.35) 28%, rgba(14,165,233,0) 58%)",
      filter: "blur(4px)",
      opacity: "1",
    });
    leftGlow.style.zIndex = "1";

    const rightGlow = document.createElement("div");
    Object.assign(rightGlow.style, {
      position: "absolute",
      top: "-10%",
      right: "-52%",
      width: "58%",
      height: "120%",
      background:
        "radial-gradient(circle at 82% 50%, rgba(236,72,153,0.48) 0%, rgba(236,72,153,0.32) 28%, rgba(236,72,153,0) 58%)",
      filter: "blur(4px)",
      opacity: "1",
    });
    rightGlow.style.zIndex = "1";

    const sheen = document.createElement("div");
    Object.assign(sheen.style, {
      position: "absolute",
      top: "-35%",
      left: "-60%",
      width: "45%",
      height: "170%",
      transform: "rotate(14deg)",
      background:
        "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 48%, rgba(255,255,255,0) 100%)",
      opacity: "1",
      zIndex: "3",
    });

    sideFx.appendChild(leftGlow);
    sideFx.appendChild(rightGlow);
    premiumFx.appendChild(sheen);
    adWrapper.appendChild(sideFx);
    adWrapper.appendChild(premiumFx);
    adViewport.appendChild(adMedia);
    adWrapper.appendChild(adViewport);

    leftGlow.animate(
      [
        { transform: "translateX(-12%) scale(0.98)", opacity: 0.68 },
        { transform: "translateX(14%) scale(1.04)", opacity: 1 },
      ],
      {
        duration: 2800,
        iterations: Infinity,
        direction: "alternate",
        easing: "ease-in-out",
      }
    );

    rightGlow.animate(
      [
        { transform: "translateX(12%) scale(0.98)", opacity: 0.68 },
        { transform: "translateX(-14%) scale(1.04)", opacity: 1 },
      ],
      {
        duration: 2800,
        iterations: Infinity,
        direction: "alternate",
        easing: "ease-in-out",
      }
    );

    sheen.animate(
      [
        { transform: "translateX(-25%) rotate(14deg)", opacity: 0.56 },
        { transform: "translateX(350%) rotate(14deg)", opacity: 1 },
      ],
      {
        duration: 2600,
        iterations: Infinity,
        easing: "ease-in-out",
      }
    );

    content.appendChild(adWrapper);
    overlay.appendChild(content);
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.style.opacity = 1;
    });
  }

  function bootstrap() {
    loadRemoteConfig()
      .then((config) => {
        if (!config || !Object.keys(config).length) {
          return;
        }
        init(config);
      })
      .catch((error) => {
        console.warn(error.message);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap);
  } else {
    bootstrap();
  }
})();
