( function ( ns ) {
	
	function SunFlickerEffect ( effectData, spriteData, sprite ) {

		var _this = this;
		var _origin;
		var _position;
		var _speed;
		var _distance;
		var _name;

		var _construct = function ( effectData, spriteData, sprite ) {

			var dragX = setDefault ( effectData.drag.x, effectData.drag );
			var dragY = setDefault ( effectData.drag.y, effectData.drag );

			_origin = { "x" : sprite.x, "y" : sprite.y };

			_position = {
				"x" : Math.random () * ( 2 * Math.PI ), 
				"y" : Math.random () * ( 2 * Math.PI ) * dragY
			};

			_speed = {
				"x" :  Math.random () * dragX, // setDefault ( data.speed && data.speed.x, Math.random () * data.drag ),
				"y" : Math.random () * dragY // setDefault ( data.speed && data.speed.y, Math.random () * data.drag )
			}
			
			_distance = {							
				"x" : Math.random (), //setDefault ( data.distance && data.distance.x, Math.random () * ( 500 * ( 10 / 100 ) ) ), // sprite.width
				"y" : Math.random () // setDefault ( data.distance && data.distance.y, Math.random () * ( 500 * ( 10 / 100 ) ) ) // sprite.height
			}

		}

		_this.resize = function ( sprite, width, height ) {
			_origin.x = sprite.x;
			_origin.y = sprite.y;
		}

		_this.update = function ( sprite, timeElapsed, delta ) {

			_position.x += _speed.x * delta;
			_position.y += _speed.y * delta;

			//console.log ( _position.x = " " + _position.y );
			
			sprite.x = _origin.x + Math.cos ( _position.x ) * ( sprite.width * 0.1 );
			sprite.y = _origin.y + Math.sin ( _position.y ) * ( sprite.height * 0.1 );
		}

		return _construct ( effectData, spriteData, sprite );
	}

	ns.SunFlickerEffect = SunFlickerEffect;

} ( ss ) );