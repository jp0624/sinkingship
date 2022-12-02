require.include ("classes/data_parsing/SeriesDataManager");
require.include ("templates/SeriesTemplate.js");


( function (ns) {
	SeriesManager.prototype = new AbstractObject();
	SeriesManager.constructor = SeriesManager;

	/**
	 * Series Manager
	 */
	function SeriesManager() {
		// create a locally scoped copy of this.
		var _this = this;

		// data manager.
		var _dataManager;

		/**
		 * Constructor for series manager.
		 * @return {SeriesManager} The constructed manager.
		 */
		var _construct = function() {
			_dataManager = new ns.SeriesDataManager();
			_dataManager.addEventListener(ns.SeriesDataManager.LOAD_COMPLETED_EVENT, _onSeriesManagerReady);
			_dataManager.load();

			return _this;
		}

		/**
		 * Fired when the manager is ready.
		 */
		function _onSeriesManagerReady () {
			_this.refreshSeriesHeaders();
			_this.displaySeriesDescriptions();
		}

		/**
		 * Refresh the series headers.
		 * @param  {Number} startIndex (optional) the start index for the series.
		 * @param  {[type]} endIndex   [description]
		 * @return {[type]}            [description]
		 */
		_this.refreshSeriesHeaders = function(startIndex, endIndex) {
			$(SERIES_HEADER_CONTAINER).empty();

			var allSeries = _dataManager.getFeaturedSeriesItems(startIndex, endIndex);
			console.table(allSeries);
			for (var i = 0; i < allSeries.length; i++) {
				var rendered = Mustache.render(SERIES_HEADER_TEMPLATE, allSeries[i]);
				$(SERIES_HEADER_CONTAINER).append(rendered);
			}
		}

		_this.displaySeriesDescriptions = function(startIndex, endIndex) {
			$(SERIES_DESCRIPTION_CONTAINER).empty();

			var allSeries = _dataManager.getFeaturedSeriesItems(startIndex, endIndex);
			for (var i = 0; i < allSeries.length; i++) {
				var rendered = Mustache.render(SERIES_DESCRIPTION_TEMPLATE, allSeries[i]);
				$(SERIES_DESCRIPTION_CONTAINER).append(rendered);
			}
		}

		return _construct();
	}

	ns.SeriesManager = ns.SeriesManager || new SeriesManager();

} ( ss ))