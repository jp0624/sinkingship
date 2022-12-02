require.include ("classes/data_parsing/NewsDataManager");
require.include ("templates/NewsTemplate.js");


( function (ns) {

	NewsManager.prototype = new AbstractObject();
	NewsManager.constructor = NewsManager;

	/**
	 * Class to manage the news section of the site.
	 */
	function NewsManager () {

		// create a locally scoped copy of this.
		var _this = this;

		// The data manager which loads the news items themselves.
		var dataManager;

		/**
		 * Constructor for the news manager.
		 * @return {NewsManager} The news manager.
		 */
		var _construct = function () {

			dataManager = new ns.NewsDataManager();
			dataManager.addEventListener(ns.NewsDataManager.LOAD_COMPLETED_EVENT, _onNewsManagerReady);
			dataManager.load();

			return _this;
		}

		/**
		 * Fired when the news manager is ready.
		 * @return {[type]} [description]
		 */
		function _onNewsManagerReady ( ) {

			// show the default starting news items, index 0-7.
			_this.refreshNews(0, 7);
		}

		/**
		 * Refresh the news to display the objects from the given start index to end index.
		 * @param  {Number} start The start index.
		 * @param  {Number} end   The end index.
		 */
		_this.refreshNews = function (start, end ) {
			$(NEWS_CONTAINER).empty();

			var allNews = dataManager.getNewsItems(start,end);
			for(var i = 0; i < allNews.length; i++) {
				var rendered = Mustache.render(NEWS_TEMPLATE, allNews[i]);
				$(NEWS_CONTAINER).append(rendered);
			}
		}

		return _construct();
	}

	ns.NewsManager = ns.NewsManager || new NewsManager();

} ( ss ))


