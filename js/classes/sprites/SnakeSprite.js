require.include ( "sprites" );
require.include ("weblib/utils/SystemInfo");

( function ( ns ) {
	"use strict";

		//set the base attributes to copy from
	SnakeSprite.prototype = new PIXI.DisplayObjectContainer ();  
	SnakeSprite.constructor = SnakeSprite;

	function SnakeSprite ( snakeData ) {


			// initialize Mix-ins
		PIXI.DisplayObjectContainer.call ( this );
		PIXI.EventTarget.call ( this );

			// default variables
		var _super = {};
		var _this = this;

		var _data;
		var _pointSet;
		var _texture;
		var _rope;
		var _ready;
		var _name;
		var _anchor;
		var _height;

		var _waveMovement;

		var _construct = function ( snakeData ) {
			
			// console.log ( "snakeData", snakeData );

			_ready = false;
			_waveMovement = 0;

				// create the point for the rope. We'll set the x position on resize
			_pointSet = [];			
			for ( var i = 0; i < SNAKE_POINTS; i++ ) {
				var segSize = length;
				_pointSet.push ( new PIXI.Point ( i * 100, 0 ) );
			};
						
			if ( !isEmpty ( snakeData ) ) {
				_this.load ( snakeData );
			}

			return _this;
		}

			//Setup custom container attributes
		var _setPosPercent = function ( xpercent, ypercent, parentWidth, parentHeight ) {

				//set position based on center of object and its parent
			_this.x = Math.round ( parentWidth * xpercent / 100 - ( _this.width * _anchor.x ) );
			_this.y = Math.round ( parentHeight * ypercent / 100 - ( _this.height * _anchor.y ) );
		};

		var _setSizePercent = function ( wpercent, hpercent, parentWidth, parentHeight ) {

			
			//set initial height and width and get parents details(height and width)
			
			//detect if porportions are set based on ratio with height or width

			var aspect = ( _texture.width / _texture.height );

			if ( hpercent == 'auto' ) {
				// console.log('~~~~~~~~~~~~~~~~~ % SIZNG FUNC (1) ~~~~~~~~~~~~~~~~~');
				_texture.width = parentWidth * wpercent / 100;
				_texture.height = _this.width / aspect;
			}else if(wpercent == 'auto'){
				// console.log('~~~~~~~~~~~~~~~~~ % SIZNG FUNC (2) ~~~~~~~~~~~~~~~~~');
				_texture.height = parentHeight * hpercent / 100;
				_texture.width = _this.height * aspect;
				
			}else{
				// console.log('~~~~~~~~~~~~~~~~~ % SIZNG FUNC (3) ~~~~~~~~~~~~~~~~~');
				_texture.width = parentWidth * wpercent / 100;
				_texture.height = parentHeight * hpercent / 100;

				//console.log("WE IIIIIIIIIN THEEEEEER!", _this.height, "parentHeight: ", parentHeight, "hpercent: " + hpercent + "set to: " , parentHeight * hpercent / 100);

			}
			

		};

		_this.load = function ( snakeData ) {

			_data = snakeData;

			_waveMovement = setDefault ( snakeData.details.waveOffset, 0 );

			_anchor = {
				"x" : setDefault ( snakeData.anchor && snakeData.anchor.x, 0.5 ),
				"y" : setDefault ( snakeData.anchor && snakeData.anchor.y, 0.5 )
			}

			_name = snakeData.details.name.toLowerCase().replace(/ /g, '-');
			
			_texture = PIXI.Texture.fromImage ( snakeData.details.src );
			_rope = new PIXI.Rope ( _texture, _pointSet );
			//_rope.y = -20;
			_this.addChild ( _rope );
			_rope.scale.x = SNAKE_SCALE_X;


			//console.log ( "_texture.baseTexture.hasLoaded: " + _texture.baseTexture.hasLoaded );

				// check if the texture is loaded
			if ( _texture.baseTexture.hasLoaded ) {
				_ready = true;
 				_this.emit ( { 'type': TEXTURE_READY, 'content' : _this } );
 			} else {
				_texture.baseTexture.on ( "loaded", function () {
					_ready = true;

					_height = _texture.baseTexture.height;

					_this.emit ( { 'type': TEXTURE_READY, 'content' : _this } );

				} );

				_texture.baseTexture.on ( "error", function () {
					console.log ( "load error");
					console.log ( "load error" );
				} ) 
			}

		}

		_this.ready = function () {
			return _ready;
		}

		_this.name = function () {
			return _name;
		}

			// quite possibly the ugliest way to inherit functions
		_this._on_ = _this.on;
		_this.on = function ( eventName, callback ) {
			_this._on_ ( eventName, callback );

				// emulate the emit process but only on the current callback
			if ( eventName == TEXTURE_READY ) {
				if ( _ready ) {
					callback.call ( { 'type': TEXTURE_READY, 'content' : _this } );
				}
			}
		}

		_this.resize = function ( width, height ) {
			_setSizePercent ( _data.size.w, _data.size.h, width, height );
			_setPosPercent ( _data.position.x, _data.position.y, width, height );
		}

		_this.update = function ( elaspedTime, delta ) {
			var windowWidth = Math.max ( 1300, ss.SiteManager.windowWidth () );
			var waveSegmentWidth = ( windowWidth / _pointSet.length );
			_waveMovement += elaspedTime * 0.0025;


			for (var i = 0; i < _pointSet.length; i++) {

				_pointSet [ i ].y = Math.sin ( _waveMovement + i * 0.75 ) * 6;
				_pointSet [ i ].x = i * waveSegmentWidth;// + ( Math.cos ( i * 10 + _waveMovement ) ) * 5  ;
			};
		}

		return _construct ( snakeData );
	}

	ss.SnakeSprite = SnakeSprite;

} ( ss ) );