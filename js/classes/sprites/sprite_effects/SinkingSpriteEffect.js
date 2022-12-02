require.include("weblib/math/interpolation/Interpolation");

( function ( ns ) {
	"use strict";
	
	function SinkingSpriteEffect ( effectData, spriteData, sprite ) {

		var _this = this;
		var _sprite;
		var _sinkPointSet;
		var _ease = 0.3; 
		var _targetX;
		var _targetY;
		var _shouldEase;
		var _position;

		// TEMP float: REMOVE LATER.
		var _sinOffset = 0;
		var _sinRate = 3;
		// END OF TEMP.

		var _construct = function ( effectData, spriteData, sprite ) {

			_position = effectData.position;
			_sinkPointSet = effectData.sink_point_set;
			_sprite = sprite;
			_ease = 0.3;
			_shouldEase = true;
			if(effectData.ease == "false") {
				_shouldEase = false;
			}



			return _this;
		}

		_this.update = function ( sprite, timeElapsed, delta ) {

			try {
				_sinOffset = (_sinOffset + (delta * _sinRate)) % (Math.PI * 2);

				var normalizedScrollPosition = Math.abs ( ss.ScrollManager.targetPosition () / ss.SiteManager.windowHeight () );

					// find what 
				var lastScrollInfo = _sinkPointSet [ 0 ];
				for ( var i = 1; i < _sinkPointSet.length; i++ ) {
					if ( normalizedScrollPosition < _sinkPointSet [ i ].scroll ) {
						break;
					}

					lastScrollInfo = _sinkPointSet [ i ];
				}

				i = Math.min ( i, _sinkPointSet.length - 1 );
				//normalizedScrollPosition = Math.min ( i, _sinkPointSet.length - 1 );

				var range = _sinkPointSet [ i ].scroll - lastScrollInfo.scroll;
				var positionInRange = normalizedScrollPosition - lastScrollInfo.scroll;
				var interpolateVal = positionInRange / range;
				if (_shouldEase) {
					interpolateVal = Interpolation.smoothStep(interpolateVal);
				}
				//console.log("I:" + interpolateVal);

				var normalizedX = interpolateVal * _sinkPointSet [ i ].position.x + ( 1.0 - interpolateVal ) * lastScrollInfo.position.x;
				var normalizedY = interpolateVal * _sinkPointSet [ i ].position.y + ( 1.0 - interpolateVal ) * lastScrollInfo.position.y;

				var interpolatedRotation = interpolateVal * _sinkPointSet[i].rotation + (1.0 - interpolateVal) * lastScrollInfo.rotation;

				var normalizedSinMult = interpolateVal * _sinkPointSet[i].sinBobMult + (1.0 - interpolateVal) * lastScrollInfo.sinBobMult;
				var normalizedsinRotateMult = interpolateVal * _sinkPointSet[i].sinRotateMult + (1.0 - interpolateVal) * lastScrollInfo.sinRotateMult;

				var sinAmt = (Math.sin(_sinOffset) * normalizedSinMult);

				var layerSprite = sprite.parent;
				var normalizeLayerY = layerSprite.normalizedY ();
				var layerScreenOffset = ( _position == "absolute" ) ? layerSprite.normalizedY () * ss.SiteManager.windowHeight () : 0;


				// console.log ( layerScreenOffset );

				_sprite.y = ( -layerScreenOffset -ss.ScrollManager.targetPosition () + ss.SiteManager.windowHeight () *  normalizedY ) + sinAmt;
				_sprite.x = ss.SiteManager.windowWidth () * normalizedX;
				_sprite.rotation = interpolatedRotation + (Math.sin(_sinOffset) * normalizedsinRotateMult);


				//console.log ( normalizedScrollPosition + " " + interpolateVal + " " + positionInRange + " " + range +  " " + i );
				//console.log ( ( normalizedScrollPosition < _sinkPointSet [ i ].scroll ) + " " + _sinkPointSet [ i ].scroll );


			} catch ( e ) {
				//console.log ( i )
				console.log ( e )
			}
		}

		_this.resize = function ( width, height ) {

		}

		return _construct ( effectData, spriteData, sprite );
	}

	ns.SinkingSpriteEffect = SinkingSpriteEffect;

} ( ss ) );