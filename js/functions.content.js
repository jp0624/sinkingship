
var ContentFunctions = function() {
	
	// standard functions to load on global dom is ready
	this.documentReady = function() {		
		
		//start up the main generic functions
		getCurDate();			// get the current date to use for date verifications
		getWinSize();			// adds browser win size specs to winSize object with [x] & [y]

		$('body').flowtype({
			minimum   : 100,
			maximum   : 1500,
			fontRatio : 40
		});
		
		this.documentEvents();	// setup dom element event listeners
		
	};
	// standard functions to load/refresh on global dom is resized
	this.documentResize = function() {

	};
	this.documentEvents = function() {
		
	};
	
};
var contentInstance = contentInstance || new ContentFunctions();