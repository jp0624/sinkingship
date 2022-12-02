( function ( ns ) {
	"use strict";

	QuickMenu.prototype = new PIXI.DisplayObjectContainer ();  
	QuickMenu.constructor = QuickMenu;

	function QuickMenu ( count ) {

			// execute Mix-ins
		PIXI.DisplayObjectContainer.call ( this );
		PIXI.EventTarget.call ( this );

		var _super = {};
		var _this = this;

		var _texture;
		var _sprite;

		var _markerSet;
		var _seperatorSet;
		var _offset;
		var _canvas;
		var _boatArrowSpriteUp;
		var _boatArrowSpriteDown;

		var _construct = function ( menuSet ) {

				// the display offset
			_offset = 0;
			_markerSet = [];
			_seperatorSet = [];

			_canvas = document.createElement ( 'canvas' );
			_canvas.width  = 200;
			_canvas.height = 500;

			for ( var i = 0; i < menuSet.length - 1; i++ ) {
				_addMenuItem ( i * 2, menuSet [ i ], true );
				_addMenuItem ( i * 2 + 1, {}, true );
				// _addMenuItem ( i * 2 + 2, {}, true );
			}

				// last menu item
			console.log ( i );
			_addMenuItem ( i * 2, menuSet [ i ], false );


			var boatTexture = PIXI.Texture.fromImage ( QUICK_MENU_BOAT );
			var boatSprite = new PIXI.Sprite ( boatTexture );
			boatSprite.x = 35;
			boatSprite.y = 10;
			boatSprite.anchor.y = 0.5;
			_this.addChild ( boatSprite );
			
			var boatArrowTexture = PIXI.Texture.fromImage ( QUICK_MENU_BOAT_ARROW );
			_boatArrowSpriteUp = new PIXI.Sprite ( boatArrowTexture );
			_boatArrowSpriteUp.anchor.x = 0.5;
			_boatArrowSpriteUp.anchor.y = 0.5;
			_boatArrowSpriteUp.x = 54;
			_boatArrowSpriteUp.y = -27;
			_this.addChild ( _boatArrowSpriteUp );

			_boatArrowSpriteDown = new PIXI.Sprite ( boatArrowTexture );
			_boatArrowSpriteDown.anchor.x = 0.5;
			_boatArrowSpriteDown.anchor.y = 0.5;
			_boatArrowSpriteDown.x = 54;
			_boatArrowSpriteDown.y = 52;
			_boatArrowSpriteDown.rotation = Math.PI;
			_this.addChild ( _boatArrowSpriteDown );


				// add mouse click and rollover
			
		}

		var _addMenuItem = function ( index, data, seperator ) {

			

			var menuItem = new ss.MenuItem ( data, index );
			menuItem.y = QUICK_MENU_SPACING * index;
			_markerSet.push ( menuItem );
			_this.addChild ( menuItem );

			if ( seperator ) {

				var seperatorTexture = PIXI.Texture.fromImage ( QUICK_MENU_SEPERATOR );
				var seperatorSprite = new PIXI.Sprite ( seperatorTexture );
				seperatorSprite.y = 30 + QUICK_MENU_SPACING * index;
				seperatorSprite.x = 10;
				_seperatorSet.push ( seperatorSprite );
				_this.addChild ( seperatorSprite );
			}
		}

		_this.update = function ( timeElapsed, delta ) {

			var percentagePosition = ss.ScrollManager.targetPosition () / ss.ScrollManager.maxScroll ();

			if ( percentagePosition < 0.05 ) {
				_boatArrowSpriteUp.alpha = Math.max ( 0, _boatArrowSpriteUp.alpha -_boatArrowSpriteUp.alpha * 0.3 );

				_boatArrowSpriteDown.alpha = Math.min ( 1, _boatArrowSpriteDown.alpha  + ( 1.0 - _boatArrowSpriteDown.alpha ) * 0.1 );
			} else if ( percentagePosition > 0.95 ) {
				_boatArrowSpriteUp.alpha = Math.min ( 1, _boatArrowSpriteUp.alpha  + ( 1.0 - _boatArrowSpriteUp.alpha ) * 0.1 );
				_boatArrowSpriteDown.alpha = Math.max ( 0, _boatArrowSpriteDown.alpha -_boatArrowSpriteDown.alpha * 0.3 );
			} else {
				_boatArrowSpriteUp.alpha = Math.min ( 1, _boatArrowSpriteUp.alpha  + ( 1.0 - _boatArrowSpriteUp.alpha ) * 0.1 );
				_boatArrowSpriteDown.alpha = Math.min ( 1, _boatArrowSpriteDown.alpha + ( 1.0 - _boatArrowSpriteDown.alpha ) * 0.1 );
			}

			_offset = -percentagePosition * QUICK_MENU_SPACING * ( _markerSet.length - 1 );

			for ( var i = 0; i < _markerSet.length; i++ ) {
				var menuItem = _markerSet [ i ];
				menuItem.y = _offset + QUICK_MENU_SPACING * i;
				var val = 1.0 - Math.min ( 1, Math.abs ( QUICK_MENU_SPACING * i + _offset ) / ( QUICK_MENU_SPACING * 3 ) );
				menuItem.alpha = val;
				menuItem.update ();

				if ( i == 1 ) {
					// console.log (  Math.abs ( QUICK_MENU_SPACING * i + _offset ) / ( QUICK_MENU_SPACING * 5 ) );
				}
			}

			for ( var i = 0; i < _seperatorSet.length; i++ ) {
				var seperatorSprite = _seperatorSet [ i ];
				seperatorSprite.y = _offset + 30 + QUICK_MENU_SPACING * i;
				var val = 1.0 - Math.min ( 1, Math.abs ( QUICK_MENU_SPACING * i + _offset + 30 ) / ( QUICK_MENU_SPACING * 3 ) );
				seperatorSprite.alpha = val;
			}
	
		}

		return _construct ( count );
	}

	ns.QuickMenu = QuickMenu;

} ( ss ) );