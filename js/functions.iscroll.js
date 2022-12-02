function probeCarousel(name) {
  var items = SinkingShip[name].pages.length,
    itemWidth = SinkingShip[name].pages[0][0].width,
    scrollerWidth = SinkingShip[name].scrollerWidth,
    scrollerElem = $(SinkingShip[name].scroller).attr("class");

  //gives active page an active class and depth class names
  probeHighlightPage(scrollerElem, SinkingShip[name].currentPage.pageX, 3);

  SinkingShip[name].on("scrollStart", function () {
    if (name == "seriesNavCarousel") {
      $(".pg-series > nav").addClass("disabled");
    }
    if (name == "seriesNewsCarousel") {
      $(".pg-news > nav").addClass("disabled");
    }
    if (name == "careersCarousel") {
      $(".pg-careers > nav").addClass("disabled");
    }
  });
  SinkingShip[name].on("scrollEnd", function () {
    if (name == "seriesNavCarousel") {
      var totalItems = $(".series-carousel-nav > li").length;

      //clear classes
      $(".pg-series nav").removeClass("disabled");
      $(".series-carousel-nav-wrapper")
        .parent("nav")
        .removeClass("scrollStart scrollEnd ");

      if (this.currentPage.pageX == 0) {
        $(".series-carousel-nav-wrapper").parent("nav").addClass("scrollStart");
      } else if (this.currentPage.pageX == totalItems - 1) {
        $(".series-carousel-nav-wrapper").parent("nav").addClass("scrollEnd");
      }
    }

    if (name == "seriesNewsCarousel") {
      var totalItems = $(".news-carousel > li").length;

      //clear classes
      $(".pg-news nav").removeClass("disabled");
      $(".news-carousel-wrapper")
        .closest(".pg-news")
        .find("nav")
        .removeClass("scrollStart scrollEnd");

      if (this.currentPage.pageX == 0) {
        $(".news-carousel-wrapper")
          .closest(".pg-news")
          .find("nav")
          .addClass("scrollStart");
      } else if (this.currentPage.pageX == totalItems - 1) {
        $(".news-carousel-wrapper")
          .closest(".pg-news")
          .find("nav")
          .addClass("scrollEnd");
      }
    }

    if (name == "careersCarousel") {
      var totalItems = $(".careers-carousel > li").length;

      //clear classes
      $(".pg-careers nav").removeClass("disabled");
      $(".careers-carousel-wrapper")
        .closest(".pg-careers")
        .find("nav")
        .removeClass("scrollStart scrollEnd");

      if (this.currentPage.pageX == 0) {
        $(".careers-carousel-wrapper")
          .closest(".pg-careers")
          .find("nav")
          .addClass("scrollStart");
      } else if (this.currentPage.pageX == totalItems - 2) {
        $(".careers-carousel-wrapper")
          .closest(".pg-careers")
          .find("nav")
          .addClass("scrollEnd");
      }

      if (totalItems <= 2) {
        $(".careers-carousel-wrapper")
          .closest(".pg-careers")
          .find("nav")
          .removeClass("scrollStart scrollEnd");
      }
    }

    probeHighlightPage(
      scrollerElem,
      probeCurPage(name, itemWidth, this.x * -1, scrollerElem),
      3
    );
  });
  SinkingShip[name].on("scroll", function () {
    if (name == "seriesNavCarousel") {
      $(".pg-series > nav").addClass("disabled");
    }
    if (name == "seriesNewsCarousel") {
      $(".pg-news > nav").addClass("disabled");
    }

    probeHighlightPage(
      scrollerElem,
      probeCurPage(name, itemWidth, this.x * -1, scrollerElem),
      3
    );
  });
}

function gotoScroll(name, num, speed) {
  event.preventDefault();
  //var transition = speed || 250;
  var transition = 250;

  if (num == "next") {
    SinkingShip[name].goToPage(
      SinkingShip[name].currentPage.pageX + 1,
      0,
      transition
    );
    return;
  } else if (num == "prev") {
    SinkingShip[name].goToPage(
      SinkingShip[name].currentPage.pageX - 1,
      0,
      transition
    );
    return;
  }
  SinkingShip[name].goToPage(num, 0, speed);

  //remove disabled fallback if scrollend fails
  setTimeout(function () {
    if (name == "seriesNavCarousel") {
      $(".pg-series > nav").removeClass("disabled");
    }
    if (name == "seriesNewsCarousel") {
      $(".pg-news > nav").removeClass("disabled");
    }
  }, 500);
}

// get active item based on position
function probeCurPage(name, itemWidth, curPosi, scrollerElem) {
  var activePg = Math.round(curPosi / itemWidth);
  if (activePg < 0) {
    activePg = 0;
  }
  return activePg;
}

//highlight the active spots in the nav
function probeHighlightPage(scrollerElem, activePg, depth) {
  var target =
    $("." + scrollerElem + " > *:eq(" + activePg + ")").attr("data-target") ||
    "annedroids";

  if (scrollerElem == "series-carousel-nav") {
    changeSeriesPg(target);
  }

  $("." + scrollerElem + " > *").removeClass(
    "prev1 prev2 prev3 active next1 next2 next3"
  );

  $("." + scrollerElem + " > *:eq(" + activePg + ")").addClass("active");

  for (i = 1; i <= depth; i++) {
    $("." + scrollerElem + " > *:eq(" + (activePg - i) + ")").addClass(
      "prev" + i
    );
    $("." + scrollerElem + " > *:eq(" + (activePg + i) + ")").addClass(
      "next" + i
    );
  }
}

// change the series show
function changeSeriesPg(target) {
  $(".series-carousel .show-panel").removeClass("active");
  $(".series-carousel .show-panel .departments li").removeClass("active");

  $(".series-carousel .show-panel." + target).addClass("active");
  var target = $(".series-carousel .show-panel." + target);
  var activeDepartment = $(target).attr("data-startPanel");

  changeSeriesPanel(target, activeDepartment);
}

// activate the proper department panel
function changeSeriesPanel(target, activeDepartment) {
  clearVideos();

  $(target)
    .find('[data-paneltarget="' + activeDepartment + '"]')
    .addClass("active");

  var panel = $(target).find("ul li." + activeDepartment),
    doneFunction =
      getFunctionForString($(panel).attr("data-loadfunc")) || doNothing;

  $(panel).addClass("active");

  doneFunction();
}

//remove all youtube iframes
function clearVideos() {
  $(".video-wrapper").find("iframe").remove();
}

//nav item clicked and goto series
$(document).on("tap", ".series-carousel-nav li", function () {
  var page = $(this).index();
  gotoScroll("seriesNavCarousel", page, 250);
});

//change departments within a series show
$(document).on("click", ".show-panel nav a", function (e) {
  e.preventDefault();
  clearVideos();

  var department = $(this).attr("data-panelTarget"),
    show = $(this).closest(".show-panel");

  var panel = $(show).find("ul li." + department);
  var doneFunction =
    getFunctionForString($(panel).attr("data-loadfunc")) || doNothing;

  $(show).find(".departments li").removeClass("active");
  $(show)
    .find(".departments li." + department)
    .addClass("active");
  doneFunction();
});

//Video play button click to create iframe
$(document).on("click", ".video-wrapper .btn-play ", function () {
  var videoCode = $(this).closest("[data-videoCode]").attr("data-videoCode");
  var destination = $(this).closest("div.sized");

  $(destination).append(
    '\
		<iframe width="560" height="315" src="https://www.youtube.com/embed/' +
      videoCode +
      '?autoplay=1&rel=0" frameborder="0"></iframe>\
		'
  );
});

function doNothing() {}
