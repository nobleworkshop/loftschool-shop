"use strict";

$.fn.scroller = function () {
	var button = this;
	$(window).scroll(function () {
		if ($(this).scrollTop() > 0) {
			button.fadeIn();
		} else {
			button.fadeOut();
		}
	});
	button.click(function(event) {
		event.preventDefault();
		$('body,html').animate({
			scrollTop: 0
			}, 400);
	})
}
$('.js-up-button').scroller();