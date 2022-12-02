/**
 * @create {Object} Set available global functions on page events. 
 */
var SinkingShip = [];
var currentScene = 0,
	seriesLoaded = false,
	seriesCreated = false,
	newsLoaded = false,
	newsCreated = false,
	crewLoaded = false,
	crewCreated = false,
	careersLoaded = false,
	careersCreated = false,
	origin = '',
	baseFolder = 'ss',
	baseTitle = 'Sinking Ship Entertainment - ',
	seriesNav = true;	
	months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


var	velocity = 0, // current speed that we're moving towards the target.
	targetPosition = 0,	// the target position that w'ere aiming towards.
	lastMousePosY, // Y coordinate of the mouse last frame.
	lastMousePosX, // X coordinate of the mouse last frame.
	interacting = false, // whether or not the user is currently interacting with the page.
	lastYPos,
	prevTime, // the time of the last frame.
	curTime; // the time of this frame.

var GlobalFunctions = function() {
	// standard functions to load on global dom is ready

	this.documentReady = function() {		
		
		//start up the main generic functions
		getCurDate();			// get the current date to use for date verifications
		getWinSize();			// adds browser win size specs to winSize object with [x] & [y]
		
		setWinOrientation();
		
		//prefix();				// adds browser prefix objects for future use ex: {dom: "WebKit", lowercase: "webkit", css: "-webkit-", js: "Webkit"}
		
		if($('.mobile').length == 0){
			setWrapperSize();
			startSceneLoop();
			addInteractionListeners();	
		};
		
		generatrInstance.documentReady();
		
		//startup the flowtype function
		$('body').flowtype({
			minimum   : 100,
			maximum   : 1500,
			fontRatio : 40
		});
		
		
		var isMobileInline = {
			Android: function() {
				return navigator.userAgent.match(/Android/i);
			},
			BlackBerry: function() {
				return navigator.userAgent.match(/BlackBerry/i);
			},
			iOS: function() {
				return navigator.userAgent.match(/iPhone|iPad|iPod/i);
			},
			Opera: function() {
				return navigator.userAgent.match(/Opera Mini/i);
			},
			Windows: function() {
				return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
			},
			any: function() {
				return ( isMobileInline.Android() || isMobileInline.BlackBerry() || isMobileInline.iOS() || isMobileInline.Opera() || isMobileInline.Windows () );
			}
		};
		
			// mobile redirect
		if ( isMobileInline.any () ) {
		} else {
			$('html').addClass('desktop');
		}

		
			
		
		$( window ).resize(function() {
		  globalInstance.documentResize();
		});
		this.documentEvents();	// setup dom element event listeners
		
			
		
	};
	// standard functions to load/refresh on global dom is resized
	this.documentResize = function() {
		
		//start up the main generic functions
		getWinSize();	// adds browser win size specs to winSize object with [x] & [y]
		setWinOrientation();
		
		if($('.mobile').length == 0){
			setWrapperSize();
		};
		

	};
	this.documentEvents = function() {
		
	};
	
};
var globalInstance = globalInstance || new GlobalFunctions();

		
function setWinOrientation() {
	if(winSize.y > winSize.x){
		$('html').removeClass('landscape');
		$('html').addClass('portrait');
		console.log('orientation: portrait');
		
	} else if(winSize.x > winSize.y){
		$('html').removeClass('portrait');
		$('html').addClass('landscape');
		console.log('orientation: landscape');
		
	} else {
		console.log('orientation not detected');
	};
};


/**
 * Get news details from json doc and set trigger when succesful
 * @return {Object}  - [site] An object containing award details to be used throughout the site.
 */
function fetchNews() {
	
	SinkingShip.news = [];
	copyJSONIntoObject('../json/news.json', SinkingShip.news, fetchNewsComplete);
	
};

/**
 * Function to fire when json has load has completed.
 */
function fetchNewsComplete() {
	
	SinkingShip.news = SinkingShip.news.feed.entry;
		
	newsLoaded = true;
	$(document).trigger('NEWS_LOADED');
	
	buildNews();
}

