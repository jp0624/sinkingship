( function ( ns ) {
	
	//Extend PIXI.DisplayObjectContainer
	BubbleSplashEffect.prototype = new PIXI.DisplayObjectContainer();
	BubbleSplashEffect.constructor = BubbleSplashEffect;

	function BubbleSplashEffect ( data ) {

			// Call DisplayObjectContainer base class constructor
		PIXI.DisplayObjectContainer.call(this);

		var _this = this;
		var _emitter;

		var _construct = function ( data ) { 
			var bubbleTexture = PIXI.Texture.fromImage ( BUBBLE_TEXTURE );
			var factory = new ss.PixiSpriteParticleFactory ( bubbleTexture );
			var spawnTimer = new ss.UniformSpawnTimer(3);
			
													//(center, radius, minSpeed, maxSpeed, minAngle, maxAngle)
			var spawnShape = new ss.BoxSpawnShape ( new ss.Rectangle ( 0, 0, ss.SiteManager.windowWidth (), ss.SiteManager.windowHeight () ), 0, 0, 0, 0 );
			_emitter = new ss.PixiParticleEmitter();
			_emitter.setupFromObjects(100, 2, 4, factory, spawnTimer, spawnShape, [
				new ss.InterpolatePropertyUpdater("alpha", 1, 0, Interpolation.linear),
				new ss.InterpolatePropertyUpdater("y", 1000, 0, Interpolation.linear)
			], _this );

			//new ss.InterpolatePropertyUpdater("scale", 0.5, 20, Interpolation.linear, "y")
			//_emitter.x = sprite.x;// * _effectData.position.x;
			//_emitter.y = sprite.y; // * _effectData.position.y;
			_this.addChild ( _emitter );
			
		}

		_this.activate = function () {
			_emitter.startEmit ();
		}

		_this.fade = function () {
			_emitter.stopEmit ();
		}

		return _construct ( data );
	}

	ns.BubbleSplashEffect = BubbleSplashEffect;

} ( ss ) );