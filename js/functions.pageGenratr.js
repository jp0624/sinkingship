// =======================================================
//                GENERATR VARIABLES
// -------------------------------------------------------
var startPage = 0,
  pageScroll,
  position,
  pageWidth = 0,
  scrollPagesQty,
  userLogin = [],
  site = [],
  params = [],
  generatrToBuild = 0,
  generatrLoaded = 0,
  generatrComplete = false;

// =======================================================
//              GENERATR DOCUMENT FUNCTIONS
// -------------------------------------------------------

/**
 * @create {Object} Set available global functions on page events.
 */
var GeneratrFunctions = function () {
  var _this = this;

  // standard functions to load on global dom is ready
  _this.documentReady = function () {
    _this.documentEvents(); // setup dom element event listeners

    genratrGrab("body");

    $(window).resize(_this.documentResize());
  };

  // standard functions to load/refresh on global dom is resized
  _this.documentResize = function () {};

  _this.documentEvents = function () {
    /*
		$(document).on('OVERLAY_CREATED', showOverlay);

		$(document).on('OVERLAY_REMOVED', hideOverlay);
		*/
  };
};

var generatrInstance = generatrInstance || new GeneratrFunctions();

// =======================================================
//           PAGE GENERATR SPECIFIC FUNCTIONS
// -------------------------------------------------------

/**
 * Check the URL when page loads to detect if parameters exist and need to be pushed using pushState
 */
function genratrCheckURL() {
  //get the search substring from the window location object
  var pathParam = location.search.substring(1) || false;

  //if search substring is empty make status fals
  if (!pathParam) {
    params.status = false;
  } else {
    //set status to true which triggers additional functions
    params.status = true;

    // send url params out for removal of "dir=/" and any trailing or starting "/"'s
    pathParam = cleanPath(pathParam);

    //split the sub directories into an array within the params.target object
    params.target = pathParam.split("/");
  }
  return params;
}

function getFunctionForString(str) {
  if (!str) {
    return jQuery.noop();
  }
  var parts = str.split(".");
  if (parts.length > 1) {
    var obj = window[parts[0]];
    for (var i = 1; i < parts.length - 1; i++) {
      obj = obj[parts[i]];
    }
  } else {
    obj = window;
  }

  return obj[parts[parts.length - 1]];
}

/**
 * Find elements in which to populate with content
 * @param container {jQuery element} - The element in which contains the sections to find content for.
 */
function genratrGrab(container) {
  generatrToBuild = $(container).find("[data-genratr]").length;
  generatrToLoad = $(container).find("[data-genratr-wrapper]").length;

  $(container)
    .find("[data-genratr-wrapper]")
    .each(function () {
      loadFunction =
        getFunctionForString($(this).attr("data-genratr-loadfunc")) || false;
      if (loadFunction) {
        loadFunction();
      }
      setTimeout(function () {
        setStageStatus(0);
      }, 500);
    });

  // find all	content to build within container who have genratr attribute
  $(container)
    .find("[data-genratr]")
    .each(function () {
      var url = $(this).attr("data-genratr"),
        selector = "[data-genratr-wrapper]",
        target = this,
        doneFunction =
          getFunctionForString($(this).attr("data-genratr-doneFunc")) || false;
      genratrLoad(url, selector, target, doneFunction);
    });
}

/**
 * Load data from the server and place the returned HTML into the matched element/target.
 * @param  url {string} - The path to the file to load.
 * @param  selector {jQuery element} - The object to find within the url/file to pull HTML from.
 * @param  target {jQuery element} - The object to put the data into.
 * @param  doneFunction {function} - The function to run on complete.
 */
