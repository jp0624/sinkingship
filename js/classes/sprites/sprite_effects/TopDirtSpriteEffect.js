require.include ( "classes/math/geom/MathPackage" );
require.include ( "classes/liveparticles/updaters/UpdaterPackage" );



( function ( ns ) {
	"use strict";

	function TopDirtSpriteEffect ( effectData, spriteData, sprite ) {

		var _this = this;
		var _ready;
		var dirtTexture;
		var _sprite;
		var _spawnShape;

		var _construct = function ( effectData, spriteData, sprite ) {

			_sprite = sprite;


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

		var _spawnTimer;
		var _emitter;
		var _scaleXUpdater;
		var _scaleYUpdater;

		var _textureReady = function ( dirtTexture ) {
			var windowRatio =  ss.SiteManager.windowWidth () / 1920;
			var factory = new ns.PixiSpriteParticleFactory ( dirtTexture );
			_spawnTimer = new ss.UniformSpawnTimer ( 50  * windowRatio);
								//function(rect, minSpeed, maxSpeed, minRotate, maxRotate){
			var emitorSize = Math.random() * (2 * Math.PI) * 2;
			_spawnShape = new ss.BoxSpawnShapeWithDistribution ( new ss.Rectangle ( 0, 0, ss.SiteManager.windowWidth (), ss.SiteManager.windowHeight ()  * 0.4), 0, 0, emitorSize, emitorSize, Interpolation.one, Interpolation.inverseSquared, true, true );
			_emitter = new ss.PixiParticleEmitter();
			_scaleXUpdater = new ss.InterpolatePropertyUpdater("scale", 0.02 * windowRatio, 0.1 * windowRatio, Interpolation.squared, "x");
			_scaleYUpdater = new ss.InterpolatePropertyUpdater("scale", 0.02 * windowRatio, 0.1 * windowRatio, Interpolation.squared, "y");
			_emitter.setupFromObjects( 250, 3, 5, factory, _spawnTimer, _spawnShape, [
				new ss.BezierPathUpdater ( "alpha", [ 
					{ "x" : 0, "y" : 0 },
					{ "x" : 0.05, "y" : 1 },
					{ "x" : 1, "y" : 0 } ] ),
				//new ss.InterpolatePropertyUpdater("scale", 0.05, 0.2, Interpolation.linear, "x"),
				//new ss.InterpolatePropertyUpdater("scale", 0.05, 0.2, Interpolation.linear, "y")
				_scaleXUpdater,
				_scaleYUpdater,
				new ss.ForceUpdater(10, 0)
			], _sprite );

				// set the emitter data
			_emitter.x = 0;
			_emitter.y = ss.SiteManager.windowHeight() * 0.75;
			_sprite.addChild ( _emitter );
			_emitter.startEmit ();
		}

		_this.blur = function() {
			_emitter.pause();
		}

		_this.focus = function () {
			_emitter.resume()
		}

		_this.resize = function ( sprite, width, height ) {

			try {
					var emitorSize = Math.random() * (2 * Math.PI) * 2;
					_spawnShape.resetSpawnRect(new ss.Rectangle ( 0, 0, ss.SiteManager.windowWidth (), ss.SiteManager.windowHeight ()  * 0.4));
					_emitter.y = ss.SiteManager.windowHeight() * 0.75;
					var windowRatio =  ss.SiteManager.windowWidth () / 1920;
					_spawnTimer.setSpawnRate(50 * windowRatio);
					_scaleXUpdater.start = 0.02 * windowRatio;
					_scaleXUpdater.end = 0.1 * windowRatio;
					_scaleYUpdater.start = 0.02 * windowRatio;
					_scaleYUpdater.end = 0.1 * windowRatio;
					_emitter.removeAllParticles();
				} catch ( e ) {
						//console.log ( e )
				}
		}

		/* _this.update = function () {

		} */

		return _construct ( effectData, spriteData, sprite );
	}

	ns.TopDirtSpriteEffect = TopDirtSpriteEffect;

} ( ss ) );