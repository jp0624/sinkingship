require.include ( "weblib/core/AbstractObject" );


	// Inherits from DisplayObjectContainer
ScrollManager.prototype = new AbstractObject ();
ScrollManager.constructor = ScrollManager;

function ScrollManager () {

	var _super = {};
	var _this = AbstractObject.call ( this );
	var _targetPosition;
	var _currentPosition;
	var _isDragging;
	var _lastMousePosX;
	var _lastMousePosY;

	var _maxScroll;

	var _LastUpdateTimestamp;

	var _k; //springyness
	var _damping; //multiplier to slow
	var _velocity;

	var _scrollSpySet;

	var _loadScrollSprite;

	var _timeToLock = 0;

	var _focusPercentage;

	var _page;

	_this.isLocked = false;


	var _construct = function () {
		
		_page = 0;
		_focusPercentage = 0;

		_timeToLock = 0;
		_scrollSpySet = [];

		/* var direction = ss.ScrollManager.targetPosition () - _sceneManager.y;
		direction = direction * k;
		velocity = (velocity * damping) + direction; */

		_k = 1.5; 
		_damping = 0.02; // 0.02;
		_velocity = 0;

		_isDragging = false;
		_targetPosition = 0;
		_currentPosition = 0;
		_maxScroll = 0;

		_resetLock();
	}

	var _filter = function ( val ) {
		_targetPosition = Math.max ( _maxScroll, Math.min ( 0, val ) );

	}


	var _onMouseWheel = function ( evt ) {

			//This detects the mouse wheel movement/change
		//console.dir(evt);
		var deltaY = evt.originalEvent.deltaY * -1;

		_targetPosition += deltaY * 0.35;
		_resetLock();
			// filter the target Position
		_filter ( _targetPosition );
	}

	var _resetLock = function () {
		_timeToLock = 1;
		_this.isLocked = false;
	}

	var _onInteractKeyDown = function ( evt ) {
		console.log('key pressed');

		var winHeight = $ ( window ).height ();

		// 38 = up, 40 = down
		if ( evt.keyCode == 38 ) {
			_targetPosition += 100;
		} else if ( evt.keyCode == 40 ) {
			_targetPosition += -100;
		} else if ( evt.keyCode == 36 ) {
			_targetPosition = 0;
		} else if ( evt.keyCode == 35 ) {
			_targetPosition = ( winHeight * ( -1 ) );
		} else if ( evt.keyCode == 34 ) {
			_targetPosition += winHeight * (-1);
		} else if ( evt.keyCode == 33 ) {
			_targetPosition += winHeight;
		}
		_resetLock();
			// filter the target Position
		_filter ( _targetPosition );

	}

	var _onInteractStart = function ( evt ) {
		_isDragging = true;
		_lastMousePosY = evt.pageY;
		_lastMousePosX = evt.pageX;
	}

	var _onInteractMove = function ( evt ) {
		
		if ( _isDragging ) {
			var mouseDelta = evt.pageY - _lastMousePosY;
			_targetPosition += mouseDelta;
			_lastMousePosY = evt.pageY;
			_lastMousePosX = evt.pageX;
			_resetLock();
		}
		
			// filter the target Position
		_filter ( _targetPosition );
	}

	var _onInteractEnd = function ( evt ) {
		_isDragging = false;
	}

	_this.targetPosition = function () {
		return _currentPosition;
	}

	_this.maxScroll = function ( val ) {
		if ( !isEmpty ( val ) ) {

			var resizeScale = Math.abs ( val / _maxScroll );
			var currentPositionScale = Math.abs ( _currentPosition / _maxScroll );


			
			//_currentPosition = currentPositionScale * -val;
			//_targetPosition = currentPositionScale * -val;

			/* console.log ( "_currentPosition" + _currentPosition );
			console.log ( "_targetPosition" + _targetPosition );
			console.log ( "resizeScale" + resizeScale );
			console.log ( "resizeScale" + resizeScale ); */


			_maxScroll = -val;
		}

		return _maxScroll;
	}

	_this.init = function () {
		_LastUpdateTimestamp = Date.now ();

		$ ( window ).keydown ( _onInteractKeyDown );

		window.onmousedown = _onInteractStart;
		window.addEventListener ( "touchstart", 	_onInteractStart );
		window.onmousemove = _onInteractMove;
		window.addEventListener ( "touchmove", 	_onInteractMove );
		window.onmouseup = _onInteractEnd;
		window.onmouseout = _onInteractEnd;
		window.addEventListener ( "touchend", 	_onInteractEnd );
		window.addEventListener ( "touchleave", 	_onInteractEnd );
		window.addEventListener ( "touchcancel", 	_onInteractEnd );

		$ ( "body" ).on ( 'mousewheel', _onMouseWheel );

	}

	_this.update = function () {


		var currentTime = Date.now ();
		var elapsedTime = currentTime - _LastUpdateTimestamp;
		var delta = elapsedTime  / 1000.0;

		var winHeight =  $(window).height();


		var lockedPosition;
		var $sections = $ ( "#contentContainer > section" );
		var sectionCount = $sections.length;

		if ( $sections.length ) {

			var minDistance = Number.MAX_VALUE;
			var lockIndex = 0;

			for ( var i = 0; i < sectionCount; i++ ) {
				 var pos = $sections.eq ( i ).position ().top / 2;
				 var distance = Math.abs(_targetPosition + pos );
				 if (distance < minDistance) {
				 	lockedPosition = -pos;
				 	lockedPosition = Math.max ( _maxScroll, Math.min ( 0, lockedPosition ) );
				 	minDistance = distance;
				 }
			}
		} else {
			lockedPosition = _targetPosition;
		}

		if(_timeToLock >= 0) {
			_timeToLock -= delta;
		} else {
			_this.isLocked = true;
			//console.log(lockedPosition);
			_targetPosition = lockedPosition;
		}


		var direction;
		if (_this.isLocked) {
		 	//console.log("LOCKED!");
		 	direction = ( lockedPosition - _currentPosition );
		 } else {
			direction = ( _targetPosition - _currentPosition );
		}

		_velocity += direction * _k * 100;
		_velocity = _velocity * _damping;

		_currentPosition += _velocity * delta;
		if ( isNaN ( _currentPosition ) ) {
			console.log ( _currentPosition );
			console.log ( direction );
			console.log ( _k );
			console.log ( direction );
			throw new "damnnnnn";
		}

		_LastUpdateTimestamp = currentTime;
	}

	_this.setPage = function ( val ) {
		_page = val;
		_targetPosition = _page * -ss.SiteManager.windowHeight ();

		_resetLock ();
	}

	_this.focus = function () {
		console.log ( "focus cp", _currentPosition );
		console.log ( "focus tp", _targetPosition );
		console.log ( "focus max", _maxScroll );

		_resetLock ();
	}

	_this.blur = function () {
		console.log ( "blur cp", _currentPosition );
		console.log ( "blur tp", _targetPosition );
		console.log ( "blur max", _maxScroll );
	}

	return _construct ();
}