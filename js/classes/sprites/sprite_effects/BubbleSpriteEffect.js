require.include("classes/liveparticles/updaters/BubbleParticleInitializer");
require.include("classes/liveparticles/updaters/RandomPropertyRateChangeUpdater");

( function ( ns ) {
	"use strict";
	
	function BubblesSpriteEffect ( effectData, spriteData, sprite ) {

		var _this = this;
		var _emitter;
		var _effectData;
		var _emissionCutoff;
		var _rate;
		var _bubbleScale;
		var _scaleInitializer;

		var _construct = function ( effectData, spriteData, sprite ) {
			
			_effectData = effectData; //  ss.SiteManager.mergeTemplate ( effectData );
			
			_emissionCutoff = setDefault(effectData.emissionCutoff, 0);
			_rate = setDefault(effectData.rate, 0.5);
				
			_bubbleScale = setDefault ( effectData.scale, 0.3 );	
			
			var radius = setDefault(effectData.radius, 0);
			//console.log('radius: ', radius);

			var windowRatio =  ss.SiteManager.windowWidth () / 1920;

			var minLife = setDefault(effectData.minLife, 5);
			var maxLife = setDefault(effectData.maxLife, 10);
			
			var minAngle = setDefault(effectData.minAngle, 260);
			var maxAngle = setDefault(effectData.maxAngle, 280);
			
			var minSpeed = setDefault(effectData.minSpeed, 0.01);
			var maxSpeed = setDefault(effectData.maxSpeed, 0.01);
			
			var startAlpha = setDefault(effectData.startAlpha, 1);
			var endAlpha = setDefault(effectData.endAlpha, 0);

			var maxParticles = setDefault(effectData.maxParticles, 50);

			var bubbleTexture = PIXI.Texture.fromImage ( BUBBLE_TEXTURE );
			var factory = new ns.PixiSpriteParticleFactory ( bubbleTexture ); // , new Vector2(12, 12)
			var spawnTimer = new ns.UniformSpawnTimer(_rate);

			_scaleInitializer = new ns.BubbleParticleInitializer(0.2 * _bubbleScale * windowRatio, 1.2 * _bubbleScale * windowRatio, 20.0 * windowRatio, 80.0 * windowRatio);

													//(center, radius, minSpeed, maxSpeed, minAngle, maxAngle)
			var spawnShape = new ns.RadialSpawnShape(new Vector2(0, 0), radius, minSpeed, maxSpeed, minAngle, maxAngle);
			_emitter = new ns.PixiParticleEmitter();
			_emitter.setupFromObjects(maxParticles, minLife, maxLife, factory, spawnTimer, spawnShape, [
				_scaleInitializer,
				new ns.InterpolatePropertyUpdater("alpha", startAlpha, endAlpha, Interpolation.inverseSquared),
				new ns.CycleInterpolatePropertyUpdater("velX", -5.0, 24.0, Interpolation.linear, 0.8, 0.2),
				new ns.RandomPropertyRateChangeUpdater("x", -10, 30),
				new ns.ForceUpdater(0,-20)
/*				new ss.InterpolatePropertyUpdater("scale", 0.5, 1.5, Interpolation.linear, "x"),
				new ss.InterpolatePropertyUpdater("scale", 0.5, 1.5, Interpolation.linear, "y")*/
			], sprite.parent );

			_emitter.x = sprite.x;// * _effectData.position.x;
			_emitter.y = sprite.y; // * _effectData.position.y;
			sprite.parent.addChild ( _emitter );

			_emitter.startEmit ();

		}

		_this.resize = function ( sprite, width, height ) {
			try {
					var windowRatio =  ss.SiteManager.windowWidth () / 1920;
					//console.log ( sprite.width + " " + _effectData.position.x );
						_emitter.x = sprite.x + sprite.width * _effectData.position.x;
						_emitter.y = sprite.y + sprite.height * _effectData.position.y;
						_scaleInitializer.minScale = 0.2 * _bubbleScale * windowRatio;
						_scaleInitializer.maxScale = 1.2 * _bubbleScale * windowRatio;
						_scaleInitializer.minSpeed = 20.0 * windowRatio;
						_scaleInitializer.maxSpeed = 80.0 * windowRatio;
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

		_this.update = function ( sprite, timeElapsed, delta ) {
			try {
					//console.log(_emissionCutoff);
					var normalizedScrollPosition = Math.abs ( ss.ScrollManager.targetPosition () / ss.SiteManager.windowHeight () );
					//console.log(normalizedScrollPosition);
					//console.log ( sprite.width + " " + _effectData.position.x );
						_emitter.x = sprite.x + sprite.width * _effectData.position.x;
						_emitter.y = sprite.y + sprite.height * _effectData.position.y;
						if (normalizedScrollPosition >= _emissionCutoff) {

							_emitter.setIsEmitting(true);
						} else {
							_emitter.setIsEmitting(false);
							_emitter.removeAllParticles();
						}
					} catch ( e ) {
							//console.log ( e )
					}
		}

		return _construct ( effectData, spriteData, sprite );
	}

	ns.BubblesSpriteEffect = BubblesSpriteEffect;

} ( ss ) );