function buildNews() {
	
	var NEWS_CONTAINER = '.pg-news .news-carousel';
	
	// featured count variable
	var f = 0;
	// pair count variable
	var p = 0;
	// loop through all news items and initiate the news template
	for(var i = 0; i < SinkingShip.news.length; i++) {
		
		var showname		= SinkingShip.news[i].gsx$show.$t;
		var shownameClean	= showname.toLowerCase().replace('/[^a-zA-Z]+/', '').replace(/ /g,'');
		
		var month		= months[SinkingShip.news[i].gsx$month.$t - 1];
		var year		= SinkingShip.news[i].gsx$year.$t;
		var url			= SinkingShip.news[i].gsx$link.$t;
		
		//check if the url has http included, if not then add it
		if(!url.startsWith('http://')){
			url = 'http://' + url
		}
		var headline	= SinkingShip.news[i].gsx$headline.$t;
		
		// get the particular news content for i
		// if pair is complete then reset it
		if(p > 1) {
			// add next empty item
			$(NEWS_CONTAINER).append('<li class="newsItem"></li>');
			p = 0;
		};
		// if news item is a multiple of 7 then set as featured
		if(i % 7 == 0){
			// add content to next available news block and give class of featured
			$(NEWS_CONTAINER + ' li:last-child').addClass('featured').append('\
				<a  href="' + url + '" target="_blank" class="' + shownameClean + '" data-newsId="' + i + '">\
				<h1>' + month + ' ' + year + '</h1>\
				<span>' + showname + '</span>\
				<h2>' + headline + '</h2>\
				<p> + Read More </p> </a>\
			');
			f++;
			// add next empty item
			$(NEWS_CONTAINER).append('<li class="newsItem"></li>');
		} else {
			// add content to next available news block
			$(NEWS_CONTAINER + ' li:last-child').addClass('couple').append('\
				<a  href="' + url + '" target="_blank" class="' + shownameClean + '" data-newsId="' + i + '">\
				<h1>' + month + ' ' + year + '</h1>\
				<span>' + showname + '</span>\
				<h2>' + headline + '</h2>\
				<p> + Read More </p> </a>\
			');
			p++;
		};
		// once all news items are complete fire trigger to initiate carousel script
		if(i == SinkingShip.news.length - 1) {
			initSeriesNewsCarousel();
			newsCreated = true;
			$(document).trigger('NEWS_CREATED');
		};
		
	};
	
}

function initSeriesNewsCarousel() {
	var numItems = $('.news-carousel').find('li').length,
		numFeaturedItems = $('.news-carousel').find('li.featured').length,
		totalItems = numItems + numFeaturedItems,
		carouselWidth = 20 * totalItems,
		itemWidth = 100 / totalItems;
		
		console.log('numItems : ', numItems);
		console.log('numFeaturedItems : ', numFeaturedItems);
		
		if($('html.mobile').length <= 0){
			$('.news-carousel').css('width', carouselWidth + '%');
			
			$('.news-carousel li.couple').each( function() {
				$(this).css('width', itemWidth + '%');
			});
			$('.news-carousel li.featured').each( function() {
				$(this).css('width', (itemWidth * 2) + '%');
			});
	
			SinkingShip.seriesNewsCarousel = new IScroll('.news-carousel-wrapper', {
				snap: true,
				tap: true,
				momentum: false,
				eventPassthrough: true,
				scrollX: true,
				scrollY: false,
				disableMouse: false,
				disablePointer: false,
				probeType: 2
				
			});
			
			probeCarousel('seriesNewsCarousel');
		};
};

function setWrapperSize() {
	
	/*
	if(winSize.x / winSize.y > 2){
		var sectionHeight = $('section').innerHeight();
			
		$('.pg-wrapper').each( function() {
			$(this).width(sectionHeight * 2);
		});
		
	} else {
		$('.pg-wrapper').each( function() {
			$(this).width('100%');
		});
	};
	*/
};

/**
 * Get news details from json doc and set trigger when succesful
 * @return {Object}  - [site] An object containing award details to be used throughout the site.
 */
function fetchCrew() {
	
	SinkingShip.crew = [];
	//copyJSONIntoObject('json/team.json', SinkingShip.crew, fetchCrewComplete);
	
};

/**
 * Function to fire when json has load has completed.
 */
function fetchCrewComplete() {
	
	SinkingShip.crew = SinkingShip.crew.feed.entry;
	
	crewLoaded = true;
	$(document).trigger('CREW_LOADED');
	
}
/**
 * Get news details from json doc and set trigger when succesful
 * @return {Object}  - [site] An object containing award details to be used throughout the site.
 */
function fetchSeries() {
	
	SinkingShip.series = [];
	copyJSONIntoObject('../json/series.json', SinkingShip.series, fetchSeriesComplete);
	
};

/**
 * Function to fire when json has load has completed.
 */
