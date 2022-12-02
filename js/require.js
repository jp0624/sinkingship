var ss = {}; 

( function () { 
	/*******************************
	*
	********************************/

	/***************************** Static Functions ******************************/

	function isUndefined ( value ) {
		"use strict";
		return ( typeof ( value ) === String ( undefined ) );
	}

	function isEmpty ( value ) {
		"use strict"; 
		return ( typeof ( value ) === String ( undefined ) || value === null );
	}

	function setDefault ( value, defaultVal ) {
		"use strict";
		return ( isUndefined ( value ) ) ? defaultVal : value;
	}

	function isNumber ( value ) {
		return !isNaN ( parseFloat ( value ) ) && isFinite ( value );
	}

	function findBaseName ( url ) {
	    var fileName = url.substring ( url.lastIndexOf ( '/' ) + 1 );
	    var dot = fileName.lastIndexOf ( '.' );
	    return dot == -1 ? fileName : fileName.substring ( 0, dot );
	}


	function BaseEvent ( type, data ) {
		"use strict";

			// private functions
		var _this = this;
		var _type;
		
		function _construct ( type, data ) {
			_type = type;
			
			_this.data = data;
		}

		_this.toString = function () {
			return _type;
		}
		
		return _construct ( type, data );
	} 

	function AbstractEventDispatcher ( reference ) {
		"use strict";

		var _this = reference || this;
		var _listenerMap;

		function _construct () {
			_listenerMap = {};

			return _this;
		}

		_this.indexOfListener = function ( listener, context, listenerSet ) {
			
			for ( var i = 0; i < listenerSet.length; i++ ) {
				if ( listener === listenerSet [ i ].listener && context === listenerSet [ i ].context ) {
					return i;
				}
			}


			return -1;
		}

		_this.addEventListener = function ( event, listener, context ) {
			
			if ( !_this.hasEventListener ( event.toUpperCase (), listener, context ) ) {
	            try {
	                var listenerSet = _listenerMap [ event.toUpperCase () ];
	                listenerSet.push ( { listener : listener, context : context } );
	            } catch ( error ) {
	                _listenerMap [ event.toUpperCase () ] = [ { listener : listener, context : context } ];
	            }
			}
		}

		_this.removeEventListener = function ( event, listener, context ) {
			var listenerSet = _listenerMap [ event.toUpperCase () ];
			if ( listenerSet ) {
				var indexOf = _this.indexOfListener ( listener, context, listenerSet );
				if ( indexOf > -1 ) {
					listenerSet.splice ( indexOf, 1 );
				}
			}
		}

		_this.hasEventListener = function ( event, listener, context ) {

				// check if the
			var listenerSet = _listenerMap [ event.toUpperCase () ];
			if ( !isEmpty ( listenerSet ) ) {

				if ( _this.indexOfListener ( listener, context, listenerSet ) > -1 ) {
					return true;
				}
			}

			return false;
		}

		_this.dispatchEvent = function ( event, data ) {
			var listenerSet = _listenerMap [ String ( event ).toUpperCase () ];

			if ( listenerSet ) {
				for ( var i = 0; i < listenerSet.length; i++ ) {
				
						// maintains backwards compadiblity
					if ( typeof ( event ) == "string" ) {
	                	listenerSet [ i ].listener.apply ( listenerSet [ i ].context, [ _this, data ] );
	                } else {
	                		// assign the target and pass the event through instead
	                	if ( event.target instanceof Array ) {
	                		event.target.push ( _this );
	                	} else {
	                		event.target = [ _this ];
	                	} 
	                	listenerSet [ i ].listener.apply ( listenerSet [ i ].context, [ event ] );
	                }
	                
				}
			}
		}
		
		_this.release = function () {
			for ( var property in _listenerMap )
				delete _listenerMap [ property ];
					
		}

	    return _construct ( reference );
	}

	function Iterator ( array, index ) { // jshint ignore:line
	    "use strict";

	    var _this = this;
	    var _index;
	    var _array;


	    function _construct ( array, index ) {

	        _array = array;
	        _index = ( isEmpty ( index ) ) ? -1 : index;

	        return _this;
	    }


	        /*
	        * private members
	        */
	    function shuffleOrder () {
	        return ( Math.round ( Math.random () ) - 0.5 );
	    }
	        /*
	        * public members
	        */
	    _this.shuffle = function () {
	        _array = _array.sort ( shuffleOrder );
	    };

	    _this.reverse = function () {
	        _array = _array.reverse ();
	        if ( _index > 0 ) {
	            _index = ( _array.length - 1 ) - _index;
	        }
	    };

	    _this.reset = function () {
	        _index = -1;
	    };

	    _this.clone = function () {
	        return new Iterator ( _array.slice ( 0 ) ) ;
	    };

	    this.hasNext = function () {
	        return ( ( _index + 1 ) < _array.length );
	    };

	    this.next = function () {
	        return _array [ ++_index ];
	    };

	    this.peek = function ( offset ) {
	        return _array [ Math.max ( 0, Math.min ( _index + offset, ( _array.length - 1 ) ) ) ];
	    };

	    this.hasPrevious = function () {
	        return ( _index > 0 );
	    };

	    this.previous = function () {
	        return _array [ --_index ];
	    };

	    this.toArray = function () {
	        return _array.slice ( 0 );
	    };

	    return _construct ( array, index );
	}

	function TreeNode ( children, data ) {

		var _this = AbstractEventDispatcher ( this );
		
		var _parent;
		var _data;
		var _children;


		function _construct ( children, data ) {
			_data = data;
			_children = isEmpty ( children ) ? [] : children;

			_this.childrenShow = _children;

			return _this;
		}

	    _this.parent = function ( val ) {
	        return ( isEmpty ( val ) ) ? _parent : _parent = val;
	    };

	    _this.children = function ( array ) {
	    	if ( array != true ) {
	    		return new Iterator ( _children );
	    	}
	        return _children.slice ();
	    };
	    
	    _this.siblings = function () {
	        return TreeNode.getSiblings ( _this );
	    };
	    
	    _this.isRoot = function () {
	        return isUndefined ( _parent );
	    };
	    
	    _this.hasChildren = function () {
	        return ( _children.length > 0 );
	    };
	    
	    _this.hasSiblings = function () {
	        if ( _parent ) {
				return _parent.numChildren () > 1;
	        }
				
			return false;
	    };
	    
	    _this.numChildren = function () {
	        return _children.length;
	    };
	    
	    _this.numSiblings = function () {
	        if ( _parent ) {
				return _parent.numChildren ();
			}
			return 0;
	    };
	    
	    _this.depth = function () {
	        var depthCount = 0;
			for ( var i = 0; i < _children.length; i++ ) {
	            var node = _children [ i ];
				depthCount += ( node == "TreeNode" ) ? node.depth () : 1;
			}

			return depthCount;
	    };
	    
		_this.contains = function ( obj ) {
			for ( var i = 0; i < _children; i++ ) {
	            var node = _children [ i ];
				if ( node == "TreeNode" ) {
					if ( node.contains ( obj ) ) {
						return true;
					}
				} else if ( node == obj ) {
					return true;
				}
			}

			return false;
		}

	    _this.clear = function () {
	        while ( _children.length ) {
	            var item = _children.shift ();

	            if ( item == "TreeNode" ) {
	                item.clear ();
	            }
	        }
	    }

	    _this.addChildren = function ( itemSet ) {
	        _children = _children.concat ( itemSet );
	    }

	    _this.addChild = function ( child ) {

	        child.parent ( _this );

	            // add to the list
	        _children.push ( child );
	    }

	    _this.removeChild = function ( item ) {

	        for ( var i = 0; i < _children.length (); i++ ) {
	            if ( item == _children [ i ] ) {
	                _children.splice ( i, 1 );
	                return;
	            }
	        }

	        throw item + " does not exist as an child";
	    }

	    _this.toString = function () {
	        return "TreeNode";
	    }

	    return _construct ( children, data );
	}
		
	/* TreeNode.setParent = function ( parent, child ) {
		
		child.parent  = parent;
	} */

	TreeNode.getSiblings = function ( treeNode ) {

		var parent = treeNode.parent ();

		if ( parent == null ) {
			return new Iterator ( [] );
		}

			// grab children and remove the current treenode
		var siblingSet = parent.children ( true );
		siblingSet = siblingSet.splice ( siblingSet.indexOf ( treeNode ), 1 );

		return new Iterator ( siblingSet );
	}

	    // internal function definitions 
	function CachedTraversal ( parentNode ) {
		this.parentNode = parentNode;
		this.iIterator = parentNode.children ();
	}

	function TreeNodeIterator ( treeNode, offsetId ) {

		var _this = this;
		var _cachedTraversalSet; // : Array;

		var _rootNode;
		var _preventRecursion;
		var _recursionPreventionSet;


		function _construct ( treeNode, offsetId ) {

			_recursionPreventionSet = [];
			
			_rootNode = treeNode;

					// reset the whole tree
			_this.reset ( _this );
		}

	        // private functions
		
		function _parentNode ( ) {
			return _cachedTraversalSet [ ( _cachedTraversalSet.length - 1 ) ].parentNode;
		}

		function _iIterator ( ) {
			return _cachedTraversalSet [ ( _cachedTraversalSet.length - 1 ) ].iIterator;
		}

		function _getAllIndexes ( arr, val ) {
		    var indexes = [], i = -1;
		    while ((i = arr.indexOf(val, i+1)) != -1){
		        indexes.push(i);
		    }
		    return indexes;
		}

			// public functions
		_this.reset = function ( treeNodeIterator ) {
		
			_recursionPreventionSet = [];

			var cachedTraversal = new CachedTraversal ( _rootNode ) ;
			_cachedTraversalSet = [ cachedTraversal ] ;
		}
		
		_this.canTraverse = function () {
			for ( var i = 0; i < _cachedTraversalSet.length; i++ ) {
				var cachedTraversal = _cachedTraversalSet [ i ];
				if ( cachedTraversal.iIterator.hasNext ( ) ) {
					return true;
				}
			}

				// found nothing can traverse
			return false;
		}
		
		_this.traverse = function () {

			var treeNode; // : TreeNode;
			var iIterator; // : IIterator;

			if ( _iIterator ().hasNext () ) {
				treeNode = _iIterator ().next ();

	        	if ( treeNode.hasChildren () && _getAllIndexes ( _recursionPreventionSet, treeNode ).length < 2 ) { // _recursionPreventionSet.indexOf ( treeNode ) == -1 ) {
					var cachedTraversal = new CachedTraversal ( treeNode ) ;
					_cachedTraversalSet.push ( cachedTraversal ) ;
					_recursionPreventionSet.push ( treeNode );
				}
			} else {

				while ( _cachedTraversalSet.length && !_iIterator ().hasNext () ) {
					_cachedTraversalSet.pop () ;
				}

				treeNode = _iIterator ().next () ;
			}

			return treeNode;
		}

	    _this.find = function ( property , value ) {
	        var treeNodeIterator = new TreeNodeIterator ( _rootNode ) ;

	        while ( treeNodeIterator.canTraverse () ) {

	            var treeNode = treeNodeIterator.traverse () ;

	            if ( treeNode.data [ property ] == value ) {
	                return treeNode;
	            }
	        }

	        return null;
	    }

	    this.traverseAll = function () {

	    	_recursionPreventionSet = [];
	        var traversalSet = [];

	        while ( _this.canTraverse () ) {
	            traversalSet.push ( _this.traverse () );
	        }

	        return new Iterator ( traversalSet );
	    }

	    return _construct ( treeNode, offsetId );
	}

	function TreeNodeParser () {

	    var _instance = AbstractEventDispatcher ( this );
	    var _rootNode;
	    
	    function _recurseChildrenJSON ( json ) {
			return new TreeNode ( _extractChildrenJSON ( json ), _extractRawDataJSON ( json ) );
		}

	    function _extractRawDataJSON ( json ) {

			var cloneObject = {};

			for ( var property in json )
				if ( String ( property ).toLowerCase () != "children" )
					cloneObject [ property ] = json [ property ];


			return cloneObject;
		}

		function _extractChildrenJSON ( json ) {

			var resultSet = [];

	        if ( typeof ( json.children ) !== String ( undefined ) )
	            for ( var i = 0; i < json.children.length; i++ ) {
	                var item = json.children [ i ];
	                var childNode = _recurseChildrenJSON ( item );
	                resultSet.push ( childNode );
	            }

			return resultSet;
		}
		
		function _recurseChildrenXML ( $xml ) {
			return new TreeNode ( _extractChildrenXML ( $xml ), _extractRawDataXML ( $xml ) );
		} 
		
		function _extractChildrenXML ( $xml ) {
			return [];
		}
		
		function _extractRawDataXML ( $xml ) {
			
			var aggregateData = {};
			
				// check if the node has children
			if ( $xml.children ( ":not(children)" ).length ) {
				
				var rawData = {};
				
				$ ( $xml.children ( ":not(children)" ) ).each ( function ( index, value ) {
					
						// save the node name for ease
					var nodeName = $ ( this ).get ( 0 ).nodeName;
					
						// if an entry exist make it an array otherwise assign
					if ( isUndefined ( rawData [ nodeName ] ) ) {
						rawData [ nodeName ] = _extractRawDataXML ( $ ( this ) );
					} else {
						try {
								// assign another reference
							rawData [ nodeName ].push ( _extractRawDataXML ( $ ( this ) ) );
						} catch ( e ) {
								// concatenate the values
							rawData [ nodeName ] = [ rawData [ nodeName ], _extractRawDataXML ( $ ( this ) ) ];
						}
					}
					
				} );
				
				return rawData;
			}
			
				// just a text node return the value
			return $xml.text ();
		}

	    _instance.parseJSON = function ( jsonParsed ) {
				// recurse through the object and build the tree structure
			_rootNode = _recurseChildrenJSON ( jsonParsed );
	        return _rootNode;
		}
		
		_instance.parseXML = function ( $xml ) {
				// recurse through the object and build the tree structure
			console.log ( $xml );
			
			_rootNode = _recurseChildrenXML ( $xml );
			
			console.log ( _rootNode );
			
	        return _rootNode;
		}
		
	    return _instance;
	}


		/*******************************
		*
		********************************/
	FileInclude.prototype = new TreeNode ();
	FileInclude.prototype.constructor = FileInclude;

	function FileInclude ( script ) {

		var _super = {};
		var _this = TreeNode.call ( this );
		var _request,
		_script,
		_response,
		_dependencies,
		_loading;

		function _construct ( script ) {
			
			_loading = false;
			_script = script;
			_dependencies = [];
			_request = new XMLHttpRequest ();
			_request.onreadystatechange = function () {

					// double check it's loaded
				if ( _request.readyState == 4 && _request.status === 200 ) {
					_onreadystatechange ();
				}
			};

			_this.scriptShow = script;

			return _this;
		}

		function _onreadystatechange () {

				// set the new response text
			_response = _request.responseText;

				// clear the reference
			_this.dispatchEvent ( new BaseEvent ( "COMPLETE" ) );
		}

		/*_this.dependencies = function () {
			return _dependencies.slice ();
		} */

		_this.response = function () {
			return _response;
		}

		_this.script = function () {
			return _script;
		}

		_this.isLoaded = function ( url ) {
			return !isEmpty ( _response );
		}

		_this.load = function () {

				// check if we already loading
			if ( !_loading ) {
				_request.open ( "GET", _script, true );
				_request.send ( null );

				_loading = true;
			}
			
		}

		/* _this.addDependency = function ( val ) {

				// check if we already added this dependency
			var baseName = findBaseName ( val );
			if ( _dependencies.indexOf ( baseName ) == -1 ) {
				_dependencies.push ( baseName );
			}
		} */

		_this.isDependent = function ( fileInclude ) {

			var treeNodeIterator = new TreeNodeIterator ( _this );
			var iterator = treeNodeIterator.traverseAll ();

			if ( iterator.toArray ().indexOf ( fileInclude ) > -1 ) {
				return true;
			}

			return false;
		}

		_this.release = function () {

			_super.release ();

			_script = undefined;
			_request = undefined;

			for ( var property in _this ) {
				delete _this [ property ];
			}
			_this = undefined;

			for ( var property in _super ) {
				delete _super [ property ];
			}
			_super = undefined;
			
		}

		return _construct ( script );
	}

	function AbstractPlugin () {

		var _super = {};
		var _this = AbstractEventDispatcher.call ( this );

		function _construct () {
			return _this;
		}

		_this.loadScript = function ( script ) {
			return script;
		}

		_this.fileLoaded = function ( fileInclude ) {

		}

		_this.filterResponse = function ( repsonse ) {
			return repsonse;
		}

		_this.filterLine = function ( line ) {
			return line;
		}

		_this.toString = function () {
			return "REQUIRE-PLUG-IN";
		}

		return _construct ();
	}

	var require = require || new function () {
		"use strict";

		var _this = this,
		_config,
		_pluginSet,
		_readyCallbackSet,
		_fileInclusionTree,
		_fileIncludeSet,
		_fileRequireSet,
		_ready;



			/*******************************
			*
			********************************/
		function _construct () {

			_ready = false;
			_pluginSet = [];
			_fileInclusionTree = new TreeNode ();
			_fileIncludeSet = [];
			_readyCallbackSet = [];
			_fileRequireSet = [];
			_config = { "baseUrl" : "js/", "paths" : {}, "alias" : {}, "debug" : false };

				// as a courtesy let's load the file included in the data-main
			var requireScript = document.querySelector ( "script#require_script" ); 

				// load plug-ins or directly include the entry point
			var plugins = requireScript.getAttribute ( "data-plugins" );
			if ( !isEmpty ( plugins ) ) {
				_loadPlugins ( plugins.split ( "\s*,\s*" ) );
			} else {
				_this.include ( requireScript.getAttribute ( "data-main" ) );
			}
		}

		function _loadPlugins ( pluginSet ) {

				// load the AbstractPlugin
			_this.plugins = { "AbstractPlugin" : AbstractPlugin };

			var baseUrl = _getBase ();

			for ( var i = 0; i < pluginSet.length; i++ ) {
				var fileInclude = new FileInclude ( baseUrl + pluginSet [ i ] );
				fileInclude.addEventListener ( "COMPLETE", _onPluginLoad_listener );
				_pluginSet.push ( fileInclude );
				fileInclude.load ();
			}
		}

		function _loadRequiredFiles ( requiredFiles ) {

			var baseUrl = _getBase ();

			for ( var i = 0; i < requiredFiles.length; i++ ) {
				var fileInclude = new FileInclude ( baseUrl + requiredFiles [ i ] );
				_fileRequireSet.push ( fileInclude );
				fileInclude.load ();
			}
		}

		function _getAliases ( scriptName ) {
		
				// get the current alias associated with the scriptName
			var alias = _config.alias [ scriptName ];

				// there's no alias so send back the script's url
			if ( scriptName instanceof Array ) {

				alias = scriptName;
			} else if ( isEmpty ( alias ) ) {
				alias = [ scriptName ];
			} else if ( typeof ( alias ) == "string" ) {
				alias = [ alias ];
			}

			return alias;
		}

			/*******************************
			*
			********************************/
		function _getBase () {
			var baseUrl = _config.baseUrl;
			return ( baseUrl.substr ( -1 ) == "/" || baseUrl == "" ) ? baseUrl : baseUrl + "/"; 
		}

			/*******************************
			*
			********************************/
		function _getScripts ( scriptName ) {

				// extract an alias if one is available
			var scriptSet = _getAliases ( scriptName );

				// let get magical. If a array is passed in we import the array
			for ( var i = 0; i < scriptSet.length; i++ ) { 
				scriptSet [ i ] = ( scriptSet [ i ].match ( /(.+?\/)*.+?\.js/ ) ) ? scriptSet [ i ] : scriptSet [ i ] + ".js";
			}

			return scriptSet;
		}


		function _importDependencies ( fileInclude ) {
				// find any import and import those files
			var preprocessRegExp = /(require.config|require.include)\s*\(([\S\s]+?)\)\s*\;?/gi;
			var result;

			// console.log ( fileInclude.response () );

			while ( !isEmpty ( result = preprocessRegExp.exec ( fileInclude.response () ) ) ) {

					// sweet! Let add to the dependency list
				if ( result [ 1 ] == "require.include" ) {
					var script = eval ( result [ 2 ] );

					if ( script instanceof Array ) {
						for ( var i = 0; i < script.length; i++ ) {
							_include ( script [ i ], fileInclude );
						}
					} else {
						_include ( script, fileInclude );
					}
				} else {
					eval ( result [ 0 ] );
				}
				
				
			}
		}

		function _processIncludedFile_listener ( event ) {

			var fileInclude = event.target [ 0 ];
			var baseScriptName = findBaseName ( fileInclude.script () );

				// filter the response. Here's where we can add in the plug-in architecture
			var response = _filterResponse ( fileInclude.response () );

				// import the next set of items
			_importDependencies ( fileInclude );

				// have we loaded all the included dependencies
			for ( var i = 0; i < _fileRequireSet.length; i++ ) {
				if ( !_fileRequireSet [ i ].isLoaded () ) {
					return;
				}
			}

				// have we loaded all the dependencies
			for ( var i = 0; i < _fileIncludeSet.length; i++ ) {
				if ( !_fileIncludeSet [ i ].isLoaded () ) {
					return;
				}
			}

				// we did all done
			_loadComplete ();
		}

		function _onPluginLoad_listener ( event ) {

				// replace the current FileInclude with a instance
			var fileInclude = event.target [ 0 ];
			var indexOf = _pluginSet.indexOf ( fileInclude );
			_pluginSet [ indexOf ] = new ( eval ( fileInclude.response () ) ( AbstractPlugin ) );

				// check if all the plug-ins are loaded
			for ( var i = 0; i < _pluginSet.length; i++ ) {
				if ( String ( _pluginSet [ i ] ) !== "REQUIRE-PLUG-IN" ) {
					return;
				}
			}

				// all plug-ins are loaded, let's now load the entry point
			var requireScript = document.querySelector ( "script#require_script" ); 
			_this.include ( requireScript.getAttribute ( "data-main" ) );
		}

		function _filterResponse ( response ) {

			if ( _pluginSet.length ) {
				// first filter line by line
			
				var lines = response.split ( '\n' );
				var output = ""; 

				for ( var i = 0; i < lines.length; i++ ) {
	    			for ( var j = 0; j < _pluginSet.length; j++ ) {
	    				output += _pluginSet [ j ].filterLine ( lines [ i ] );
	    			}
				}

				for ( var j = 0; j < _pluginSet.length; j++ ) {
	    			output = _pluginSet [ j ].filterResponse ( output );
	    		}

	    		return output;
    		} 

			return response;
		}

		function _loadComplete () {


			_this.include = function () {};
			_this.config = function () {};

			var treeNodeIterator = new TreeNodeIterator ( _fileInclusionTree );
			var iterator = treeNodeIterator.traverseAll (); 

			var sortSet = [];
			for ( var i = 0; i < _fileIncludeSet.length; i++ ) {
				
				var fileInclude = _fileIncludeSet [ i ];

					// loop thorugh and insert before we find any dependency
				var includeAdded = false;
				for ( var j = 0; j < sortSet.length; j++ ) {

					// console.log ( sortSet [ j ].script () + " dependent on : " + fileInclude.script () + " " + sortSet [ j ].isDependent ( fileInclude ) );
					if ( sortSet [ j ].isDependent ( fileInclude ) ) {
						sortSet.splice ( Math.max ( 0, j-1 ), 0, fileInclude );
						includeAdded = true;
						break;
					}
				}

					// no dependency found
				if ( !includeAdded ) {
					sortSet.push ( fileInclude );
				}
			}

			_fileIncludeSet = sortSet;

			 	// compile the code;
			var output = "";
			if ( _config.debug ) {
				for ( var i = 0; i < _fileRequireSet.length; i++ ) {
					_addDebugScript ( _fileRequireSet [ i ] );
				}
				for ( var i = 0; i < _fileIncludeSet.length; i++ ) {
					_addDebugScript ( _fileIncludeSet [ i ] );
				}
			} else {
				var script = document.createElement( 'script' );
				script.setAttribute ( "id", "require_compiled" ); 
				output = ''; // (function(e,t){function s(){if(!r){r=true;for(var e=0;e<n.length;e++){n[e].fn.call(window,n[e].ctx)}n=[]}}function o(){if(document.readyState==="complete"){s()}}e=e||"docReady";t=t||window;var n=[];var r=false;var i=false;t[e]=function(e,t){if(r){setTimeout(function(){e(t)},1);return}else{n.push({fn:e,ctx:t})}if(document.readyState==="complete"){setTimeout(s,1)}else if(!i){if(document.addEventListener){document.addEventListener("DOMContentLoaded",s,false);window.addEventListener("load",s,false)}else{document.attachEvent("onreadystatechange",o);window.attachEvent("onload",s)}i=true}}})("docReady",window);var require={include:function(){},config:function(){},ready:function(e){docReady(e)}}; ';
				for ( var i = 0; i < _fileRequireSet.length; i++ ) {
					output += _filterResponse ( _fileRequireSet [ i ].response () ) + "\n";
				}

				for ( var i = 0; i < _fileIncludeSet.length; i++ ) {
					output += _filterResponse ( _fileIncludeSet [ i ].response () ) + "\n";
				}

				script.innerHTML = output;
				document.querySelector ( "head" ).appendChild ( script );

					// finally start the entry point
				_codeReady (); 
			}
		}

		function _addDebugScript ( fileInclude ) {
			var script = document.createElement ( 'script' );
			script.classList.add ( "require-script" );
			script.type = "text/javascript";
			script.setAttribute ( "onload", "require.scriptLoaded ( this )" )
			script.src = fileInclude.script ();
			document.querySelector ( "head" ).appendChild ( script );
		}

		function _codeReady () {
				// first set that we are ready
			_ready = true;

				// execute the ready functions
			while ( _readyCallbackSet.length ) {
				console.log ( "ready callback called" );
				var callback = _readyCallbackSet.pop ();
				callback.call ();
			}
		}

		function _getFileInclude ( scriptURL, parent ) {

			for ( var i = 0; i < _fileIncludeSet.length; i++ ) {
				var fileInclude = _fileIncludeSet [ i ];
				if ( findBaseName ( fileInclude.script () ) == findBaseName ( scriptURL ) ) {
					parent.addChild ( fileInclude );
					return fileInclude;
				}
			}

				// now checked the required Set
			for ( var i = 0; i < _fileRequireSet.length; i++ ) {
				var fileInclude = _fileRequireSet [ i ];
				if ( findBaseName ( fileInclude.script () ) == findBaseName ( scriptURL ) ) {
					return fileInclude;
				}
			}

			var fileInclude = new FileInclude ( scriptURL );
			_fileIncludeSet.push ( fileInclude );
			parent.addChild ( fileInclude );

			return fileInclude;
		}
 

			/*******************************
			*
			********************************/
		
		function _include ( scriptName, parent ) {

			var baseUrl = _getBase ();
			var scriptURLSet = _getScripts ( scriptName );

				// loop through each script and load it
			for ( var i = 0; i < scriptURLSet.length; i++ ) {

					// check if we already have the file in the loading set
				var fileInclude = _getFileInclude ( baseUrl + scriptURLSet [ i ], parent );
				fileInclude.addEventListener ( "COMPLETE", _processIncludedFile_listener );
				fileInclude.load ();
			}
		};

		_this.include = function ( script ) {

				// point of entry. A bit abstract but it works. Sweep it under the rug... Just sweep! :P
			if ( script instanceof Array ) {
				for ( var i = 0; i < script.length; i++ ) {
					_include ( script [ i ], _fileInclusionTree );
				}
			} else {
				_include ( script, _fileInclusionTree );
			}
		}

		_this.config = function ( config ) {
	
				// just loop through and overwrite properties
			for ( var property in config ) {
				_config [ property ] = config [ property ];
			}

				// add the required set of fileIncludes
				// load required files
			if ( _config [ "include" ] instanceof Array ) {
				_loadRequiredFiles ( _config [ "include" ] )
			}
		}

		_this.ready = function ( callback ) {

			if ( _ready ) {
				callback.call ();
			} else {
				_readyCallbackSet.push ( callback );
			}
		}

		_this.scriptLoaded = function ( script ) {
			script.className += " loaded";
			script.removeAttribute ( "onload" );


			var requiredScriptSet = document.querySelectorAll ( ".require-script" );
			for ( var i = 0; i < requiredScriptSet.length; i++ ) {
				var requiredScript = requiredScriptSet [ i ];
				if ( requiredScript.className.indexOf ( " loaded" ) == -1 ) {
					return;
				}
			}

				// all done execute
			console.log ( "all scripts loaded and ready" );
			_codeReady ();
		}

		return _construct ();
	};


	window [ "require" ] = require;
} () );