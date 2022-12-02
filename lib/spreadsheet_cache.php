<?php
    
    // update every 12 hours
	$CACHE_LIFETIME = 43200;	//3600

	function is_cache_valid($path) {
		global $CACHE_LIFETIME;

		$mod_time = filemtime($path);
		$time = time();
		if($time - $mod_time > $CACHE_LIFETIME) {
			return false;
		}
		return true;
	}

	function refresh_cache($path, $sourceURL) {		
		$file = file_get_contents($sourceURL);
		file_put_contents($path, $file);
	}

	function get_cache($path, $sourceURL, $forceRefresh = false) {
		if(!file_exists($path)) {
			refresh_cache($path, $sourceURL);
		}
		else if($forceRefresh || !is_cache_valid($path)) {
			refresh_cache($path, $sourceURL);			
		}
		
		$cached_file = file_get_contents($path);

		return json_decode($cached_file);;
	}

	function get_awards_json() {
		return get_cache("./json/awards.json", "http://spreadsheets.google.com/feeds/list/1AkBCaEDzV8dpHvcOxFqpi8QHWPg1P6ajDt5m2vIykoo/od7/public/values?alt=json", false);
	}

	function get_news_json() {
		return get_cache("./json/news.json", "http://spreadsheets.google.com/feeds/list/1AkBCaEDzV8dpHvcOxFqpi8QHWPg1P6ajDt5m2vIykoo/od6/public/values?alt=json", false);
	}

	function get_series_json() {
		return get_cache("./json/series.json", "http://spreadsheets.google.com/feeds/list/1AkBCaEDzV8dpHvcOxFqpi8QHWPg1P6ajDt5m2vIykoo/od4/public/values?alt=json", false);
	}

	function get_interactive_json() {
		return get_cache("./json/interactive.json", "http://spreadsheets.google.com/feeds/list/1AkBCaEDzV8dpHvcOxFqpi8QHWPg1P6ajDt5m2vIykoo/oda/public/values?alt=json", false);
	}

	function get_team_json() {
		return get_cache("./json/team.json", "http://spreadsheets.google.com/feeds/list/1AkBCaEDzV8dpHvcOxFqpi8QHWPg1P6ajDt5m2vIykoo/odb/public/values?alt=json", false);
	}

	function refresh_all_spreadsheet_cache() {
		get_cache("./json/awards.json", "http://spreadsheets.google.com/feeds/list/1AkBCaEDzV8dpHvcOxFqpi8QHWPg1P6ajDt5m2vIykoo/od7/public/values?alt=json", true);
		get_cache("./json/news.json", "http://spreadsheets.google.com/feeds/list/1AkBCaEDzV8dpHvcOxFqpi8QHWPg1P6ajDt5m2vIykoo/od6/public/values?alt=json", true);
		get_cache("./json/series.json", "http://spreadsheets.google.com/feeds/list/1AkBCaEDzV8dpHvcOxFqpi8QHWPg1P6ajDt5m2vIykoo/od4/public/values?alt=json", true);
		get_cache("./json/interactive.json", "http://spreadsheets.google.com/feeds/list/1AkBCaEDzV8dpHvcOxFqpi8QHWPg1P6ajDt5m2vIykoo/oda/public/values?alt=json", true);
		get_cache("./json/team.json", "http://spreadsheets.google.com/feeds/list/1AkBCaEDzV8dpHvcOxFqpi8QHWPg1P6ajDt5m2vIykoo/odb/public/values?alt=json", true);
	}


/*
Currently the only way to access google spreadsheet pages is by the table IDs,
hope they will fix this soon so the ID list below will no longer be needed.

https://spreadsheets.google.com/feeds/worksheets/0Al6P4naLdWycdFVXZ0ZxTFBpaDN1aEthRkNxOU9EekE/private/full

GID_TABLE = {
    'od6': 0, 
    'od7': 1, 
    'od4': 2, 
    'od5': 3, 
    'oda': 4, 
    'odb': 5, 
    'od8': 6, 
    'od9': 7, 
    'ocy': 8, 
    'ocz': 9, 
    'ocw': 10, 
    'ocx': 11, 
    'od2': 12, 
    'od3': 13, 
    'od0': 14, 
    'od1': 15, 
    'ocq': 16, 
    'ocr': 17, 
    'oco': 18, 
    'ocp': 19, 
    'ocu': 20, 
    'ocv': 21, 
    'ocs': 22, 
    'oct': 23, 
    'oci': 24, 
    'ocj': 25, 
    'ocg': 26, 
    'och': 27, 
    'ocm': 28, 
    'ocn': 29, 
    'ock': 30, 
    'ocl': 31, 
    'oe2': 32, 
    'oe3': 33, 
    'oe0': 34, 
    'oe1': 35, 
    'oe6': 36, 
    'oe7': 37, 
    'oe4': 38, 
    'oe5': 39, 
    'odu': 40, 
    'odv': 41, 
    'ods': 42, 
    'odt': 43, 
    'ody': 44, 
    'odz': 45, 
    'odw': 46, 
    'odx': 47, 
    'odm': 48, 
    'odn': 49, 
    'odk': 50, 
    'odl': 51, 
    'odq': 52, 
    'odr': 53, 
    'odo': 54, 
    'odp': 55, 
    'ode': 56, 
    'odf': 57, 
    'odc': 58, 
    'odd': 59, 
    'odi': 60, 
    'odj': 61, 
    'odg': 62, 
    'odh': 63, 
    'obe': 64, 
    'obf': 65, 
    'obc': 66, 
    'obd': 67, 
    'obi': 68, 
    'obj': 69, 
    'obg': 70, 
    'obh': 71, 
    'ob6': 72, 
    'ob7': 73, 
    'ob4': 74, 
    'ob5': 75, 
    'oba': 76, 
    'obb': 77, 
    'ob8': 78, 
    'ob9': 79, 
    'oay': 80, 
    'oaz': 81, 
    'oaw': 82, 
    'oax': 83, 
    'ob2': 84, 
    'ob3': 85, 
    'ob0': 86, 
    'ob1': 87, 
    'oaq': 88, 
    'oar': 89, 
    'oao': 90, 
    'oap': 91, 
    'oau': 92, 
    'oav': 93, 
    'oas': 94, 
    'oat': 95, 
    'oca': 96, 
    'ocb': 97, 
    'oc8': 98, 
    'oc9': 99
}
*/

?>