function fetchSeriesComplete() {
	
	SinkingShip.series = SinkingShip.series.feed.entry;
	
	seriesLoaded = true;
	$(document).trigger('SERIES_LOADED');
	
	buildSeries();
}
function buildSeries() {
	initSeriesNavCarousel();
	seriesCreated = true;
	$(document).trigger('SERIES_CREATED');
}
function initSeriesNavCarousel() {
	$('.series-carousel-nav').slick({
		infinite: true,
		slidesToShow: 3,
		slidesToScroll: 1,
		arrows: false,
		focusOnSelect: true,
		centerMode: true
	});
	$('.series-carousel-nav').on('beforeChange', function(event, slick, currentSlide, nextSlide){
		console.log(nextSlide);
		$('.series-carousel-nav').find('[data-slick-index="' + nextSlide + '"]').addClass('slick-center');
		changeSeriesPg($('.series-carousel-nav').find('[data-slick-index="' + nextSlide + '"]').attr('data-target'));
	});
	
	$(document).on('click', '#seriesNav-click-next', function(){
		$('.series-carousel-nav').slick('slickNext');
	});
	$(document).on('click', '#seriesNav-click-prev', function(){
		$('.series-carousel-nav').slick('slickPrev');
	});
}
/**
 * Get news details from json doc and set trigger when succesful
 * @return {Object}  - [site] An object containing award details to be used throughout the site.
 */
function fetchCareers() {
	
	SinkingShip.careers = [];
	copyJSONIntoObject('json/careers.json', SinkingShip, fetchCareersComplete);
	
};

/**
 * Function to fire when json has load has completed.
 */
function fetchCareersComplete() {
		
	careersLoaded = true;
	$(document).trigger('CAREERS_LOADED');
	
	buildCareers();
}

function buildCareers() {
	
	var CAREERS_CONTAINER = '.pg-careers .careers-carousel';
	
	// featured count variable
	var f = 0;
	// pair count variable
	var p = 0;
	// loop through all news items and initiate the news template
	for(var i = 0; i < SinkingShip.careers.length; i++) {
		
		var title			= SinkingShip.careers[i].title;
		var department		= SinkingShip.careers[i].department;
		var opening			= SinkingShip.careers[i].opening;
		
		var departmentClean	= department.toLowerCase().replace('/[^a-zA-Z]+/', '').replace(' ', '');
		SinkingShip.careers[i].departmentClean = departmentClean;
		
		SinkingShip.careers[i].desc = SinkingShip.careers[i].desc.join('\n');
		var desc			= SinkingShip.careers[i].desc;
		
		// get the particular news content for i
		// if pair is complete then reset it
		if(p > 1) {
			// add next empty item
			$(CAREERS_CONTAINER).append('<li class="careersPost careersCarousel-inside"></li>');
			p = 0;
		};

		// add content to next available news block
		$(CAREERS_CONTAINER + ' li:last-child').append('\
			<a class="' + departmentClean + '" href="#" data-careerId="' + i + '">\
			<span>' + department + '</span>\
			<h1>' + title + '</h1>\
			<h2>' + opening + '</h2>\
			</a>\
		');
		p++;
		
		// once all news items are complete fire trigger to initiate carousel script
		if(i == SinkingShip.careers.length - 1) {
			initCareersCarousel()
			careeersCreated = true;
			$(document).trigger('CAREERS_CREATED');
		};
		
	};
	
}
function changeCareerDetails(careerId) {
	
	var CAREER_DETAILS_CONTAINER = '.pg-careers .career-details',
		title			= SinkingShip.careers[careerId].title,
		department		= SinkingShip.careers[careerId].department,
		departmentClean	= SinkingShip.careers[careerId].departmentClean,
		opening			= SinkingShip.careers[careerId].opening,
		desc			= SinkingShip.careers[careerId].desc;
		
	$(CAREER_DETAILS_CONTAINER).attr('data-department', departmentClean);
	
	$(CAREER_DETAILS_CONTAINER + ' > h1').html(title);
	$(CAREER_DETAILS_CONTAINER + ' > span').html(department);
	$(CAREER_DETAILS_CONTAINER + ' > .career-content').html(opening + desc);
		
};
function initCareersCarousel() {
	
	var totalItems = $('.careers-carousel').find('li').length,
		carouselWidth = 50 * totalItems,
		itemWidth = 100 / totalItems;
	
		if($('html.mobile').length <= 0){
			$('.careers-carousel').css('width', carouselWidth + '%');
			
			$('.careers-carousel li').each( function() {
				$(this).css('width', itemWidth + '%');
			});
	
			SinkingShip.careersCarousel = new IScroll('.careers-carousel-wrapper', {
				snap: true,
				tap: true,
				momentum: false,
				eventPassthrough: true,
				scrollX: true,
				scrollY: false,
				disableMouse: false,
				disablePointer: false,
				probeType: 2
				
			});
			probeCarousel('careersCarousel');
		};
};
function videoOverlay(videoCode, event){
	event.preventDefault();
	
	var destination = $('.videoOverlay .video-wrapper .sized');
	
	$('.videoOverlay').addClass('display');
	
	$(destination).html('<iframe width="560" height="315" src="https://www.youtube.com/embed/' + videoCode + '?rel=0" frameborder="0"></iframe>');
	
};

