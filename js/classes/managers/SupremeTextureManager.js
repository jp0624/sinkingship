require.include ( "classes/commands/PixiListenerCommand" );
require.include ( "weblib/command/CommandSet" );

( function ( ns ) {
	"use strict";

	function URLTexture ( url ) {

			// execute mixins
		PIXI.EventTarget.call ( this );

		var _this = this;
		var _ready;
		var _image;
		var _canvas;
		var _context;

		var _construct = function ( url ) {

				// load the image
			_image = new Image ();
			_image.onload = _onImageLoad;
			_image.src = url;

			return _this;
		}

		var _onImageLoad = function () {
			
				// prepare the canvas
			_canvas = document.createElement ( "canvas" );
			_canvas.width = _image.width;
			_canvas.height = _image.height;
			_context = _canvas.getContext ( "2d" );
			_context.drawImage ( _image, 0, 0 );

				// set to ready and dispatch the event
			_ready = true;
			_this.emit ( { 'type': TEXTURE_READY, 'content' : _this } );
		}

		_this.image = function () {
			return _image;
		};

		_this.width = function () {
			return _image.width;
		};

		_this.height = function () {
			return _image.height;
		};

		_this.canvas = function () {
			return _canvas;
		}

		_this.context = function () {
			return _context;
		}

		_this.imageData = function ( imageData ) {

			if ( isEmpty ( imageData ) ) {
				return _context.getImageData ( 0, 0, _image.width, _image.height );
			} else {
				_context.putImageData ( imageData, 0, 0 );
			}
			
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

		return _construct ( url );
	}

	function SupremeTextureManager () {

			// execute mix in
		PIXI.EventTarget.call ( this );

		var _this = AbstractObject ( this );

		var _textureMap;

		var _construct = function () {

			_textureMap = {};

			return _this;
		}

		var _getAlphaOffset = function ( alphaChannel ) {
			switch ( alphaChannel ) {
				case "r" :
				case "red" :
				case 0 :
					return 0;
				case "g" :
				case "green" :
				case 1 :
					return 1;
				case "b" :
				case "blue" :
				case 2 :
					return 2;
				case "a" :
				case "alpha" :
				case 3 :
					return 3;
				default :
					return 0;
			}
		}

		var _createRGBATexture = function ( colorTexture, alphaTexture, textureInfo ) {	

				// manually create the texture with canvas
			var colorCanvas = colorTexture.canvas ();
			var rgbImageData = colorTexture.imageData (); 

			var alphaCanvas = alphaTexture.canvas ();
			var alphaImageData = alphaTexture.imageData ();

			var alphaOffset = _getAlphaOffset ( textureInfo.alpha.channel );
			var alphaInvert = ( String ( textureInfo.alpha.invert ) == "true" || true ) ? 255 : 0;

				// directly assign only image data
			for ( var i = 0; i < rgbImageData.data.length; i += 4 ) {
				// rgbImageData.data [ i ]  -  r
				// rgbImageData.data [ i + 1 ]  -  g
				// rgbImageData.data [ i + 2 ]  -  b
				rgbImageData.data [ i + 3 ] = alphaInvert - alphaImageData.data [ i + alphaOffset ];
			}

				// reassign the pixel data to the canvas
			colorTexture.imageData ( rgbImageData );

			var textureRGBA = PIXI.Texture.fromCanvas ( colorCanvas );

				// assign the texture info
			_textureMap [ textureInfo.color.src ] = { "texture" : textureRGBA, "textureInfo" : textureInfo };
			_textureMap [ "debug" ] = { "texture" : textureRGBA, "textureInfo" : textureInfo };
		}

		_this.loadTexture = function ( textureInfo ) {

			var urlTextureColor = new URLTexture ( textureInfo.color.src );
			var urlAlphaColor = new URLTexture ( textureInfo.alpha.src );

			var pixiListenerCommandColor = new ss.PIXIListenerCommand ( urlTextureColor, TEXTURE_READY );
			pixiListenerCommandColor.execute ();
			var pixiListenerCommandAlpha = new ss.PIXIListenerCommand ( urlAlphaColor, TEXTURE_READY );
			pixiListenerCommandAlpha.execute ();
		
			var commandSet = new ns.CommandSet ();
			commandSet.circuit ( "cmd1 OR cmd2", { "cmd1" : pixiListenerCommandColor, "cmd2" : pixiListenerCommandAlpha } );
			commandSet.apply ( _createRGBATexture, [ urlTextureColor, urlAlphaColor, textureInfo ] );
			commandSet.apply ( function () { _this.emit ( "COMPLETE" ) } );
			commandSet.queue ();
		}

		_this.getSprite = function ( name ) {
			return new PIXI.Sprite ( _textureMap [ name ].texture );
		}

		return _construct ();
	}

	ns.SupremeTextureManager = SupremeTextureManager;

} ( ss ) );