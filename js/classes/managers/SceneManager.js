require.include ( "classes/sprites/SpritesPackage" );

( function ( ns ) {
	"use strict";

		// Inherits from DisplayObjectContainer
	SceneManager.prototype = new PIXI.DisplayObjectContainer ();
	SceneManager.constructor = SceneManager;

	function SceneManager ( sceneSet, background ) {


			// execute Mix-ins
		PIXI.DisplayObjectContainer.call ( this );
		PIXI.EventTarget.call ( this );

			// you guys should know what's up with this
		var _super = {};
		var _this = this;
		var _ready;
		var _childCount;
		var _backgroundSky;
		var _backgroundWater;
		var _skyTexture;
		var _initialScene;
		var _hasBackground;
		
		var _construct = function ( sceneSet, background ) {

			_ready = false;

			if ( background === true ) {
				_skyTexture = PIXI.Texture.fromImage ( SKY_TEXTURE );
				// _skyTexture.requiresUpdate = true;
				_backgroundSky = new PIXI.Sprite ( _skyTexture );
				_this.addChild ( _backgroundSky );

				var waterTexture = PIXI.Texture.fromImage ( WATER_TEXTURE );
				waterTexture.requiresUpdate = true;
				_backgroundWater = new PIXI.Sprite ( waterTexture );	
				_this.addChild ( _backgroundWater );
				_hasBackground = true;
			} else {
				_hasBackground = false;
			}
			
			_this.alpha = 0;

			if ( !isEmpty ( sceneSet ) ) {
				_this.load ( sceneSet );
			}
		}

		var _load = function ( sceneSet ) {

			_childCount = sceneSet.length;

				// load each of the scenes in a loop
			for ( var i = 1; i < _childCount; i++ ) { // sceneSet.length
				var	sceneData = sceneSet [ i ];

					// initialize and load the each scene
				var sceneSprite = new ns.SceneSprite ( sceneData, i );
				sceneSprite.on ( SCENE_READY, _onScenesReady_listener );
				_this.addChild ( sceneSprite );
			}

			if ( _this.children.length == 0 ) {
				alert ( "Done")
				_ready = true;
				_this.emit ( { 'type': 'ready', 'content' : _this } );
			}
		};



		var _onScenesReady_listener = function ( e ) {

			console.log("SCENE READY");
			/* var stuff = [];
			for(var i = 0; i < _this.children.length; i++) {
				var child = _this.children[i];
				var info = {};
				info.my_name = child.name();
				info.is_ready = child.ready();
				stuff.push(info);
			} */

			//console.table(stuff);

			// check if all the layers are ready and loaded 
			var childrenCount = 0;
			for ( var i = 0; i < _this.children.length; i++ ) {

				var child = _this.children [ i ];

				
				if ( child.ready && !child.ready () ) {
					return;
				}
			}

				// this layer is truly ready. Then emit a ready event
			_ready = true;
			console.log("SITE READY");
			_this.emit ( { 'type': SITE_READY, 'content' : _this } );
		}

		var _preloadComplete_listener = function ( e ) {

			//alert ( "_preloadComplete_listener" );
			
				// turn off the preloader script
			_initialScene.off ( SCENE_READY, _preloadComplete_listener );

			_load ( sceneSet );
		}

		_this.ready = function () {
			return _ready;
		}

		_this.load = function ( sceneSet ) {

			var	sceneData = sceneSet [ 0 ];

				// initialize and load the each scene
			_initialScene = new ns.SceneSprite ( undefined, 0 );
			_initialScene.on ( SCENE_READY, _preloadComplete_listener );
			_this.addChild ( _initialScene );

			_initialScene.load ( sceneData );
		}

		_this.resize = function ( width, height ) {

			var skyHeight = height * 0.72;
				// resize the background

			if ( _hasBackground ) {
				_backgroundSky.width = width;
				_backgroundSky.height = skyHeight;
				_skyTexture.height = skyHeight;

				_backgroundWater.y = skyHeight;
				_backgroundWater.width = width;
				_backgroundWater.height = _childCount * height + height * 0.28;
			}

			// resize each child. It can be assume
			var bgOffset = ( _hasBackground ) ? 2 : 0; 
			for ( var i = bgOffset; i < _this.children.length; i++ ) {
				var child = _this.children [ i ];


				if ( !isEmpty ( child.resize ) ) {
					
						// reset the y position 
					child.y = ( i - bgOffset ) * height; 
					child.resize ( width, height );
				}
			}
		};

		_this.focus = function () {
			for ( var i = 2; i < _this.children.length; i++ ) {
				var child = _this.children [ i ];


				if ( !isEmpty ( child.focus ) ) {
					child.focus ( );
				}
			}
		}

		_this.blur = function () {
			for ( var i = 2; i < _this.children.length; i++ ) {
				var child = _this.children [ i ];

				if ( !isEmpty ( child.blur ) ) {
					child.blur ( );
				}
			}
		}

		_this.update = function ( elapsedTime, delta ) {

			// resize each child. It can be assume
			for ( var i = 0; i < _this.children.length; i++ ) {
				var child = _this.children [ i ];


				if ( !isEmpty ( child.update ) ) {
					
						// update each child
					child.update ( elapsedTime, delta );
				}
			}

		}

		return _construct ( sceneSet, background );
	}

	ns.SceneManager = SceneManager;

} ( ss ) );