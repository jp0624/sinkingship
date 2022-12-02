( function ( ns ) {

	function SpriteFadeEffect ( effectData, spriteData, sprite ) {
		var _this = this;
		var _fadePointSet;
		var _sprite;
		var _spriteList = [];

		var _construct = function ( effectData, spriteData, sprite ) {

			console.log("starting sprite fade effect on: " + spriteData);

			_fadePointSet = effectData.fade_points;

			var intialTexture = PIXI.Texture.fromImage(_fadePointSet[0].image);

			_sprite = sprite.getSprite();

			_spriteList.push(_sprite);

			for(var i = 1; i < _fadePointSet.length; i++) {
				var childSprite = new PIXI.Sprite (PIXI.Texture.fromImage(_fadePointSet[i].image));
				_sprite.addChild(childSprite);
				childSprite.alpha = 0;
				childSprite.x = _fadePointSet[i].x;
				childSprite.y = _fadePointSet[i].y;
				_spriteList.push(childSprite);
			}

			_sprite.setTexture(intialTexture);

		}

		_this.resize = function ( sprite, width, height ) {
		}

		_this.update = function ( sprite, timeElapsed, delta ) {
			var normalizedScrollPosition = Math.abs ( ss.ScrollManager.targetPosition () / ss.SiteManager.windowHeight () );

			var lastScrollInfo = _fadePointSet [ 0 ];
			var lastI = 0;
			for ( var i = 1; i < _fadePointSet.length; i++ ) {

				_spriteList [ i ].alpha = 0;

				if ( normalizedScrollPosition < _fadePointSet [ i ].scroll ) {
				break;
				}
				lastI = i;
				lastScrollInfo = _fadePointSet [ i ];
			}

			i = Math.min (i, _fadePointSet.length - 1);

			var range = _fadePointSet [ i ].scroll - lastScrollInfo.scroll;
			var positionInRange = normalizedScrollPosition - lastScrollInfo.scroll;
			var interpolateVal = positionInRange / range;

			if(lastI == i) {
				_spriteList[i].alpha = 1;
			}
			else {
				if(lastI > 0) {
					_spriteList[lastI].alpha = 1 - interpolateVal;
				}
				_spriteList[i].alpha = interpolateVal;
			}

		}

		return _construct ( effectData, spriteData, sprite );
	}

	ns.SpriteFadeEffect = SpriteFadeEffect;

} ( ss ) );