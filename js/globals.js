	// const

var LAYER_READY = "sprite_ready";
var TEXTURE_READY = "texture_ready";
var SCENE_READY = "scene_ready";
var SITE_READY = "scene_ready";

var SNAKE_POINTS = 30;
var SNAKE_SCALE_X = 1.25;
if (ss.SystemInfo.isMobile()) {
    SNAKE_POINTS = 2;
    SNAKE_SCALE_X = 2.5;
}

var SKY_TEXTURE = "img/scenes/global/Sky_Gradiant.jpg";
var WATER_TEXTURE = "img/scenes/global/bg-water.jpg";
var BUBBLE_TEXTURE = 'img/scenes/global/bubble-particle-large.png';
var DIRT_TEXTURE = 'img/scenes/global/particle1.png';
var LIGHT_BEAM_TEXTURE = 'img/scenes/home/Sun_beam.png';


    // UI
var QUICK_MENU_NODE = 'img/scenes/global/quick-menu-item.png';
var QUICK_MENU_MASK = 'img/scenes/global/quick-menu-mask.png';
var QUICK_MENU_SEPERATOR = 'img/global/menu_seperator.png';
var QUICK_MENU_SPACING = 85;
var QUICK_MENU_BOAT = 'img/global/quick-menu-boat.png';
var QUICK_MENU_BOAT_ARROW = 'img/global/boat-arrow.png';

    // Specail
var DISPLACEMENT_MAP_TEXTURE = 'img/scenes/bottom/displacement-map.png';

	// stub for requestAnimationFrame
window.requestAnimFrame = ( function () {
        return window.requestAnimationFrame    || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame    || 
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame     || 
            function ( callback ) {
                window.setTimeout ( callback, 1000 / 60 );
            };
 } ) ();