/**
 * Listener for the start of touch / mouse interactions.
 * @param  {Mouse/Touch Event} evt - The mouse event.
 */
function onTouchStart(evt) {
	interacting = true;
	lastMousePosY = evt.pageY;
	lastMousePosX = evt.pageX;
	//targetPosition -= 2;
};
/**
 * Listener for the end of touch / mouse interactions.
 * @param  {Mouse/Touch Event} evt - The mouse event.
 */
function onTouchEnd(evt) {
	interacting = false;
};

/**
 * Listener for when a touch / mouse interaction moves.
 * @param  {Mouse/Touch Event} evt - The mouse/ touch event.
 */
function onTouchMove(evt) {
	
	if(interacting) {
		var mouseDelta = evt.pageX - lastMousePosY;
		console.log('mouseDelta: ', mouseDelta);
		targetPosition += mouseDelta * 2;
		lastMousePosY = evt.pageY;
		lastMousePosX = evt.pageX;
	}
};

var KEY_CODE_LEFT_ARROW = 37; // key code for up arrow key.
var KEY_CODE_RIGHT_ARROW = 39; // key code for down arrow key.

/**
 * Add all the interaction listeners.
 */
function addInteractionListeners() {
	$(window).keydown(onKeyDown);
	window.addEventListener("mousedown", 	onTouchStart);
	window.addEventListener("touchstart", 	onTouchStart);
	window.addEventListener("mousemove", 	onTouchMove);
	window.addEventListener("touchmove", 	onTouchMove);
	window.addEventListener("mouseup", 		onTouchEnd);
	window.addEventListener("mouseout", 	onTouchEnd);
	window.addEventListener("touchend", 	onTouchEnd);
	window.addEventListener("touchleave", 	onTouchEnd);
	window.addEventListener("touchcancel", 	onTouchEnd);
}

function onKeyDown(evt) {

	// check which key code we got, and act accordingly.
	switch(evt.keyCode) {
		case KEY_CODE_LEFT_ARROW:
			console.log('LEFT CLICKED');
			findHorzBtns('prev');
		break;
		case KEY_CODE_RIGHT_ARROW:
			console.log('RIGHT CLICKED');
			findHorzBtns('next');
		break;
	}
};


function getCurScene() {
	currentScene = Math.abs(Math.round(ss.ScrollManager.targetPosition () / winSize.y));
	//console.log("CS: " + currentScene)
	return currentScene;
};

function setCurScene(currentScene) {
	var curScene = $('#contentContainer').children('section').index($('.activeScene'));
	if(curScene == currentScene) {
		return
	} else {
		if($('section').is('[class*="show-"]')) {
			$('section').removeClass(function (index, css) {
				return (css.match (/(^|\s)show-\S+/g) || []).join(' ');
			});
		};

		$('body').attr('data-activeScene', currentScene);
		
		$('#contentContainer > section.activeScene').removeClass('activeScene');
		$('#contentContainer > section:eq('+ currentScene +')').addClass('activeScene');
	};
};


/**
 * Start the update loop.
 */
function startSceneLoop(){
	window.requestAnimationFrame(sceneUpdate);
};

/**
 * Main update function.
 */
function sceneUpdate() {
	if($('.mobile').length == 0){
		setCurScene(getCurScene());
	};
	
	window.requestAnimationFrame(sceneUpdate);
}

