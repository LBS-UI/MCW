(function () {
  var SCENES = [
    "/website-intros/scenes/01-cinematic-reveal.html",
    "/website-intros/scenes/02-chaotic-verity.html",
    "/website-intros/scenes/03-creative-studio.html",
    "/website-intros/scenes/04-interactive-loading.html"
  ];
  var overlay = null;
  function storage(store, key, value) {
    try {
      if (value === undefined) return store.getItem(key);
      store.setItem(key, value);
    } catch (error) {
      return null;
    }
  }
  function choose() {
    if (storage(localStorage, "mmc_intro_skip") === "1") return null;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;
    var index = Number(storage(sessionStorage, "mmc_intro_index") || "0");
    if (index >= SCENES.length) index = 0;
    storage(sessionStorage, "mmc_intro_index", String(index + 1));
    return SCENES[index];
  }
  function cleanup() {
    if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
    overlay = null;
    document.body.style.overflow = "";
    if (window.offerVerityTour) window.offerVerityTour();
  }
  function play(src) {
    var loader = document.getElementById("loading-screen");
    if (loader) loader.style.display = "none";
    document.body.style.overflow = "hidden";
    overlay = document.createElement("div");
    overlay.id = "mmc-intro-overlay";
    overlay.style.cssText = "position:fixed;inset:0;z-index:20000;background:#050505";
    var frame = document.createElement("iframe");
    frame.src = src;
    frame.title = "Multimedia Club intro";
    frame.style.cssText = "width:100%;height:100%;border:0;background:#050505";
    var skip = document.createElement("button");
    skip.type = "button";
    skip.textContent = "Skip intro";
    skip.style.cssText = "position:absolute;right:16px;top:16px;z-index:2;padding:10px 14px;border-radius:999px;border:1px solid #FFD700;background:#050505;color:#FFD700;font-weight:700;cursor:pointer";
    skip.addEventListener("click", cleanup);
    overlay.appendChild(frame);
    overlay.appendChild(skip);
    document.body.appendChild(overlay);
    setTimeout(cleanup, 18000);
  }
  window.addEventListener("message", function (event) {
    if (event.data && event.data.type === "mmc-intro-done") cleanup();
  });
  window.MMCIntro = { skip: cleanup };
  var scene = choose();
  if (scene) play(scene);
})();
