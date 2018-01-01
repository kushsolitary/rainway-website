// Get the query parameters for modal handling
// Source: http://stackoverflow.com/a/2880929
var urlParams;
(window.onpopstate = function () {
	var match,
		pl     = /\+/g,  // Regex for replacing addition symbol with a space
		search = /([^&=]+)=?([^&]*)/g,
		decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
		query  = window.location.search.substring(1);

	urlParams = {};
	while (match = search.exec(query))
		urlParams[decode(match[1])] = decode(match[2]);
})();

/**
 * Modal handling
 */
var modalTarget;

// If the url has modal param, open that modal by default
if (urlParams.modal) {
	modalTarget = urlParams.modal;
	$('body').addClass('modal-visible');
	$('.modal--' + modalTarget).addClass('modal--visible');
	window.scrollTo(0, 0);
}

$('.modal-trigger').click(function (e) {
	e.preventDefault()

	// Find which modal to open
	modalTarget = $(this).attr('data-target');

	// Add modal class to body
	$('body').addClass('modal-visible');

	// make the correct modal visible
	$('.modal--' + modalTarget).addClass('modal--visible');

	// Add query string to the url
	if (history.pushState) {
		var newurl = window.location.origin + window.location.pathname + '?modal=' + modalTarget;
		window.history.pushState({path:newurl},'',newurl);
	}
});

// Close the modal
$('.modal-overlay, .modal__close').click(function (e) {
	$('body').removeClass('modal-visible');
	$('.modal').removeClass('modal--visible');

	// Remove query string from the url
	if (history.pushState) {
		var newurl = window.location.origin + window.location.pathname;
		window.history.pushState({path:newurl},'',newurl);
	}
	e.preventDefault()
});


// Set the download url
$.ajax({
  dataType: "json",
  url: 'https://releases.rainway.io/Installer_current.json',
  crossDomain: true,
  success: function (data) {
  	// console.log(data);
  }
});