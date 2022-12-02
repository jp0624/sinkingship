require.include ("weblib/core/AbstractObject.js");

( function (ns) {

	SeriesDataManager.prototype = new AbstractObject();
	SeriesDataManager.constructor = SeriesDataManager;

	SeriesDataManager.LOAD_COMPLETED_EVENT = "completed";
	SeriesDataManager.SERIES_DATA_PATH = "json/series.json";

	/**
	 * Manager which loads data about Sinking Ship series into the SS site.
	 */
	function SeriesDataManager() {

		// Keep a locally scoped copy of this.
		var _this = this;

		// Whether or not the data has loaded.
		var _loaded;

		// The data itself.
		var _data;

		/**
		 * Constructor for Series Data Manager.
		 * @return {[type]} [description]
		 */
		var _construct = function () {
			_loaded = false;

			return _this;
		}

		/**
		 * Load the data for series.
		 * When complete the SeriesDataManager.LOAD_COMPLETED_EVENT will be fired.
		 */
		_this.load = function () {
			$.getJSON (SeriesDataManager.SERIES_DATA_PATH, _getDataSuccess);
		}

		/**
		 * Fired on successfull data retrieval.
		 * Dispatches the SeriesDataManager.LOAD_COMPLETED_EVENT.
		 * @param  {Object} data The data that was loaded.
		 */
		function _getDataSuccess (data) {
			_data = data;
			_loaded = true;
			_this.dispatchEvent(SeriesDataManager.LOAD_COMPLETED_EVENT);
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
		 * Whether or not the series data has loaded.
		 * @return {Boolean} True if the data has loaded, false otherwise.
		 */
		_this.isLoaded = function () {
			return _loaded;
		}

		/**
		 * Get the raw data from the JSON file.
		 * @return {Object} The raw JSON object.
		 */
		_this.getRawData = function () {
			return _data;
		}

		/**
		 * Get the number of series items.
		 * @return {Number} The number of series items.
		 */
		_this.getNumSeriesItems = function () {
			return _data["feed"]["entry"].length;
		}

		/**
		 * Get series items.
		 * @param  {Number} startIndex The start index to get items from.
		 * @param  {Number} endIndex   The end index to get the items from.
		 * @return {Array}             The series items.
		 */
		_this.getSeriesItems = function(startIndex, endIndex) {
			if (typeof (startIndex) == "undefined") {
				startIndex = 0;
			}

			var length = _this.getNumSeriesItems();

			if (typeof (endIndex) == "undefined") {
				endIndex = length;
			}

			var items = [];

			for(var i = startIndex; i < endIndex; i++) {
				items.push(_this.getSeriesItem(i));
			}

			return items;
		}

		/**
		 * Get featured series items.
		 * @param  {Number} startIndex The start index.
		 * @param  {Number} endIndex   The end index.
		 * @return {Array}             The featured series items.
		 */
		_this.getFeaturedSeriesItems = function (startIndex, endIndex) {
			var items = _this.getSeriesItems(startIndex, endIndex);

			var filtered_items = [];
			for (var i = 0; i < items.length; i++) {
				if(items[i]["featured"] == "TRUE")
				{
					filtered_items.push(items[i]);
				}
			}

			return filtered_items;
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
		 * Get an individual series item.
		 * @param  {Number} itemIndex The index of the item.
		 * @return {Object}           The series item itself.
		 */
		_this.getSeriesItem = function(itemIndex) {
			var entry = _data["feed"]["entry"][itemIndex];
			var seriesItem = {};
			seriesItem.show = _getColumn(entry, "show");
			seriesItem.showClass = _replaceAll(_getColumn(entry, "show").toLowerCase(), " ", "-");
			seriesItem.episodesAndLength = _getColumn(entry, "episodesandlength");
			seriesItem.distributedBy = _getColumn(entry, "distributedby");
			seriesItem.deliveryDate = _getColumn(entry, "deliverydate");
			seriesItem.productionYear = _getColumn(entry, "productionyear");
			seriesItem.productionPartner = _getColumn(entry,"productionpartner");
			seriesItem.websiteName = _getColumn(entry,"websitename");
			seriesItem.websiteUrl = _getColumn(entry,"websiteurl").replace("http://", "");
			seriesItem.description = _getColumn(entry, "description");
			seriesItem.sseContact = _getColumn(entry, "ssecontact");
			seriesItem.videoUrl = _getColumn(entry, "videourl");
			seriesItem.folderName = _getColumn(entry, "foldername");
			seriesItem.featured = _getColumn(entry, "featured");
			return seriesItem;
		}

		return _construct();

	}

	ns.SeriesDataManager = SeriesDataManager;

} ( ss ) );