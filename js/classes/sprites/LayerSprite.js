require.include ( "sprites" );
require.include ( "geom" );
require.include ( "weblib/liveparticles/pixi/PixiParticlePackage" );
require.include ( "classes/managers/ScrollManager" );

( function ( ns ) {
	"use strict";
	
	LayerSprite.prototype = new PIXI.DisplayObjectContainer ();  
	LayerSprite.constructor = LayerSprite;

		/**
		 * Class definition of a scene object
		 *
		 * @constructor
		 * @this {Scene}
		 */
	function LayerSprite ( layerData ) {

		PIXI.DisplayObjectContainer.call ( this );
		PIXI.EventTarget.call ( this );

			// default variables
		var _super = {};
		var _this = this;
		var _ready;
		var _name;
		var _effectSet;
		var _depth;
		var _normalizedY;

			/**
			* Initialize object data
			*
			* @private
			* @this {LayerSprite}
			* @param {Object} data JSON Object that will be auto loaded
			*/
		var _construct = function ( layerData ) {

			_effectSet = [];
			_ready = false;

				// auto load the data if it has been provided
			if ( !isEmpty ( layerData ) ) {
				_this.load ( layerData );
			}

			return _this;
		}

		var _onSpriteReady_listener = function ( e ) {
			//console.log("LAYER: " + _name);
			 var stuff = [];
			for(var i = 0; i < _this.children.length; i++) {
				var child = _this.children[i];
				var info = {};
				if(isEmpty(child)) {
					continue;
				}
				info.child = child;
				//info.is_ready = child.ready ();
				stuff.push(info);
			}

			//  console.table(stuff);

			// console.log ( "_onSpriteReady_listener" );


				// check if all the sprites are ready and loaded 
			var childrenReady = 0;
			for ( var i = 0; i < _this.children.length; i++ ) {
				var child = _this.children [ i ];

					// some children are emitters
				if ( child.ready && !child.ready () ) {
					return;
				}
			}

				// this layer is truly ready. Then emit a ready event
			_ready = true;

			_this.emit ( LAYER_READY, _this );
		}

		_this.name = function () {
			return _name;
		}

		_this.ready = function () {
			return _ready;
		}

		_this.normalizedY = function ( val ) {

			if ( isEmpty ( val ) ) {
				
				return _normalizedY;
			} else {
				_normalizedY = val;
				// console.log  ( "val: " + val );
			}
		}

		_this.load = function ( layerData ) {

			var windowWidth = $ ( window ).width ();
			var windowHeight = $ ( window ).height ();

 			_name = layerData.details.name;
 			_depth = layerData.details.depth;
			/*						  *
			*  CREATE LAYER EFFECTS   *
			*					 	  */
			if ( layerData.effects ) {
				for ( var i = 0; i < layerData.effects.length; i++ ) {
					
					var effectData = layerData.effects [ i ],
					effectName = effectData.type.toLowerCase ().replace ( / /g, '-' );
						
					if ( !ss.SystemInfo.isMobile () ) {
						switch ( effectData.type ) {
							case "dirt" :
								 _effectSet.push(new ns.DirtSpriteEffect ( effectData, layerData, _this ));
								break			
							case "light-beams" :
								 _effectSet.push(new ns.LightBeamSpriteEffect ( effectData, layerData, _this ));
								break;
							case "topdirt":
								_effectSet.push(new ns.TopDirtSpriteEffect (effectData, layerData, _this));
								break;
						}
					}
					
				}
			}

			/*						  *
			*  CREATE OBJECTS 		  *
			*					 	  */
			if ( layerData.objects ) {

				var objectSet = layerData.objects;

				for ( var i = 0; i < objectSet.length; i++ ) { // layerData.objects.length

					var	objectData = objectSet [ i ];
					//var objectName = objectData.details.name.toLowerCase ().replace(/ /g, '-');
					var childSprite;

					switch ( objectData.details.type ) {
						case "img" :
							childSprite = new ss.TextureSprite ( objectData );
							break;
						case "snake" :
							childSprite = new ss.SnakeSprite ( objectData ); 
							break;
						default :
							console.log ( "unknown type pass in sprite" )
					}
						// add to the display hieracrchy
					_this.addChild ( childSprite );
					childSprite.on ( TEXTURE_READY, _onSpriteReady_listener );
				}

					// if there are no children this could be a effect object. make new class
				if ( objectSet.length == 0 ) {
					_ready = true;
					_this.emit ( LAYER_READY, _this );
				}
			}

			

			
		}

		_this.resize = function ( width, height ) {

				// resize each child. It can be assume
			for ( var i = 0; i < _this.children.length; i++ ) {
				var child = _this.children [ i ];

				if ( !isEmpty ( child.resize ) ) {
						// reset the y position
					child.resize ( width, height );
				}
			}

				// update each effect
			for ( var i = 0; i < _effectSet.length; i++ ) {
				var effect = _effectSet [ i ];

				if ( !isEmpty ( effect.resize ) ) {
						// update each child
					effect.resize ( width, height );
				}
			}
		};

		_this.focus = function ( ) {

				// resize each child. It can be assume
			for ( var i = 0; i < _this.children.length; i++ ) {
				var child = _this.children [ i ];

				if ( !isEmpty ( child.focus ) ) {
						// reset the y position
					child.focus ( );
				}
			}

				// update each effect
			for ( var i = 0; i < _effectSet.length; i++ ) {
				var effect = _effectSet [ i ];

				if ( !isEmpty ( effect.focus ) ) {
						// update each child
					effect.focus ( );
				}
			}
		};

		_this.blur = function ( ) {

				// resize each child. It can be assume
			for ( var i = 0; i < _this.children.length; i++ ) {
				var child = _this.children [ i ];

				if ( !isEmpty ( child.blur ) ) {
						// reset the y position
					child.blur ( );
				}
			}

				// update each effect
			for ( var i = 0; i < _effectSet.length; i++ ) {
				var effect = _effectSet [ i ];

				if ( !isEmpty ( effect.blur ) ) {
						// update each child
					effect.blur ( );
				}
			}
		};

		_this.update = function ( elapsedTime, delta ) {

				// here's what give's 
			_this.y = ( ( ss.ScrollManager.targetPosition () + _this.parent.y ) * _depth );
			//console.log ( _this.y );

				// update each child
			for ( var i = 0; i < _this.children.length; i++ ) {
				var child = _this.children [ i ];

				if ( !isEmpty ( child.update ) ) {
						// update each child
					child.update ( elapsedTime, delta );
				}
			}

				// update each effect
			for ( var i = 0; i < _effectSet.length; i++ ) {
				var effect = _effectSet [ i ];

				if ( !isEmpty ( effect.update ) ) {
						// update each child
					effect.update ( elapsedTime, delta );
				}
			}
		};

			// quite possibly the ugliest way to inherit functions
		_this._on_ = _this.on;
		_this.on = function ( eventName, callback ) {
			_this._on_ ( eventName, callback );

				// emulate the emit process but only on the current callback
			if ( eventName == LAYER_READY ) {
				if ( _ready ) {
					callback.call ( LAYER_READY, _this );
				}
			}
		};

		return _construct ( layerData );
	}

	ss.LayerSprite = LayerSprite;

} ( ss ) );