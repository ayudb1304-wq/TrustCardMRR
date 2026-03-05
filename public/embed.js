(function () {
  var SCRIPT_SRC = document.currentScript && document.currentScript.src;
  if (!SCRIPT_SRC) return;

  var origin = new URL(SCRIPT_SRC).origin;
  var targets = document.querySelectorAll("[data-trustcard-slug]");

  for (var i = 0; i < targets.length; i++) {
    var el = targets[i];
    var slug = el.getAttribute("data-trustcard-slug");
    if (!slug || el.querySelector("iframe")) continue;

    var iframe = document.createElement("iframe");
    iframe.src = origin + "/embed/" + encodeURIComponent(slug);
    iframe.width = "450";
    iframe.height = "320";
    iframe.style.border = "none";
    iframe.style.borderRadius = "16px";
    iframe.style.overflow = "hidden";
    iframe.loading = "lazy";
    iframe.title = slug + " TrustCard";
    el.appendChild(iframe);
  }
})();
