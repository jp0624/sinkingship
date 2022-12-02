( function ( ns ) {
	
	function LightBeamSpriteEffect ( effectData, spriteData, sprite ) {

		var _this = this;
		var _spawnShape2;

		var _construct = function ( effectData, spriteData, sprite ) {

			_sprite = sprite;
			lightBeamTexture = PIXI.Texture.fromImage ( LIGHT_BEAM_TEXTURE );
			console.log ( lightBeamTexture );


			if ( lightBeamTexture.baseTexture.hasLoaded ) {
				_ready = true;

				_textureReady ( lightBeamTexture );

 				//_this.emit ( { 'type': TEXTURE_READY, 'content' : _this } );
			} else {
				lightBeamTexture.baseTexture.once ( "loaded", function () {
					
				_textureReady ( lightBeamTexture );


					//_this.emit ( { 'type': TEXTURE_READY, 'content' : _this } );
				} );

				lightBeamTexture.baseTexture.once ( "error", function () {
					console.log ( "load error");
				} ) 
			}
		}

		_this.blur = function() {
			_emitter && _emitter.pause();
		}

		_this.focus = function () {
			_emitter.resume()
		}

		var _emitter;
		var _spawnTimer;

		var _textureReady = function ( lightBeamTexture ) {

			var factory = new ns.PixiSpriteParticleFactory ( lightBeamTexture, new PIXI.Point ( 0.5, 0 ) );

			var windowRatio =  ss.SiteManager.windowWidth () / 1080;
			_spawnTimer = new ss.UniformSpawnTimer ( 5 * windowRatio);
								//function(rect, minSpeed, maxSpeed, minRotate, maxRotate){
			var emitterRotationMin = ( Math.PI ) * 0.15;
			var emitterRotationMax = ( Math.PI ) * 0.2;
			_spawnShape = new ss.BoxSpawnShape ( new ss.Rectangle ( 0, 0, ss.SiteManager.windowWidth () * 2, ss.SiteManager.windowHeight () * 0.01 ), 0, 0, emitterRotationMin, emitterRotationMax ); 
			_emitter = new ss.PixiParticleEmitter ();
			_emitter.setupFromObjects( 100, 1, 5, factory, _spawnTimer, _spawnShape, [
				new ss.BezierPathUpdater ( "alpha", [ 
					{ "x" : 0, "y" : 0 },
					{ "x" : 0.25, "y" : 1.5 },
					{ "x" : 1, "y" : 0 } ] ),
				new ss.InterpolatePropertyUpdater("scale", 0.75, 2.5, Interpolation.linear, "y")
			], _sprite );

				// set the emitter data
			_emitter.x = 0;
			_emitter.y = -ss.SiteManager.windowHeight () * 0.35;

			_sprite.addChild ( _emitter );
			_emitter.startEmit();
		}

		_this.resize = function ( sprite, width, height ) {
			try {
					//console.log ( sprite.width + " " + _effectData.position.x );
					_spawnShape.resetSpawnRect( new ss.Rectangle ( 0, 0, ss.SiteManager.windowWidth () * 2, ss.SiteManager.windowHeight () * 0.01 ));
					_emitter.y = -ss.SiteManager.windowHeight () * 0.35;
					var windowRatio =  ss.SiteManager.windowWidth () / 1080;
					_spawnTimer.setSpawnRate(5 * windowRatio);
				} catch ( e ) {
						//console.log ( e )
				}
		}

		return _construct ( effectData, spriteData, sprite );
	}

	ns.LightBeamSpriteEffect = LightBeamSpriteEffect;

} ( ss ) );