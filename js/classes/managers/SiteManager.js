require.include ( "globals" );
require.include ( "core" );
require.include ( "classes/managers/ScrollManager" );

require.include ( "ui" );
require.include ( "weblib/command/CommandPackage" );
require.include ( "managers" );


		// inherit from 
	SiteManager.prototype = new AbstractObject ();
	SiteManager.constructor = SiteManager;


	function SiteManager () {
		
			// you guys should know what's up with this
		var _super = {};
		var _this = AbstractObject.call ( this );

		var _sceneManager;

		var _canvas;
		var _stage;
		var _renderer;

		var _data;
		var _templates;

		var _LastUpdateTimestamp;

		var _windowWidth;
		var _windowHeight;

		var _quickMenu;

		var _globalObjects;

		var _displacementFilter;

		var _initialSceneLoadedCount;
		var _elementsLoaded;

		var _supremeTextureManager;

		var _sceneManagerSet;

		var _sceneCount;

		var _construct = function () {

			_sceneManagerSet = [];

			_initialSceneLoadedCount = 0;
			_initialSceneLoaded = false;
			_elementsLoaded = 0;

			_globalObjects = {};
			_windowWidth = $ ( window ).width ();
			_windowHeight = $ ( window ).height ();

				// create an new instance of a pixi stage
			_stage = new PIXI.Stage ( 0x45cac9 );
			_stage.setInteractive = true;
			
				// create a renderer instance
			_renderer = PIXI.autoDetectRenderer ( _windowWidth, _windowHeight );
			_canvas = _renderer.view;

			_supremeTextureManager = { "on" : function () {}, "loadTexture" : function () {} }; //new ss.SupremeTextureManager ();
			_supremeTextureManager.on ( "COMPLETE", function () {
				var sprite = _supremeTextureManager.getSprite ( "debug" );
				_stage.addChild ( sprite );
			} );
			


			$(_canvas).attr("id", "backgroundCanvas");

				// add the renderer view element to the DOM
			$("body").prepend( _canvas );

			return _this;
		}

		var _onSiteReadyListener = function ( e ) {

			for ( var i = 0; i < _sceneManagerSet.length; i++ ) {
				var sceneManager = _sceneManagerSet [ i ];
				sceneManager.off ( SITE_READY, _onSiteReadyListener );
				TweenMax.to ( sceneManager, 1, { "alpha" : 1 } );
			}


			$ ( "#backgroundCanvas" ).css ( "display", "block" );



			$ ( window ).resize ();

			_supremeTextureManager.loadTexture (
			{ 
				"color" :  {
					"src" : SKY_TEXTURE 
				},
				"alpha" : {
					"src" : "img/scenes/global/testalpha.jpg" 
				}
			} );

			_this.dispatchEvent ( SITE_READY );
		}

		_this.globalObject = function (name, value) {
			if (isEmpty(value)) {
				console.log("we GETTIN: " + name);
				console.dir(_globalObjects);
				return _globalObjects[name];
			} else {
				//console.log("WE SETTING: ", name, " to: ", value);
				_globalObjects[name] = value;
			}
		}

		_this.windowWidth = function () {
			return _windowWidth;
		}

		_this.windowHeight = function () {
			return _windowHeight;
		}

		_this.load = function ( url ) {
			
			$.getJSON ( 'json/stages.json', function(data) {
				//console.log('AWARDS JSON GET STARTED');
				_data = data;
			})
			.success( function() {
				console.log('STAGES GRABBED');
			})
			.error( function(jqXHR, textStatus, errorThrown) {
				console.log('getJSON error: ', textStatus);
				console.log('getJSON errorThrown: ', errorThrown);
				console.log('arguments: ', arguments);
				console.log("getJSON incoming Text " + jqXHR.responseText);
			})
			.complete( function() {
				console.log('STAGES JSON GET COMPLETE');
				// console.log(sinkingship.scenes);

					// set the maximum scroll distance
				ss.ScrollManager.maxScroll ( ( _sceneCount - 1 ) * $ ( window ).height () );

				_sceneCount = _data.site [ 0 ].scenes.length;

				for ( var i = 0; i < _data.site.length; i++ ) {
					var sceneManager = new ss.SceneManager ( _data.site [ i ].scenes, _data.site [ i ].background );
					sceneManager.y = 0;
					sceneManager.on ( SITE_READY, _onSiteReadyListener );
					_stage.addChild ( sceneManager );

					_sceneManagerSet.push ( sceneManager );
				}
				

				_ready ();


				_this.dispatchEvent ( new BaseEvent ( "READY" ) );
			});

				// set up input
			_initListeners ();
		}

		var _ready = function () {
			_LastUpdateTimestamp = Date.now ();

			_quickMenu = new ss.QuickMenu ( _data.site [ 0 ].scenes );
			_quickMenu.x = 15;
			_quickMenu.y = _windowHeight * 0.5;
			_stage.addChild ( _quickMenu );

			/* var commandSet = new CommandSet ();
			commandSet.lock ( 250 );
			commandSet.tweenTo ( _sceneManager, 1, { "alpha" : 1 } );
			commandSet.queue (); */
		}

		var _initListeners = function () {
			
		}

		_this.update = function () {

			var currentTime = Date.now ();
			var elapsedTime = currentTime - _LastUpdateTimestamp;
			var delta = elapsedTime / 1000.0; 

			for ( var i = 0; i < _sceneManagerSet.length; i++ ) {
				var sceneManager = _sceneManagerSet [ i ];
				sceneManager.y = ss.ScrollManager.targetPosition (); 
				sceneManager.update ( elapsedTime, delta );
			}
			$("#contentContainer").css("transform", 'translate(0px, ' + 2 * ss.ScrollManager.targetPosition() + 'px) translateZ(0px)');
			//$("#contentContainer").css("top", Math.round(ss.ScrollManager.targetPosition () * 2.0 ));

			_quickMenu && _quickMenu.update ();

			_renderer.render ( _stage );

			//_displacementFilter.offset.x += 0.1;
			//_displacementFilter.offset.y += 0.1;

			_LastUpdateTimestamp = currentTime;
		}

		_this.resize = function ( width, height ) {

			_windowWidth = $ ( window ).width ();
			_windowHeight = $ ( window ).height ();

				// set the maximum scroll distance;
			ss.ScrollManager.maxScroll ( ( _sceneCount - 1 ) * _windowHeight ); // ( _sceneCount - 1 ) * $ ( window ).height ()

			_canvas.width = width;
			_canvas.height = height;
			_renderer.resize ( width, height );

			for ( var i = 0; i < _sceneManagerSet.length; i++ ) {
				var sceneManager = _sceneManagerSet [ i ];
				sceneManager.resize ( width, height );
			}


				// resize the quick menu
			if ( !isEmpty ( _quickMenu ) ) {
				_quickMenu.y = _windowHeight * 0.5;
			}
			
		}

		_this.blur = function() {
			for ( var i = 0; i < _sceneManagerSet.length; i++ ) {
				var sceneManager = _sceneManagerSet [ i ];
				sceneManager.blur ( );
			}
		}

		_this.focus = function () {
			for ( var i = 0; i < _sceneManagerSet.length; i++ ) {
				var sceneManager = _sceneManagerSet [ i ];
				sceneManager.focus ( );
			}
		}
		_this.setPage = function ( index ) {
			ss.ScrollManager.setPage ( index );
		}
		
		_this.initialSceneReady = function () {

			

			if ( ++_initialSceneLoadedCount < 3 || _initialSceneLoaded == true ) {
				return;
			}

			
				// mark as true
			_initialSceneLoaded = true;

			
			$ ( window ).resize ();

			$ ( document ).trigger ( "LOAD_PAGE_CONTENT" );

			console.log ( "initialScene READY" );
		}

		_this.registerTextureLoad = function () {

			var numloaded = Math.min ( ++_elementsLoaded, 18 );
			var percentLoaded = Math.round ( numloaded / 18 * 100 );

			$ ( ".pageLoad" ).text ( percentLoaded );
		};

		return _construct ();
	}

