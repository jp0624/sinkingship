require.include("weblib/liveparticles/updater/BaseParticleUpdater");

( function ( ns ) {
	
	BezierPathUpdater.prototype = new ns.BaseParticleUpdater ();
	BezierPathUpdater.constructor = BezierPathUpdater;

	function BezierPathUpdater ( propertyName, pointSet ) {
		
		ns.BaseParticleUpdater.call ( this );

		var _this = this;
		var _propertyName;
		var _bezierPath;
		var _start;

		var _construct = function ( propertyName, pointSet ) {
			
			_propertyName = propertyName;
			_start = pointSet [ 0 ].y;
			_bezierPath = new ss.BezierPath ( pointSet, { } );
		}

			/*
			* [PUBLIC OVERRIDE]
			* Initializes a set of particles for use by this updater
			* @param particles:Array[AbstractParticle] - List of particles to be updated	
			* @param startIndex:int - The index to start updating at
			* @param endIndex:int - The index to end updating at
			*/
		_this.initParticles = function ( particles, startIndex, endIndex ) {

				// No support for sub-property defined... YET!!!
			for ( var i = startIndex; i <= endIndex; i++ ){
				particles [ i ][ _propertyName ] = _start;
			}
		};

			/*
			* [PUBLIC OVERRIDE]
			* Perform updates on all particles in a list
			* @param particles:Array[AbstractParticle] - List of particles to be updated
			* @param delta:Number - Time elapsed since last update (in seconds)
			*/
		_this.updateParticles = function ( particles, delta ) { //jshint ignore:line

				//No sub-property defined
			for ( var i = 0; i < particles.length; i++ ) {
				particles [ i ][ _propertyName ] = _bezierPath.evaluate ( particles [ i ].normalizedLife * _bezierPath.distance () );
			}

		};

		return _construct ( propertyName, pointSet );
	}

	ns.BezierPathUpdater = BezierPathUpdater;

} ( ss ) );