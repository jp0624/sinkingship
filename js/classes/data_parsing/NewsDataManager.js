require.include ( "weblib/core/AbstractObject.js" );

( function (ns) {

	NewsDataManager.prototype = new AbstractObject();
	NewsDataManager.constructor = NewsDataManager;

	/**
	 * Event that fires when load is completed.
	 * @type {String}
	 */
	NewsDataManager.LOAD_COMPLETED_EVENT = "complete";

	/**
	 * Path to the news JSON file.
	 * @type {String}
	 */
	NewsDataManager.NEWS_DATA_PATH = "json/news.json";

	/**
	 * Data mapping for months
	 * @type {Array[{String}]}
	 */
	NewsDataManager.MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	/**
	 * Manager for news data.
	 */
	function NewsDataManager() {
		// keep a locally scoped copy of this.
		var _this = this;

		// whether or not the data has loaded.
		var _loaded;

		// the data itself.
		var _data;

		/**
		 * Constructor for the news Data Manager.
		 */
		var _construct = function () {
			_loaded = false;
		}

		/**
		 * Start loading the news.
		 * @return {[type]} [description]
		 */
		_this.load = function () {
			// go get the file.
			$.getJSON(NewsDataManager.NEWS_DATA_PATH, _getDataSuccess);
		}

		/**
		 * Fired on successfull load of the data.
		 * @param  {Object} data The data to load.
		 */
		function _getDataSuccess(data) {
			_data = data;
			_loaded = true;

			_this.dispatchEvent(NewsDataManager.LOAD_COMPLETED_EVENT);
		}

		/**
		 * Whether or not the data is loaded.
		 * @return {Boolean} True if the data has loaded, false otherwise.
		 */
		_this.isLoaded = function() {
			return _loaded;
		}

		/**
		 * Get the raw data, if some information is needed from it that can't be gotten otherwise.
		 * @return {Object} The raw data for the news.
		 */
		_this.getRawData = function () {
			return _data;
		}

		/**
		 * Get the number of news items.
		 * @return {Number} the number of news items.
		 */
		_this.getNumNewsItems = function () {
			return _data["feed"]["entry"].length;
		}

		/**
		 * Get a column from an entry in the spreadsheet.
		 * @param  {Object} entry       The entry
		 * @param  {string} column_name The name of the column.
		 * @return {string}             The value stored in the column.
		 */
		function _getColumn (entry, column_name) {
			return entry["gsx$"+column_name]["$t"];
		}

		/**
		 * Get a string for a given month index.
		 * @param  {Number} monthIndex Month index, starting at 1 for January and ending at 12 for December.
		 * @return {String}            Month as a string.
		 */
		function _getMonthString(monthIndex) {
			return NewsDataManager.MONTHS[parseInt(monthIndex) - 1];
		}

		/**
		 * Get The news items from the given start index to the given end index, defaulting to the entire list.
		 * @param  {Number} startIndex The start index.
		 * @param  {Number} endIndex   The end index (exclusive).
		 * @return {Array}             The news items between the two indices, exclusive.
		 */
		_this.getNewsItems = function (startIndex, endIndex) {
			if(typeof(startIndex) == "undefined") {
				startIndex = 0;
			}

			var length = _this.getNumNewsItems();

			if (typeof(endIndex) == "undefined") {
				endIndex = length
			}

			var items = [];

			for (var i = startIndex; i < endIndex; i++) {
				items.push (_this.getNewsItem(i));
			}
			return items;
		}

		/**
		 * Replace all occurrences of a given item in a string with a replacement.
		 * @param  {String} string      The string whose contents to replace.
		 * @param  {String} item        The string to replace.
		 * @param  {String} replacement The replacement string.
		 * @return {String}             The string with all instances of item replaced by replacement.
		 */
		function _replaceAll(string, item, replacement) {
			while(string.indexOf(item) !== -1) {
				string = string.replace(item, replacement);
			}
			return string;
		}

		/**
		 * Get a news item with a given index.
		 * @param  {Number} itemIndex The index of the item in the news items array.
		 * @return {Object}           The news item.
		 */
		_this.getNewsItem = function (itemIndex) {
			var entry = _data["feed"]["entry"][itemIndex];
			var newsItem = {};
			newsItem.date = _getMonthString(_getColumn(entry, "month")) +  " "  + _getColumn(entry, "year");
			newsItem.showClass = _replaceAll(_getColumn(entry, "show").toLowerCase(), " ", "-");
			newsItem.show = _getColumn(entry, "show");
			newsItem.headline = _getColumn(entry, "headline");
			newsItem.link = _getColumn(entry, "link").replace("http://", "");
			newsItem.logo = _getColumn(entry, "logo");
			newsItem.video = _getColumn(entry, "video");

			return newsItem;
		}

		return _construct();
	}

	ns.NewsDataManager = NewsDataManager;

} ( ss ) );