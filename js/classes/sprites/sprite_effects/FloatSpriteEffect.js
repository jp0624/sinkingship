require.include ( "weblib/command/CommandPackage" );

( function ( ns ) {
	
	function FloatSpriteEffect ( effectData, spriteData, sprite ) {

		var _this = this;
		var _origin;
		var _position;
		var _speed;
		var _distance;
		var _name;
		var _rotation;
		var _rotationCommandQueue;
		var _rotationIter;
		var _sprite;

		var _construct = function ( effectData, spriteData, sprite ) {

			//console.log("Starting float effect on: " + spriteData);

			_sprite = sprite;

			var dragX = setDefault ( effectData.drag.x, effectData.drag );
			var dragY = setDefault ( effectData.drag.y, effectData.drag );

			_origin = { "x" : sprite.x, "y" : sprite.y };

			_position = {
				"x" : Math.random () * ( 2 * Math.PI ) * dragX, 
				"y" : Math.random () * ( 2 * Math.PI ) * dragY
			};

			

			_speed = {
				"x" : setDefault ( effectData.speed && effectData.speed.x, Math.random () * dragX ),
				"y" : Math.random () * dragY // setDefault ( data.speed && data.speed.y, Math.random () * data.drag )
			}
			
			_distance = {							
				"x" : setDefault ( effectData.distance && effectData.distance.x, 0.1 ), //setDefault ( data.distance && data.distance.x, Math.random () * ( 500 * ( 10 / 100 ) ) ), // sprite.width
				"y" : setDefault ( effectData.distance && effectData.distance.y, 0.1 ) // setDefault ( data.distance && data.distance.y, Math.random () * ( 500 * ( 10 / 100 ) ) ) // sprite.height
			}

			if ( !isEmpty ( effectData.rotation ) ) {

				_rotation = {
					"min" : setDefault ( effectData.rotation && effectData.rotation.min * 0.0174532925, -15 * 0.0174532925 ),
					"max" : setDefault ( effectData.rotation && effectData.rotation.max * 0.0174532925, 15 * 0.0174532925 ),
					"speed" : setDefault ( effectData.rotation && effectData.rotation.speed, 1.75 ),
				}

				// _rotationIter = new Iterator ();

				var commandSet = new ns.CommandSet ();
				commandSet.tweenTo ( _sprite, _rotation.speed + 0.5 * 0.25 * Math.random (), { "rotation" : _rotation.min, "ease" : Sine.easeInOut } );
				commandSet.tweenTo ( _sprite, _rotation.speed + 0.5 * Math.random (), { "rotation" : _rotation.max, "ease" : Sine.easeInOut } );
				commandSet.apply ( function () { _changeRotation () } );

				_rotationCommandQueue = commandSet.queue ();
			}
		}

		function _changeRotation () {

			var commandSet = new ns.CommandSet ();
			commandSet.tweenTo ( _sprite, _rotation.speed + 0.5 * Math.random (), { "rotation" : _rotation.min, "ease" : Sine.easeInOut } );
			commandSet.tweenTo ( _sprite, _rotation.speed + 0.5 * Math.random (), { "rotation" : _rotation.max, "ease" : Sine.easeInOut } );
			commandSet.apply (  function () { _changeRotation () } );

			_rotationCommandQueue.queue ( commandSet );
		}

		_this.resize = function ( sprite, width, height ) {
			_origin.x = sprite.x;
			_origin.y = sprite.y;
		}

		_this.update = function ( sprite, timeElapsed, delta ) {

			_position.x += _speed.x * delta;
			_position.y += _speed.y * delta;
			
			sprite.x = _origin.x + Math.cos ( _position.x ) * ( sprite.width * _distance.x );
			sprite.y = _origin.y + Math.sin ( _position.y ) * ( sprite.height * _distance.y );
		}

		return _construct ( effectData, spriteData, sprite );
	}

	ns.FloatSpriteEffect = FloatSpriteEffect;

} ( ss ) );