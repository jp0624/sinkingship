require.include ( "sprites" );

( function ( ns ) {
	"use strict";

	SceneSprite.prototype = new PIXI.DisplayObjectContainer ();  
	SceneSprite.constructor = SceneSprite;

		/**
		 * Class definition of a scene object
		 *
		 * @constructor
		 * @this {Scene}
		 */
	function SceneSprite ( sceneData, normalizedIndex ) {

		PIXI.DisplayObjectContainer.call ( this );
		PIXI.EventTarget.call ( this );

			// default variables
		var _super = {};
		var _this = this;
		var _name;
		var _ready;
		var _childCount;
		var _normalizedIndex;
		var _initialScene;

			/**
			* Initialize object data
			*
			* @private
			* @this {Scene}
			* @param {Object} data JSON Object that will be auto loaded
			*/
		var _construct = function ( sceneData, normalizedIndex ) {

			_ready = false; 
			_normalizedIndex = normalizedIndex;

				// auto load the data if it has been provided
			if ( !isEmpty ( sceneData ) ) {
				_this.load ( sceneData );
			}

			return _this;
		}

		var _onLayerReady_listener = function ( e ) {
			//console.log("SCENE SPRITE: " + _name);
			//console.log(_this.children);
			var stuff = [];
			for(var i = 0; i < _this.children.length; i++) {
				var child = _this.children[i];
				var info = {};
				info.scene_name = _name;
				info.my_name = child.name();
				info.is_ready = child.ready();
				stuff.push(info);
			}

			// console.table(stuff);

				// check if all the layers are ready and loaded 
			var childernReady = 0;
			for ( var i = 0; i < _this.children.length; i++ ) {
				var child = _this.children [ i ];

				if ( child.ready && !child.ready () ) {
					return;
				}
			}

				// this layer is truly ready. Then emit a ready event
			_ready = true;
			_this.emit ( SCENE_READY, _this );

			if ( _initialScene ) {
				ss.SiteManager.initialSceneReady ( _this );
			}
		}

		_this.ready = function () {
			return _ready;
		}

		_this.name = function () {
			return _name;
		}

		_this.load = function ( sceneData ) {

				// use so we don't have multiple ready events
			_childCount = sceneData.layers.length;

			_name = sceneData.details.name.toLowerCase ().replace (/ /g, '-');
			_initialScene = ( String ( sceneData.details.initial_scene ).toLowerCase () == "true" ) ? true : false; 

			var layerSet = sceneData.layers;

				// load layers
			for ( var i = 0; i < _childCount; i++ ) {

				var layerData = layerSet [ i ];

					// initialize and load the each layer
				var layerSprite = new ns.LayerSprite ( layerData );
				layerSprite.normalizedY ( _normalizedIndex );
				_this.addChild ( layerSprite );
				layerSprite.on ( LAYER_READY, _onLayerReady_listener );
				
			}

			if ( _childCount == 0 ) {
				_ready = true;
				_this.emit ( SCENE_READY, _this );
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
		};

		_this.blur = function ( ) {

				// resize each child. It can be assume
			for ( var i = 0; i < _this.children.length; i++ ) {
				var child = _this.children [ i ];

				if ( !isEmpty ( child.blur ) ) {
					
						// reset the y position
					child.blur () ;
				}
			}
		};

		_this.focus = function ( ) {

				// resize each child. It can be assume
			for ( var i = 0; i < _this.children.length; i++ ) {
				var child = _this.children [ i ];

				if ( !isEmpty ( child.focus ) ) {
					
						// reset the y position
					child.focus () ;
				}
			}
		};


		_this.update = function ( elapsedTime, delta ) {

				// update each child
			for ( var i = 0; i < _this.children.length; i++ ) {
				var child = _this.children [ i ];

				if ( !isEmpty ( child.update ) ) {
						// reset the y position
					child.update ( elapsedTime, delta );
				}
			}
		};

			// quite possibly the ugliest way to inherit functions
		_this._on_ = _this.on;
		_this.on = function ( event, callback ) {
			_this._on_ ( event, callback );

				// emulate the emit process but only on the current callback
			if ( event == "ready" ) {
				if ( _ready ) {
					callback.apply ( undefined, [ SCENE_READY, _this ] );
				}
			}
		}
		
		return _construct ( sceneData, normalizedIndex );
	}

		// assign to the namespace
	ns.SceneSprite = SceneSprite;

} ( ss ) )