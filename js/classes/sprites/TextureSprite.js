require.include ( "sprites" );
require.include ( "classes/managers/SiteManager" );
require.include ( "classes/sprites/sprite_effects/SpriteEffectPackage" );

( function ( ns ) {
	"use strict";

		//set the base attributes to copy from
	TextureSprite.prototype = new PIXI.DisplayObjectContainer ();  
	TextureSprite.constructor = TextureSprite;

	function TextureSprite ( data ) {

		var _super = {};
		var _this = this;
		
		PIXI.DisplayObjectContainer.call ( _this );
		PIXI.EventTarget.call ( _this );

		var _name;
		var _texture;
		var _sprite;
		var _data;
		var _ready;
		var _effectSet;
		var _anchor;

		function _construct ( data ) {

			_data = data;
			_ready = false;
 			_effectSet = [];

			if ( !isEmpty ( data ) ) {
				_this.load ( data );
			}

			return _this;
		}

			//Setup custom container attributes
		var _setPosPercent = function ( xpercent, ypercent, parentWidth, parentHeight ) {

				//set position based on center of object and its parent
			_this.x = Math.round ( parentWidth * xpercent / 100 );
			_this.y = Math.round ( parentHeight * ypercent / 100 );
		};

		var _setSizePercent = function ( wpercent, hpercent, parentWidth, parentHeight ) {

			
			//set initial height and width and get parents details(height and width)
			
			//detect if porportions are set based on ratio with height or width

			var aspect = ( _texture.width / _texture.height );

			if ( hpercent == 'auto' ) {
				// console.log('~~~~~~~~~~~~~~~~~ % SIZNG FUNC (1) ~~~~~~~~~~~~~~~~~');
				var width = parentWidth * wpercent / 100;
				_this.width = width;
				_this.height = width / aspect;
				
			}else if(wpercent == 'auto'){
				// console.log('~~~~~~~~~~~~~~~~~ % SIZNG FUNC (2) ~~~~~~~~~~~~~~~~~');
				var height = parentHeight * hpercent / 100;
				_this.height = height;
				_this.width = height * aspect;
				
			}else{
				// console.log('~~~~~~~~~~~~~~~~~ % SIZNG FUNC (3) ~~~~~~~~~~~~~~~~~');
				_this.width = parentWidth * wpercent / 100;
				_this.height = parentHeight * hpercent / 100;
			}
			

		};

		var _loadSpriteEffects = function ( effectSet ) {
			for ( var i = 0; i < effectSet.length; i++ ) {
				var effectData = effectSet [ i ];
				var effectType = effectData.type.toLowerCase ().replace ( / /g, '-' );


					// find the current effect
				switch ( effectType ) {
					case "float" :
						_effectSet.push ( new ss.FloatSpriteEffect ( effectData, _data, _this ) );
						break;
					case "bubbles" :
						_effectSet.push ( new ss.BubblesSpriteEffect ( effectData, _data, _this ) );
						break;
					case "sinking" :
						_effectSet.push ( new ss.SinkingSpriteEffect ( effectData, _data, _this ) );
						break;
					case "flicker" :
						_effectSet.push ( new ss.FlickerSpriteEffect ( effectData, _data, _this ) );
						break;
					case "fade":
						_effectSet.push ( new ss.SpriteFadeEffect (effectData, _data, _this ) );
						break;
					case "swap" :
						_effectSet.push ( new ss.SwapSpriteEffect ( effectData, _data, _this ) );
						break;
				}
			}
		}

		var _loadSpriteFilters = function ( filterSet ) {
			for ( var i = 0; i < filterSet.length; i++ ) {
				var filter = filterSet [ i ];
				// filterName = filter.type.toLowerCase().replace(/ /g, '-');
				
				// console.log('filter.type: ', filter.type);
				if ( filter.type == "//displacement" ) {
					var blurFilter = new PIXI.DisplacementFilter ( _texture );
					_sprite.filters = [ blurFilter ];
				}
			}
		}

		var _onSiteReadyListener = function () {

				// load sprite effect now that we have the width and height
			_loadSpriteEffects ( _data.effects );

				// load object filters
			if ( !isEmpty ( data.filters ) ) {
				_loadSpriteFilters ( data.filters );
			}
		}

		_this.getSprite = function() {
			return _sprite;
		}

		_this.getTexture = function () {
			return _texture;
		}

		_this.load = function ( data ) {

			_data = data;

				// assign the name
			_name = data.details.name.toLowerCase().replace(/ /g, '-');

			_this.debugName = _name;

			// console.log ( _anchor.x + " " + _anchor.y );

			_texture = PIXI.Texture.fromImage ( data.details.src );
			_sprite = new PIXI.Sprite ( _texture );
			_sprite.anchor.x = setDefault ( data.anchor && data.anchor.x, 0.5 );
			_sprite.anchor.y = setDefault ( data.anchor && data.anchor.y, 0.5 ) ;
			_sprite.rotation = setDefault ( data.rotation, 0 );
	
			_this.addChild ( _sprite );

			//console.log ( "_texture.baseTexture.hasLoaded: " + _texture.baseTexture.hasLoaded );

				// check if the texture is loaded
			// console.log ( _texture.baseTexture.hasLoaded );
			if ( _texture.baseTexture.hasLoaded ) {
				_ready = true;

				ss.SiteManager.registerTextureLoad ();

 				_this.emit ( { 'type': TEXTURE_READY, 'content' : _this } );
			} else {
				_texture.baseTexture.on ( "loaded", function () {
					_ready = true;

					ss.SiteManager.registerTextureLoad ();

					_this.emit ( { 'type': TEXTURE_READY, 'content' : _this } );
				} );

				_texture.baseTexture.on ( "error", function () {
					console.log ( "load error");
				} ) 
			}

			if(String(data.details["global"]) == "true") {
				ss.SiteManager.globalObject(_name, _this);
			}

			ss.SiteManager.addEventListener ( "INIT_RESIZE", _onSiteReadyListener );

		}

		_this.ready = function () {
			return _ready;
		}

		_this.resize = function ( width, height ) {

				// get parent size
			_setSizePercent ( _data.size.w, _data.size.h, width, height );
			_setPosPercent ( _data.position.x, _data.position.y, width, height );

			for ( var i = 0; i < _effectSet.length; i++ ) {
				_effectSet [ i ].resize ( _this, width, height );
			}
		};

		_this.focus = function ( ) {

			for ( var i = 0; i < _effectSet.length; i++ ) {
				var childEffect = _effectSet[i];
				if (!isEmpty(childEffect.focus)) {
					_effectSet [ i ].focus ( );
				}
			}
		};

		_this.blur = function ( ) {

			for ( var i = 0; i < _effectSet.length; i++ ) {
				var childEffect = _effectSet[i];
				if(!isEmpty(childEffect.blur)) {
					_effectSet [ i ].blur ( );
				}
			}
		};

		_this.update = function ( timeElapsed, delta ) {

			for ( var i = 0; i < _effectSet.length; i++ ) {
				if ( !isEmpty ( _effectSet [ i ].update ) ) {
					_effectSet [ i ].update ( _this, timeElapsed, delta );
				}
			}
		}

		_this.name = function () {
			return _name;
		}

			// quite possibly the ugliest way to inherit functions
		_this._on_ = _this.on;
		_this.on = function ( eventName, callback ) {
			_this._on_ ( eventName, callback );


			//console.log ( eventName );
			//console.log ( _ready );
				// emulate the emit process but only on the current callback
			if ( eventName == TEXTURE_READY ) {
				if ( _ready ) {
					callback.call ( { 'type': TEXTURE_READY, 'content' : _this } );
				}
			}
		};

		return _construct ( data );
	}

	ns.TextureSprite = TextureSprite;

} ( ss ) );