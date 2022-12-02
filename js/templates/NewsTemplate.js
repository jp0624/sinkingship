/**
 * The container that holds the news items.
 * @type {String}
 */
var NEWS_CONTAINER = "#steveDiv";

/**
 * The template for how the news items are rendered as HTML.
 * @type {String}
 */
var NEWS_TEMPLATE = '\
<div class="newsItem {{{showClass}}}"> \
	<h1> {{{date}}} </h1> \
	<span> {{{show}}} </span> \
	<h2> {{{headline}}} </h2> \
	<a href="http://{{{link}}}" target="_blank"> + Read More </a> \
</div>';