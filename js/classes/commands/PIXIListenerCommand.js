require.include ( "weblib/command/AbstractCommand" );

( function ( ns ) {
	"use strict";

	PIXIListenerCommand.prototype = new ns.AbstractCommand ();
	PIXIListenerCommand.constructor = PIXIListenerCommand;

	function PIXIListenerCommand ( target, event, listener, context ) {

	    var _super = {};
	    var _this = ns.AbstractCommand.call ( this, "PIXIListenerCommand" );

	    var _target;
	    var _event;
	    var _listener;
	    var _context;

	    function _construct ( target, event, listener, context ) {
	        _target = target;
	        _event = event;
	        _listener = listener;
	        _context = context;

	        return _this;
	    };

	    function _onEventCaptured ( target, data ) {

	        if ( _listener )
	            _listener.apply ( _this._context, [ target, data ] );
	        
	        _super.execute ();
	    };

	    _super.execute = _this.execute;
	    _this.execute = function ( session ) {
	        if ( _this.state () == "CommandState.IDLE" ) {

	            _this.state ( "CommandState.EXECUTING" );
	            _target.on ( _event, _onEventCaptured );
	        }
	    };

	    _super.release = _this.release;
	    _this.release = function ( session ) {
	        //_target.off ( _event, _onEventCaptured );
	        //_super.release ();
	    };
	    
	    return _construct ( target, event, listener, context );
	}

		// assign to global namespace
	ns.PIXIListenerCommand = PIXIListenerCommand;

} ( ss ) );