function genratrLoad(url, selector, target, doneFunction) {
  //Load data from the server and place the returned HTML into the matched element/target.
  $(target).load(url + " " + selector, function (response, status, xhr) {
    // detect if load results in error
    if (status == "error") {
      // send error message into target elememnt
      $(target).html(
        "Could not load: " + url + " " + xhr.status + " " + xhr.statusText
      );
      //if error then return nothing
      return;
      // detect if load results in success
    } else if (status == "success") {
      // if a done function was specified then run it
      // used to initiate scripts on dynamicaly loaded content
      // else try to find one from content being loaded
      if (doneFunction) {
        doneFunction();
      } else {
        getLoadFunction(target);
      }
      generatrLoaded++;
      generatrCheckLoad();
    }
  });
}
/**
 * get a done function from the content being loaded then run it
 */
function getLoadFunction(target) {
  if ($("[data-genratr-loadfunc]").length > 0) {
    var loadFunction = $(target)
      .find("[data-genratr-loadfunc]")
      .attr("data-genratr-loadfunc");
    var doneFunction = getFunctionForString(loadFunction);

    if (doneFunction) {
      doneFunction();
    }
  }
}
/**
 * Mark content load as complete on success then check if all have loaded.
 */
function generatrCheckLoad(container) {
  // check if all content has been loaded for the page
  if (generatrLoaded == generatrToBuild) {
    generatrToBuild = 0;
    generatrLoaded = 0;
    // send trigger that overlay has been created for function timing with other functions
    generatrComplete = true;
    $(document).trigger("GENERATR_COMPLETE");
  }
}

/**
 * Using stateObject pus or replace the active history state
 * @param  url {string} - The url to push/replace into the browser history.
 * @param  title {string} - The title of the history object being added.
 * @param  _replace {jQuery variable} - if true then function will replace the active history state rather then pushing a new one.
 */
function genratrSetURL(url, _replace) {
  //stateObject = {}; // create blank stateObject array to be used to Push or replace history states on url change
  //detect wether should create new history item or replace the current one
  if (_replace) {
    window.history.replaceState(url, "Odd Squad - " + url, origin + url);
  } else {
    window.history.pushState(url, "Odd Squad - " + url, origin + url);
  }
}

/**
 * Load data from the server and place the returned HTML into the matched element/target.
 * @param  url {string} - The path to the file to load.
 * @param  selector {jQuery element} - The object to find within the url/file to pull HTML from.
 * @param  target {jQuery element} - The object to put the data into.
 * @param  doneFunction {function} - The function to run on complete.
 */
function genratrSetTitle(url) {
  // Change active page title to match the page change
  $("title").load(
    origin + url + "/index.html" + " " + "title",
    function (response, status, xhr) {
      if (status == "error") {
        console.log(
          "Could not load: " + url + " " + xhr.status + " " + xhr.statusText
        );
        return;
      } else {
        if ($("title > title").exists() == true) {
          $("title > title").unwrap();
        }
      }
    }
  );
}

/**
 * Open overlay for the target child.
 * @param  target {array} - The path to the sections to move to.
 */
function initOverlay(target, doneFunction) {
  // only if an overlay doesnt exist then create a new one.
  if (!$(".ov-wrapper").exists()) {
    // add the overlay container to add the page content within
    $("body").append(
      '<div class="ov-wrapper" data-type="' + target[1] + '"></div>'
    );

    // grab the content that needs to be added to the overlay area
    //genratrLoad(url, selector, target, doneFunction)
    if (doneFunction) {
      genratrLoad(
        "/ss/" + target[0] + "/" + target[1] + "/index.html",
        "[data-genratr-wrapper]",
        '.ov-wrapper[data-type="' + target[1] + '"]',
        doneFunction
      );
    } else {
      genratrLoad(
        "/ss/" + target[0] + "/" + target[1] + "/index.html",
        "[data-genratr-wrapper]",
        '.ov-wrapper[data-type="' + target[1] + '"]'
      );
    }
  }

  // send trigger that overlay has been created for function timing with other functions
  $(document).trigger("OVERLAY_CREATED", target[1]);
}
// =======================================================
//              GENERATR DOCUMENT LISTENERS
// -------------------------------------------------------

//page and window specific listeners
$(document).on("GENERATR_COMPLETE", function () {
  // do something once all content is loaded for the page
});