function findHorzBtns(direction) {
	var currentScene = getCurScene();	
	console.log('current scene is: ', currentScene);
	
	var $currentScene = $ ( 'section.activeScene' );


	switch ( direction ) {
		case 'next' :

				// double check if the crew section is active
			if ( $currentScene.attr ( "data-title" ) == "crew" ) {

					// check if were at the first node, and cycle to the last
				var $currentClick = $ ( ".crew-lst dd.active" );
				if ( $currentClick.is ( $ ( ".crew-lst dd" ).last () ) ) {

					$ ( ".crew-lst dd" ).first ().click ();
						// were done
					return;
				}

					// skip over the dt elements
				var $nextCrew = $ ( ".crew-lst dd.active" ).next ();
				if ( $nextCrew.prop ( "tagName" ).toLowerCase () == "dt" ) {
					$nextCrew = $nextCrew.next ();
				}
				
				$nextCrew.click ();
				
			} else {
				$currentScene.find ('.btn-carousel.btn-next, .btn-carousel.btn-next img' ).click ();
			}
			break;
		case 'prev' :

				// double check if the crew section is active
			if ( $currentScene.attr ( "data-title" ) == "crew" ) {

					// check if were at the first node, and cycle to the last
				var $currentClick = $ ( ".crew-lst dd.active" );
				if ( $currentClick.is ( $ ( ".crew-lst dd" ).first () ) ) {

					$ ( ".crew-lst dd" ).last ().click ();
						// were done
					return;
				}

					// skip over the dt elements
				var $prevClick = $currentClick.prev ();
				if ( $prevClick.prop ( "tagName" ).toLowerCase () == "dt" ) {
					$prevClick = $prevClick.prev ();
				}
				
				$prevClick.click ();

			} else {
				$currentScene.find ('.btn-carousel.btn-prev, .btn-carousel.btn-prev img' ).click ();
			}


			
			break;
	}

};

if (typeof String.prototype.startsWith != 'function') {
  // see below for better implementation!
  String.prototype.startsWith = function (str){
    return this.indexOf(str) === 0;
  };
}

/**
 * Check if value is even or odd
 * @return {Boolean} - true if the object exists, false otherwise.
 */
function isEven(value) {
	return (value%2 == 0);
}


/**
 * Get the window size.
 * @return {Object} and object with {x,y} representing the width and height of the window respectively.
 * ex: prefix {dom: "WebKit", lowercase: "webkit", css: "-webkit-", js: "Webkit"}
 */
function getWinSize() {
	return winSize = {
		x:$(window).width(),
		y:$(window).height()
	};
};

/**
 * Get the current date.
 * @return {Object} and object with {d,m,y} representing the day, month and year.
 */
function getCurDate() {
	var newDate = new Date();
	return curDate = {
		d: newDate.getDate(),
		m: newDate.getMonth()+1,
		y: newDate.getFullYear()
	};
};

/**
 * Translate an element a given amount in the x, y a z axes.
 * @param  {string} elem - A jQuery selector to find the element.
 * @param  {Number} x    - The amount to translate the object along the x axis.
 * @param  {Number} y    - The amount to translate the object along the y axis.
 * @param  {Number} z    - The amount to translate the object along the z axis.
 */
function translate(elem, x, y, z){
	var elemMatrix = 	getMatrix(elem),
		matrixType =	elemMatrix[1].length == 6 ? '2D' : elemMatrix[1].length == 17 ? '3D' : undefined,
		translateAxis = {
			x: x !== undefined ? x : matrixType == '2D' ? elemMatrix[1][4] : matrixType == '3D' ? elemMatrix[1][13] : 0,
			y: y !== undefined ? y : matrixType == '2D' ? elemMatrix[1][5] : matrixType == '3D' ? elemMatrix[1][14] : 0,
			z: z !== undefined ? z : matrixType == '2D' ? 0 : matrixType == '3D' ? elemMatrix[1][15] : 0
		};
	$(elem).css(prefix.css + 'transform', 'translateX(' + translateAxis.x + 'px) translateY(' + translateAxis.y + 'px) translateZ(' + translateAxis.z + 'px)');
};

/**
 * Get the transformation matrix for a given element.
 * @param  {string} element - A jQuery selector to find the element.
 * @return {Array}        - An array containing the matrix and it's values in the form [matrix, values].
 */
function getMatrix(element) {

	var	matrix = $(element).css(prefix.css + 'transform');
	matrixValues = matrix.match(/-?[0-9\.]+/g);

	return [matrix, matrixValues];
};

/**
 * Add css prefixes to elements that need them.
 * @return {[typ
 */
function prefix() {
	var styles = window.getComputedStyle(document.documentElement, '');

	pre = (Array.prototype.slice
			.call(styles)
			.join('')
			.match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
		)[1],
		dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
	return prefix = {
		dom: dom,
		lowercase: pre,
		css: '-' + pre + '-',
		js: pre[0].toUpperCase() + pre.substr(1)
	};
};


