require.include ( "weblib/command/CommandPackage" );


( function ( ns ) {
	
	function FlickerSpriteEffect ( effectData, spriteData, sprite ) {

		var _this = this;
		var _interval;

		var _spriteWidth;
		var _spriteHeight;
		var _commandQueue;

		var _construct = function ( effectData, spriteData, sprite ) {
			
			_commandQueue = new CommandQueue ();
			_commandQueue.start ();

			_interval = setInterval ( _changeSize, 250 );
		}

		var _changeSize = function ( resized ) {

			if ( !resized ) {
				_commandQueue.cancel ();
			}

			var flickerAmount = 0.95 + 0.08 * Math.random ();
			var flickerTime = 0.65 + 0.25 * Math.random ();

			var commandSet = new ns.CommandSet ();
			commandSet.tweenTo ( sprite.scale, flickerTime, { "x" : flickerAmount, "y" : flickerAmount } );
			commandSet.apply ( _changeSize );
			_commandQueue.queue ( commandSet );
		}

		_this.resize = function ( sprite, width, height ) {

			_spriteWidth = sprite.width;
			_spriteHeight = sprite.height;

			_changeSize ( true );

		}

		_this.update = function ( sprite, timeElapsed, delta ) {
			
		}

		return _construct ( effectData, spriteData, sprite );
	}

	ns.FlickerSpriteEffect = FlickerSpriteEffect;

} ( ss ) );