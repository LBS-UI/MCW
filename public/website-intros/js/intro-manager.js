(function () {
  var CONFIG = {
    firstScene: "cinematic",
    returningChance: 0.35,
    loadingChance: 0.2,
    cooldownHours: 12
  };
  var SCENES = {
    cinematic: "/website-intros/scenes/01-cinematic-reveal.html",
    chaos: "/website-intros/scenes/02-chaotic-verity.html",
    studio: "/website-intros/scenes/03-creative-studio.html",
    loading: "/website-intros/scenes/04-interactive-loading.html"
  };
  var overlay = null;
  var frame = null;
  function storage(store, key, value) {
    try {
      if (value === undefined) return store.getItem(key);
      store.setItem(key, value);
    } catch (error) {
      return null;
    }
  }
  function alwaysSkip() { return storage(localStorage, "mmc_intro_skip") === "1"; }
  function setAlwaysSkip(on) { storage(localStorage, "mmc_intro_skip", on ? "1" : "0"); }
  function reduced() { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; }
  function choose() {
    if (alwaysSkip() || reduced()) return null;
    if (location.hash === "#projects" || location.hash === "#work") return "studio";
    var seen = storage(localStorage, "mmc_intro_seen");
    if (!seen) return CONFIG.firstScene;
    var last = Number(storage(localStorage, "mmc_intro_last") || 0);
    if (Date.now() - last < CONFIG.cooldownHours * 3600000) return null;
    var roll = Math.random();
    if (roll < CONFIG.loadingChance) return "loading";
    if (roll < CONFIG.loadingChance + CONFIG.returningChance) return "chaos";
    return null;
  }
  function hideOldIntro() {
    var intro = document.getElementById("intro");
    if (intro) intro.style.display = "none";
  }
  function cleanup() {
    if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
    overlay = null;
    frame = null;
    document.body.style.overflow = "";
    if (window.offerVerityTour) window.offerVerityTour();
  }
  function play(name) {
    var src = SCENES[name];
    if (!src) return cleanup();
    hideOldIntro();
    var loader = document.getElementById("loading-screen");
    if (loader) loader.style.display = "none";
    document.body.style.overflow = "hidden";
    overlay = document.createElement("div");
    overlay.id = "mmc-intro-overlay";
    overlay.style.cssText = "position:fixed;inset:0;z-index:12000;background:#050505";
    frame = document.createElement("iframe");
    frame.src = src;
    frame.title = "Multimedia Club intro";
    frame.style.cssText = "width:100%;height:100%;border:0;background:#050505";
    frame.addEventListener("error", cleanup);
    var bar = document.createElement("div");
    bar.style.cssText = "position:absolute;right:16px;bottom:16px;display:flex;gap:8px;z-index:2";
    function button(label, action) {
      var el = document.createElement("button");
      el.type = "button";
      el.textContent = label;
      el.style.cssText = "padding:10px 14px;border-radius:999px;border:1px solid #FFD700;background:#050505;color:#FFD700;font-weight:700;cursor:pointer";
      el.addEventListener("click", action);
      return el;
    }
    bar.appendChild(button("Skip intro", cleanup));
    bar.appendChild(button("Always skip", function () { setAlwaysSkip(true); cleanup(); }));
    overlay.appendChild(frame);
    overlay.appendChild(bar);
    document.body.appendChild(overlay);
    storage(localStorage, "mmc_intro_seen", "1");
    storage(localStorage, "mmc_intro_last", String(Date.now()));
    setTimeout(cleanup, 18000);
  }
  window.addEventListener("message", function (event) {
    if (event.data && event.data.type === "mmc-intro-done") cleanup();
  });
  window.MMCIntro = { play: play, skip: cleanup, alwaysSkip: setAlwaysSkip, config: CONFIG };
  document.addEventListener("DOMContentLoaded", function () {
    var scene = choose();
    if (scene) play(scene);
  });
})();
