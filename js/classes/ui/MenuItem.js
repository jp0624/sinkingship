( function () {
	
	MenuItem.prototype = new PIXI.DisplayObjectContainer ();  
	MenuItem.constructor = MenuItem;

	function MenuItem ( data ) {

			// execute Mix-ins
		PIXI.DisplayObjectContainer.call ( this );
		PIXI.EventTarget.call ( this );

		var _super = {};
		var _this = this;
		var _text;


		function _construct ( data ) {
			var menuTexture = PIXI.Texture.fromImage ( QUICK_MENU_NODE );
			var sprite = new PIXI.Sprite ( menuTexture );
			_this.addChild ( sprite );

			console.log ( "data", data );

			if ( !isEmpty ( data.details ) ) {
				var label = data.details.name;
				_text = new PIXI.Text ( label.toUpperCase (), {font:"12px din_alternatebold", fill:"white"});
				_text.x = 30;
				_text.y = 5;
				_this.addChild ( _text );
			}


			/* _this.setInteractive = true;
			_this.mouseover = function () {
				TweenMax.to ( _this, 0.5, { "alpha" : 1 } );
			} 


			_this.buttonMode = true; */
		}

		_this.update = function () {

			if ( _text && _this.alpha > 0.8 ) {

				_text.alpha = Math.max ( 0, _text.alpha -_text.alpha * 0.3 );
				
			} else if ( !isEmpty ( _text ) ) {
				_text.alpha = Math.min ( 1, _text.alpha  + ( 1.0 - _text.alpha ) * 0.3 );
			}
		}

		return _construct ( data );
	}

	ss.MenuItem = MenuItem;

} ( ss ) );