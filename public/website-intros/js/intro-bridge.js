(function () {
  function done() {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "mmc-intro-done" }, "*");
    }
  }
  var site = document.getElementById("site");
  if (site) {
    site.style.display = "none";
    new MutationObserver(function () {
      if (site.classList.contains("live") || site.classList.contains("in")) done();
    }).observe(site, { attributes: true, attributeFilter: ["class"] });
  }
  var cue = document.getElementById("scrollCue");
  if (cue) {
    new MutationObserver(function () {
      if (cue.classList.contains("show")) done();
    }).observe(cue, { attributes: true, attributeFilter: ["class"] });
  }
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") done();
  });
  var skip = document.getElementById("skip");
  if (skip) skip.addEventListener("click", done);
  if (!skip && !document.getElementById("mmc-skip")) {
    var button = document.createElement("button");
    button.id = "mmc-skip";
    button.type = "button";
    button.textContent = "Skip intro";
    button.style.cssText = "position:fixed;right:16px;bottom:16px;z-index:100000;padding:10px 16px;border-radius:999px;border:1px solid #FFD700;background:#050505;color:#FFD700;font-weight:700;cursor:pointer";
    button.addEventListener("click", done);
    document.body.appendChild(button);
  }
  setTimeout(done, 16000);
})();
