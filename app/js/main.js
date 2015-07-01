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

var images = $('.js-slider-list').children(),
	countImg = images.length,
	currentImg = 0;
images.filter(':lt(3)')
	.addClass('js-slide-active');
images.filter(':not(.js-slide-active)')
	.css('opacity', 0);
$('.js-slider-right').click(function (event) {
	event.preventDefault();
	currentImg++;
	$('.js-slide-active').first().animate({
			opacity: 0
		}, 400)
		.removeClass('js-slide-active');
	$(images[0]).animate({
		marginLeft: -35*currentImg +'%'}, 
		400);
	$('.js-slide-active').last().next()
		.animate({
			opacity: 1
		}, 400)
		.addClass('js-slide-active');
});
$('.js-slider-left').click(function (event) {
	event.preventDefault();
	currentImg--;
	$('.js-slide-active').last().animate({
			opacity: 0
		}, 400)
		.removeClass('js-slide-active');
	$(images[0]).animate({
		marginLeft: -35*currentImg +'%'}, 
		400);
	$('.js-slide-active').first().prev()
		.animate({
			opacity: 1
		}, 400)
		.addClass('js-slide-active');
});