function getFunctionForString(str) {
	if(!str) {
		return jQuery.noop();
	}
	var parts = str.split(".");
	if(parts.length > 1) {

		var obj = window[parts[0]];
		for(var i = 1; i <	parts.length - 1; i++) {
			obj = obj[parts[i]];
		}
	} else {
		obj = window;	
	}

	return obj[parts[parts.length - 1]];
}

/**
 * Replace all occurrences of a given item in a string with a replacement.
 * @param  {String} string      The string whose contents to replace.
 * @param  {String} item        The string to replace.
 * @param  {String} replacement The replacement string.
 * @return {String}             The string with all instances of item replaced by replacement.
 */
function _replaceAll(string, item, replacement) {
	while(string.indexOf(item) !== -1) {
		string = string.replace(item, replacement);
	}
	return string;
}

// change the series show
function changeSeriesPg(target){
	$('.series-carousel .show-panel').removeClass('active');
	$('.series-carousel .show-panel .departments li').removeClass('active');
	
	$('.series-carousel .show-panel.' + target).addClass('active');
	var target = $('.series-carousel .show-panel.' + target);
	var activeDepartment = $(target).attr('data-startPanel');
	
	changeSeriesPanel(target, activeDepartment)
};

// activate the proper department panel
function changeSeriesPanel(target, activeDepartment){
	clearVideos();
	
	$(target).find('[data-paneltarget].active').removeClass('active');
	$(target).find('[data-paneltarget="' + activeDepartment + '"]').addClass('active');
	
	console.log('activeDepartment Clicked: ', activeDepartment);
	console.log('target Clicked: ', target);
	
	var panel = $(target).find('ul li.' + activeDepartment),
		doneFunction = getFunctionForString($(panel).attr('data-loadfunc')) || doNothing;
	
	$(panel).addClass('active');
	
	doneFunction();
};

//remove all youtube iframes
function clearVideos() {
	$('.video-wrapper').find('iframe').remove();
};

/**
 * Copy JSON data into an object, using an asynchronous JQuery call.
 * @param  jsonFile {string} - Thje path to the JSON file to load.
 * @param  object {Object} - The object to put the data into.
 * @param  complete {function} - The function to run on complete.
 * @return {JQuery Object} - JQuery object, if you want to chain more calls.
 */
function copyJSONIntoObject(jsonFile, object, complete) {
	return $.getJSON(jsonFile, 
		function (data) {
			for (var attr in data) {
				object[attr] = data[attr];	
			}
		}).error( 
		function(jqXHR, textStatus, errorThrown) {
			console.log('getJSON error: ', textStatus);
			console.log('getJSON errorThrown: ', errorThrown);
			console.log('arguments: ', arguments);
			console.log("getJSON incoming Text " + jqXHR.responseText);
		}).complete(complete);
}

