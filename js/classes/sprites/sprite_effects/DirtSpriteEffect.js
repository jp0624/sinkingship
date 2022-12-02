require.include ( "classes/math/geom/MathPackage" );
require.include ( "classes/liveparticles/updaters/UpdaterPackage" );



( function ( ns ) {
	"use strict";

	function DirtSpriteEffect ( effectData, spriteData, sprite ) {

		var _this = this;
		var _ready;
		var dirtTexture;
		var _sprite;
		var _spawnShape;
		var _forceMultiplier;
		var _sizeMultiplier;
		var _emitter;


		var _construct = function ( effectData, spriteData, sprite ) {

			_sprite = sprite;

			_sizeMultiplier = setDefault(effectData.sizeMultiplier, 1);


		
			_forceMultiplier = setDefault(effectData.forceMultiplier, 1);
			
			dirtTexture = PIXI.Texture.fromImage ( DIRT_TEXTURE );


			if ( dirtTexture.baseTexture.hasLoaded ) {
				_ready = true;

				_textureReady ( dirtTexture );

 				//_this.emit ( { 'type': TEXTURE_READY, 'content' : _this } );
			} else {
				dirtTexture.baseTexture.once ( "loaded", function () {
					
				_textureReady ( dirtTexture );


					//_this.emit ( { 'type': TEXTURE_READY, 'content' : _this } );
				} );

				dirtTexture.baseTexture.once ( "error", function () {
					console.log ( "load error");
				} ) 
			}

			

			return _this;
		}

		var _scaleXUpdater;
		var _scaleYUpdater;

		var _textureReady = function ( dirtTexture ) {

			var factory = new ns.PixiSpriteParticleFactory ( dirtTexture );
			var windowRatio =  ss.SiteManager.windowWidth () / 1920;
			var spawnTimer = new ss.UniformSpawnTimer ( 40 * windowRatio);
								//function(rect, minSpeed, maxSpeed, minRotate, maxRotate){
			var emitorSize = Math.random() * (2 * Math.PI) * 2;
			_spawnShape = new ss.BoxSpawnShape ( new ss.Rectangle ( 0, 0, ss.SiteManager.windowWidth (), ss.SiteManager.windowHeight ()  * 1.3), 0, 0, emitorSize, emitorSize );
			_emitter = new ss.PixiParticleEmitter();
			_scaleXUpdater	= new ss.InterpolatePropertyUpdater("scale", 0.02 * _sizeMultiplier * windowRatio, 0.1 * _sizeMultiplier * windowRatio, Interpolation.squared, "x");
			_scaleYUpdater = new ss.InterpolatePropertyUpdater("scale", 0.02 * _sizeMultiplier * windowRatio, 0.1 * _sizeMultiplier * windowRatio, Interpolation.squared, "y"),
			_emitter.setupFromObjects( 100, 5, 10, factory, spawnTimer, _spawnShape, [
				new ss.BezierPathUpdater ( "alpha", [ 
					{ "x" : 0, "y" : 0 },
					{ "x" : 0.5, "y" : 0.75 },
					{ "x" : 1, "y" : 0 } ] ),
				//new ss.InterpolatePropertyUpdater("scale", 0.05, 0.2, Interpolation.linear, "x"),
				//new ss.InterpolatePropertyUpdater("scale", 0.05, 0.2, Interpolation.linear, "y")
				_scaleXUpdater,
				_scaleYUpdater,
				new ns.CycleInterpolatePropertyUpdater("velY", -10 * _forceMultiplier, 10 * _forceMultiplier , Interpolation.smoothStep, 2,0),
				new ss.ForceUpdater(10 * _forceMultiplier, 0)
			], _sprite );

				// set the emitter data
			_emitter.x = 0;
			_emitter.y = - ss.SiteManager.windowHeight() * 0.2;

			_sprite.addChild ( _emitter );
			_emitter.startEmit ();
		}

		_this.resize = function ( sprite, width, height ) {

			try {
					//console.log("resize");
					var emitorSize = Math.random() * (2 * Math.PI) * 2;
					_spawnShape.resetSpawnRect(new ss.Rectangle ( 0, 0, ss.SiteManager.windowWidth (), ss.SiteManager.windowHeight ()  * 1.3));
					_emitter.y = - ss.SiteManager.windowHeight() * 0.2;
					var windowRatio =  ss.SiteManager.windowWidth () / 1920;
					_spawnTimer.setSpawnRate(40 * windowRatio);
					_scaleXUpdater.start = 0.02 * _sizeMultiplier * windowRatio;
					_scaleXUpdater.end = 0.1 * _sizeMultiplier * windowRatio;
					_scaleYUpdater.start = 0.02 * _sizeMultiplier * windowRatio;
					_scaleYUpdater.end = 0.1 * _sizeMultiplier * windowRatio;
					_emitter.removeAllParticles();
				} catch ( e ) {
						//console.log ( e )
				}
		}

		_this.blur = function() {
			_emitter.pause();
		}

		_this.focus = function () {
			_emitter.resume()
		}


		/* _this.update = function () {

		} */

		return _construct ( effectData, spriteData, sprite );
	}

	ns.DirtSpriteEffect = DirtSpriteEffect;

} ( ss ) );