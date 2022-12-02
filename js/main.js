require.config({
  baseUrl: "js",
  debug: true,
  synced: "true",
  alias: {
    core: ["weblib/core/CorePackage"],
    managers: ["classes/managers/ManagersPackage"],
    sprites: ["classes/sprites/SpritesPackage"],
    geom: ["weblib/math/geom/GeomPackage"],
    effects: ["classes/effects/EffectsPackage"],
    ui: ["classes/ui/UIPackage"],
  },
  include: [
    "iscroll-probe.js",
    "functions.iscroll.js",
    "weblib/utils/SystemInfo.js",
    "lib/jquery.mousewheel.min.js",
    "weblib/ssnamespace.js",
    "weblib/external/pixi.js",
    "lib/mustache.min.js",
  ],
});

require.include([
  "effects",
  "managers",
  "weblib/command/CommandPackage",
  "weblib/command/CommandSet",
]);

// entry point
require.ready(function () {
  ss.ScrollManager = new ScrollManager();

  if (ss.SystemInfo.isMobile()) {
    ss.SiteManager = new MobileSiteManager();
    ss.SiteManager.addEventListener(SITE_READY, onSiteManagerReady);
    ss.SiteManager.load();
  } else {
    ss.SiteManager = new SiteManager();
    ss.SiteManager.addEventListener(SITE_READY, onSiteManagerReady);
    ss.SiteManager.load();
  }

  $(window).resize(resizeFrame);
  $(window).resize();
});

window.addEventListener(
  "load",
  function load() {
    window.removeEventListener("load", load, false);
    document.body.classList.remove("load");
  },
  false
);

$(document).on("LOAD_PAGE_CONTENT", function (e) {
  // $ ( ".loadingInfo" ).fadeOut ( function () { $ ( this ).remove (); } );
  globalInstance.documentReady();
});

function onSiteManagerReady(e) {
  $(window).resize();

  requestAnimFrame(updateFrame);

  ss.ScrollManager.init();

  $(window).resize();

  // $ ( "#backgroundCanvas" ).fadeIn ( 750 );

  $(window).focus(focus);
  $(window).blur(blur);

  ss.SiteManager.dispatchEvent("INIT_RESIZE");

  var delayedResize = function () {
    $(window).resize();
  };

  setTimeout(delayedResize, 250);
  setTimeout(delayedResize, 500);
  setTimeout(delayedResize, 750);
  setTimeout(delayedResize, 1250);
  setTimeout(delayedResize, 1500);

  $(document).on("touchmove", function (e) {
    if (!$(e.target).parents(".scroll")[0]) {
      e.preventDefault();
    }
  });
}

function updateFrame() {
  ss.ScrollManager.update();
  ss.SiteManager.update();

  requestAnimFrame(updateFrame);
}

function resizeFrame() {
  var width = $(window).width();
  var height = $(window).height();
  ss.SiteManager.resize(width, height);
}

function focus() {
  $(window).resize();

  ss.SiteManager.focus();

  ss.ScrollManager.focus();
}

function blur() {
  ss.SiteManager.blur();

  ss.ScrollManager.blur();
}
