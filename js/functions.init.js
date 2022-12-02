window.addEventListener('load',function load() {
	window.removeEventListener('load', load, false);
	document.body.classList.remove('load');
},false);

//page and window specific listeners
$ ( document ).ready( function () {
	
	
	jQuery.cachedScript = function( url, options ) {
 
	  // Allow user to set any option except for dataType, cache, and url
	  options = $.extend( options || {}, {
		dataType: "script",
		cache: false,
		url: url
	  });
	 
	  // Use $.ajax() since it is more flexible than $.getScript
	  // Return the jqXHR object so we can chain callbacks
	  return jQuery.ajax( options );
	};
	
	// Usage
	$.cachedScript( "js/compiled.js" ).done(function( script, textStatus ) {
	  
	});
	
	
} );


$(document).on("LOAD_PAGE_CONTENT", function(e){
	
	$.ajax ( "pageContent.txt", {
		"success" : function ( response ) {
			
			$("#contentContainer").append(response);
			globalInstance.documentReady();
			startSceneLoop();
	
		
			$('.loadingInfo').remove();
	
		}
	});
	
});