function resize() {
	jQuery(window).resize();
};
function initLoad() {
	setTimeout( function(){
		$('.pageLoading').removeClass('pageLoading');
	}, 1000);
			
	$ ( "#backgroundCanvas" ).fadeIn ( 750 );
	jQuery(window).resize();
}
function doNothing(){};

			
		//nav item clicked and goto series
		$(document).on('tap', '.series-carousel-nav li', function() {
			
			var page = $(this).index();
			('seriesNavCarousel', page, 500);
			
		});
		//change departments within a series show
		$(document).on('click', '.show-panel nav a', function(e) {
			e.preventDefault();
			clearVideos();
			
			$('.pg-series .show-panel').toggleClass('show-mobile-series-panel-nav');
			
			var department	= $(this).attr('data-panelTarget'),
				show		= $(this).closest('.show-panel');
				
			var panel = $(show).find('ul li.' + department);
			var doneFunction = getFunctionForString($(panel).attr('data-loadfunc')) || doNothing;
				
			$(show).find('.departments li').removeClass('active');
			$(show).find('.departments li.' + department).addClass('active');
			
			$(show).find('nav a').removeClass('active');
			$(this).addClass('active');
			
			doneFunction();
		});
		//Video play button click to create iframe
		$(document).on('click', '.video-wrapper .btn-play ', function() {
			var videoCode	= $(this).closest('[data-videoCode]').attr('data-videoCode');
			var destination = $(this).closest('div.sized');
			
			$(destination).html('\
				<iframe width="560" height="315" src="https://www.youtube.com/embed/' + videoCode + '?autoplay=1&rel=0" frameborder="0"></iframe>\
				');
			
		});
		
		$(document).on('click', '.crew-lst dd', function(event) {
			event.preventDefault();
			$('.pg-crew').removeClass('show-crew-info');
			
			var staffId = $(this).attr('data-crewid');
			staffId = parseInt(staffId);
			
			$('.crew-lst dd.active').removeClass('active');
			$('.crew-info li.active').removeClass('active');
			
			$(this).addClass('active');
			$('.pg-crew').addClass('show-crew-info');
			$('.crew-info li[data-infoid="' + staffId + '"]').addClass('active');
			
		});
		$(document).on('click', '.videoOverlay .clickScreen, .videoOverlay .btn-close', function(event) {
			if(event) {
				event.preventDefault();
			};
			
			$('.videoOverlay').removeClass('display');
			$('.videoOverlay .video-wrapper .sized iframe').remove();
			
		});
		
		$(document).on('tap', '.pg-careers .careersPost a', function(e) {
			e.preventDefault();
			var careerId = $(this).attr('data-careerId');
			console.log('careerId: ', careerId);
			
			changeCareerDetails(careerId);
			$('.pg-careers').toggleClass('show-career-details');
			
		});
		$(document).on('click', '.pg-careers .career-details a.returnTo-careers', function(e) {
			e.preventDefault();
			
			$('.pg-careers').toggleClass('show-career-details');
			
		});
		
		$(document).on('click', '.mobile .pg-careers .careersPost a', function(e) {
			e.preventDefault();
			
			var careerId = $(this).attr('data-careerId');
			console.log('careerId: ', careerId);
			
			changeCareerDetails(careerId);
			
			$('.pg-careers').toggleClass('show-career-details');
			
		});
		// Mobile nav item clicked
		

		//menu in home pg load
		//$(document).on('click', '.pg-home .pg-wrapper nav a', function(e) {
		$(document).on('click', 'body > nav a, .btn-home', function(e) {
			console.log('CLICKED MENU');

			if($(this).attr('data-target')){
				e.preventDefault();
			};
			if($('html.mobile').length <= 0){
				var pageNum = parseInt($(this).attr('data-page'));
				window.ss.SiteManager.setPage(pageNum);
				
			} else if($('html.mobile').length > 0){
				
				$('html').removeClass('show-mobile-nav');
				
				$('.pg-series').removeClass('show-mobile-series');
				$('.pg-crew').removeClass('show-crew-info');
				
				if($(this).is('[data-target]')) {	
					$('section.activeScene').removeClass('activeScene');
					var target = $(this).attr('data-target');
					$('section[data-title="' + target + '"]').addClass('activeScene');
				};
				
			};
		});
				
		if($('html.mobile').length <= 0){
			
				$(document).on('click', '.newsItem a', function(event){
					 if(event) {
						event.preventDefault();
						event.stopPropagation();
					 };
				});
				$(document).on('tap', '.newsItem a', function(event){
					 if(event) {
						event.preventDefault();
						event.stopPropagation();
					 };
					
					var url = $(this).attr('href');
					window.open(url, 'News Link', '_blank ');
					
				});
			
				 $(document).on('click', '.gallery-nav li', function() {
					$(this).closest('.gallery-wrapper').find('li').removeClass('selected');
					
					var imgSrc = $(this).css('background-image'),
						mainImg = $(this).closest('.gallery-wrapper').find('.main-img');
					
					$(mainImg).fadeOut(250, function(){
						$(mainImg).css('background-image', imgSrc);
						$(mainImg).fadeIn(250);
					});
					
					
					$(this).addClass('selected');
				});
			
			
				/**
				 * SPECIAL VERT AND HORZ VERSION
				 * Used to generate font size on body for em dynamic rezing on screen size change
				 */
				$.fn.flowtype = function(options) {
				
				  var settings = $.extend({
					 maximum   : 9999,
					 minimum   : 1,
					 maxFont   : 9999,
					 minFont   : 1,
					 fontRatio : 30
				  }, options),
				
				  changes = function(el) {
					 var $el = $(el),
						elw = $el.width(),
						elh = $el.height(),
						width = elw > settings.maximum ? settings.maximum : elw < settings.minimum ? settings.minimum : elw,
						height = elh > settings.maximum ? settings.maximum : elh < settings.minimum ? settings.minimum : elh,
						fontBaseW = width / settings.fontRatio,
						fontBaseH = height / settings.fontRatio;
					
					
					if(fontBaseW > settings.maxFont && fontBaseH > settings.maxFont) {
						var fontSize = settings.maxFont;
						
					}else if(fontBaseW < settings.minFont && fontBaseH < settings.minFont) {
						var fontSize = settings.minFont;
						
					}else if(fontBaseW > settings.maxFont || fontBaseW < settings.maxFont && fontBaseH > settings.minFont && fontBaseH < settings.maxFont){
						var fontSize = fontBaseH;
						
					}else{
						var fontSize = fontBaseW;
						//var fontSize = fontBase > settings.maxFont ? settings.maxFont : fontBase < settings.minFont ? settings.minFont : fontBase;
					};
					
					 $el.css('font-size', fontSize + 'px');
				  };
				
				  return this.each(function() {
				  // Context for resize callback
					 var that = this;
				  // Make changes upon resize
					 $(window).resize(function(){changes(that);});
				  // Set changes on load
					 changes(this);
				  });
				};
				
		} else if($('html.mobile').length > 0){
		
			jQuery(window).load(function () {
				$('.pageLoading').removeClass('pageLoading');
			});
			/*
			setInterval(function(){
				
				var slide = $('.loadingImage').attr('data-slide') < 12 ? $('.loadingImage').attr('data-slide') : 0;
				
				$('.loadingImage').attr('data-slide', ++slide);
				
			}, 250);
			*/
			
			 $(document).on('click', '.toggleMobile, .show-mobile-nav #contentContainer', function(event) {
				 if(event) {
					event.preventDefault();
					event.stopPropagation();
				 };
				$('html').toggleClass('show-mobile-nav');
				
				$('.pg-series').removeClass('show-mobile-series');
				$('.pg-crew').removeClass('show-crew-info');
				$('.pg-careers').removeClass('show-career-details');
			});
						
			$(document).on('click', '.mobile-nav .main-nav a, .mobile-bar [data-target]', function(event) {
				 if(event) {
					event.preventDefault();
					event.stopPropagation();
				 };
				$('html').removeClass('show-mobile-nav');
				
				$('.pg-series').removeClass('show-mobile-series');
				$('.pg-crew').removeClass('show-crew-info');
				$('.pg-careers').removeClass('show-career-details');
				
				if($(this).is('[data-target]')) {	
					$('section.activeScene').removeClass('activeScene');
					var target = $(this).attr('data-target');
					$('section[data-title="' + target + '"]').addClass('activeScene');
				};
				
			});
			
			$(document).on('click', '.pg-series .btn-back', function(){
				$('.pg-series').removeClass('show-mobile-series');
			});
			$(document).on('click', '.pg-crew .btn-back', function(){
				$('.pg-crew').removeClass('show-crew-info');
			});
			
			$(document).on('click', '.series-carousel-nav a',function(event) {
				 if(event) {
					event.preventDefault();
					event.stopPropagation();
				 };
				changeSeriesPg($(this).attr('data-target'));
				$('.pg-series').toggleClass('show-mobile-series');
			});
			
			$(document).on('click', '.pg-series .show-panel nav .clickShield', function(){
				$('.pg-series .show-panel').toggleClass('show-mobile-series-panel-nav');
			});
			
			
			$(document).on('click', '.newsItem div', function(event){
				 if(event) {
					event.preventDefault();
					event.stopPropagation();
				 };
				
				var url = $(this).find('a').attr('href');
				window.open(url, 'News Link', '_blank ');
				
			});
			
			/**
			 * MOBILE STANDARD VERSION
			 * Used to generate font size on body for em dynamic rezing on screen size change
			 */
			$.fn.flowtype = function(options) {
			
			  var settings = $.extend({
				 maximum   : 9999,
				 minimum   : 1,
				 maxFont   : 9999,
				 minFont   : 1,
				 fontRatio : 30
			  }, options),
			
			  changes = function(el) {
				 var $el = $(el),
					elw = $el.width(),
					elh = $el.height(),
					width = elw > settings.maximum ? settings.maximum : elw < settings.minimum ? settings.minimum : elw,
					height = elh > settings.maximum ? settings.maximum : elh < settings.minimum ? settings.minimum : elh,
					fontBaseW = width / settings.fontRatio,
					fontBaseH = height / settings.fontRatio;
				
				
					var fontSize = fontBaseW;
					//var fontSize = fontBase > settings.maxFont ? settings.maxFont : fontBase < settings.minFont ? settings.minFont : fontBase;
				
				 $el.css('font-size', fontSize + 'px');
			  };
			
			  return this.each(function() {
			  // Context for resize callback
				 var that = this;
			  // Make changes upon resize
				 $(window).resize(function(){changes(that);});
			  // Set changes on load
				 changes(this);
			  });
			};
			
		};