( function ( ns ) {
	"use strict";

	function URLTexture ( url ) {

			// execute mixins
		PIXI.EventTarget.call ( this );

		var _this = this;
		var _ready;
		var _texture;

		var _construct = function ( url ) {
			_texture = PIXI.Texture.fromImage ( url );

			if ( _texture.baseTexture.hasLoaded ) {
				_ready = true;
			} else {
				_texture.baseTexture.on ( "loaded", function () {
					_ready = true;

					_this.emit ( { 'type': TEXTURE_READY, 'content' : _this } );
				} );

				_texture.baseTexture.on ( "error", function () {
					console.log ( "load error for : " + url );
				} ) 
			}

			return _this;
		}

		return _construct ( url );
	}
	
	function SupremeTextureSprite ( supremeData ) {

			// execute mixins
		PIXI.EventTarget.call ( this );

		var _this;



		var _renderTexture;

		var _construct = function ( supremeData ) {

		}

		var _loadTexture = function ( url ) {
			var texture = PIXI.from
		}

		return _construct ( supremeData );
	}
} );