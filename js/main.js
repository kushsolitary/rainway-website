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
  	var url = 'https://releases.rainway.io/' + data.Name + '_' + data.Version + '.exe'
  	$(".download-button, .download-top").attr('href', url).removeClass('download-button--disabled')
  }
});

// Registration
var _a = [".btn-submit", "#regUsername", "#regEmail", "#regPassword", "#regRepeatPassword", ".form-check-input"].map(function(x) {
        return $(x);
    }),
    $submit = _a[0],
    $username = _a[1],
    $email = _a[2],
    $password = _a[3],
    $passwordValidate = _a[4],
    $checkbox = _a[5];
var submitEnabled = true;

function disableSubmit() {
    $submit.removeClass("btn-disabled").addClass("btn-disabled");
    submitEnabled = false;
}

function enableSubmit() {
    $submit.removeClass("btn-disabled");
    submitEnabled = true;
}

$('form.register').submit(function(e) {
    if (submitEnabled) {
        disableSubmit();
        var _a = [$username, $email, $password, $passwordValidate, $checkbox].map(function(x) {
                return x.val();
            }),
            username = _a[0],
            email = _a[1],
            password = _a[2],
            passwordValidate = _a[3];
        var checked = $checkbox.is(":checked");
        
        if (checked) {
            $.ajax({
                type: "POST",
                method: "POST",
                contentType: "application/json",
                url: "https://api.rainway.io/v2/user/register",
                data: JSON.stringify({
                    username: username,
                    email: email,
                    password: password,
                    passwordValidate: passwordValidate
                }),
                success: function(data) {
                    console.log(data);
                    showMessage(data);
                }
            });
        } else {
            showMessage({
                error: true,
                message: "Please accept the terms."
            });
        }
    }

    e.preventDefault()
});

function showMessage(msg) {
    var $alert = $(".info-box");
    $alert.show().text(msg.message);
    $alert.removeClass("alert-success alert-danger");
    $alert.addClass(msg.error ? "alert-danger" : "alert-success");
    msg.error && enableSubmit();
}

function hideMessage() {
    $(".info-box").hide();
}