require.include ( "weblib/collection/Iterator" );

( function ( ns ) {
	"use strict"

	function BezierPoint ( x, y, bezierPoint ) {
		this.x = x;
		this.y = y;

		if ( isEmpty ( bezierPoint ) ) {
			this.distance = 0;
		} else {
			var xDist = x - bezierPoint.x;
			var yDist = y - bezierPoint.y;
			this.distance = Math.sqrt ( xDist * xDist + yDist * yDist );
			//console.log ( this.distance );
		}
	}

	function BezierPath ( pointSet, config ) {

		var _this = this;
		var _pointSet;
		var _grandularity;
		var _cachedPath;
		var _totalDistance;

		var _construct = function ( pointSet, config ) {

				// set up default config
			config = config || {};
 
			_pointSet = pointSet.slice ();
			_grandularity = setDefault ( config.grandularity, 7 );
			_totalDistance = 0;
			_cachedPath = [];

				// star twith the first point
			var iterator = new Iterator ( _pointSet );
			var firstPoint = iterator.next ();

				// build the rest of the cachedPath
			while ( iterator.hasNext () ) {
				_processBezier ( iterator.next (), iterator );
			}
			iterator.release ();

			

				// another loop to cache the distance
			for ( var i = 0; i < _cachedPath.length; i++ ) {
				_totalDistance += _cachedPath [ i ].distance;
			}

			return _this;
		}

		var _processBezier = function ( currentPoint, iterator ) {

	 		var previousPoint = iterator.peek ( -1 );

	 			// double check were not at the end point
	 		if ( !iterator.hasNext () ) {
	 			//return;
	 		}
	 		var nextPoint = iterator.next ();
	 		

	 		/* console.log ( previousPoint );
	 		console.log ( currentPoint );
	 		console.log ( nextPoint );
	 		console.log ( "-------------------" ); */




	 		for ( var i = 0; i <= _grandularity; i++ ) {

	 			var t = i / _grandularity;

	 			var segmentX = _getBezierValue ( previousPoint.x, currentPoint.x, nextPoint.x, t );
 				var segmentY = _getBezierValue ( previousPoint.y, currentPoint.y, nextPoint.y, t );
 				// console.log ( previousPoint.y + " " + currentPoint.y + " " + nextPoint.y + " " + t + " " + segmentY );

	 				// save current value
	 			var bezierPoint = new BezierPoint ( segmentX, segmentY, _cachedPath [ _cachedPath.length - 1 ] );
	 			_cachedPath.push ( bezierPoint );
	 		}
	 	}

	 	var _getBezierValue = function ( startVal, midval, endval, t ) {
	 		var t_1 = ( 1.0 - t ); 
	 		return ( t_1 * t_1 * startVal ) + ( 2.0 * t_1 * t * midval ) + ( t * t * endval );
	 	}

	 	window [ "bezier" ] = function ( startVal, midval, endval, t ) {
	 		var t_1 = ( 1.0 - t ); 
	 		return ( t_1 * t_1 * startVal ) + ( 2.0 * t_1 * t * midval ) + ( t * t * endval );
	 	}

	 	_this.distance = function () {
	 		return _totalDistance;
	 	}

			/*
			* Evaluate an interpolation for a range.
			* @param min: the min value of the range.
			* @param max: tha max value of the range.
			* @param t: how far along the curve we are (from 0 to 1)
			* @param: type the function to use for the interpolation.
			*/
		_this.evaluate = function ( distance, debug ) {

			var currentDistance = 0;
			var nodeValue;

				// find the current point to tween from
			for ( var i = 0; i < _cachedPath.length; i++ ) {
				
				currentDistance += _cachedPath [ i ].distance;
				if ( currentDistance >= distance ) {
					break;
				}
			}

				// use the distanced travelled between nodes
			var tween = ( distance - ( currentDistance - _cachedPath [ i ].distance ) ) / _cachedPath [ i ].distance;
			tween = ( isNaN ( tween ) ) ? 0 : tween;
			var inverseTween = 1.0 - tween;

				// tween the position
			var previousPoint = _cachedPath [ i ];
			var currentPoint = _cachedPath [ i - 1 ];

				// all done, return the tweened position
			return previousPoint.y * tween + currentPoint.y * inverseTween;
		}

		return _construct ( pointSet, config );
	}

	ns.BezierPath = BezierPath;

} ( ss ) );