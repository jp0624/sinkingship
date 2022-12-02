( function ( ns ) {
	
	function SwapSpriteEffect ( effectData, spriteData, sprite ) {

		var _this = this;
		var _parent;
		var _indexNum;
		var _swapList;
		var _currentSwapIndex;
		var _swapObjects;


		var _construct = function ( effectData, spriteData, sprite ) {
			_swapObjects = [];
			_currentSwapIndex = 0;

			_parent = sprite.parent;
			_indexNum = _parent.getChildIndex ( sprite );
			_swapList = effectData.swapList;

			_swapObjects.push ({"sprite": sprite.getSprite(), "parent": _parent, "child_index": _indexNum, "offset": 0});

			for(var i = 0; i < _swapList.length ; i++) {
				console.log(_swapList[i].object);
				var obj = ss.SiteManager.globalObject(_swapList[i].object);
				var offset = _swapList[i].offset;
				var otherSprite = obj;
				var childIndex = otherSprite.parent.getChildIndex(otherSprite);
				_swapObjects.push ({"sprite": otherSprite, "parent": otherSprite.parent, "child_index": childIndex, "offset": offset});
			}
			return _this;
		}

		var _swap = function (index_1, index_2, sprite) {
			console.log("WE SWAPPPPINNN!!");

			//console.log(globalPosition);
			// console.dir(_swapObjects[index_2].parent);
			_swapObjects[index_2].parent.addChildAt(sprite, _swapObjects[index_2].child_index);
		}

		_this.update = function ( sprite, timeElapsed, delta ) {

			var normalizedScrollPosition = Math.abs ( ss.ScrollManager.targetPosition () / ss.SiteManager.windowHeight () );

			var lastScrollInfo = _swapList [ 0 ];
			for ( var i = 0; i < _swapList.length; i++ ) {

				if ( normalizedScrollPosition < _swapList [ i ].scroll ) {
					break;
				}
				lastScrollInfo = _swapList [ i ];
			}
		//	console.log("i", i);
			if (i != _currentSwapIndex) {
			//	console.log(i);
				_swap(_currentSwapIndex, i, sprite);
				_currentSwapIndex = i;
			}
		}

		_this.resize = function ( width, height ) {

		}

		return _construct ( effectData, spriteData, sprite );
	}

	ns.SwapSpriteEffect = SwapSpriteEffect;

} ( ss ) );