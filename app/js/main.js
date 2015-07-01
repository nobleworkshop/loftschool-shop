"use strict";

$.fn.scroller = function () {
	var button = this;
	//Скрываем кнопку, если мы сверху
	$(window).scroll(function () {
		if ($(this).scrollTop() > 0) {
			button.fadeIn();
		} else {
			button.fadeOut();
		}
	});
	//Скроллим вверх по клику
	button.click(function(event) {
		event.preventDefault();
		$('body,html').animate({
			scrollTop: 0
			}, 400);
	})
	return button;
}

var slider = function() {
	var jSlider,
		jSliderLeft,
		jSliderRight,
		jSliderLgImage,
		jSliderImages,
		jFirstImage,
		currentPosition;
	function _goRight() {
		var nextSlide = jSlider.find('.js-slide-active').last().next(),
			firstSlide = jSlider.find('.js-slide-active').first();
		if( nextSlide.length === 0 )
			return false;
		currentPosition++;
		_hideSlide(firstSlide);
		_showSlide(nextSlide);
		_moveSlides();
	}
	function _goLeft() {
		var prevSlide = jSlider.find('.js-slide-active').first().prev(),
			lastSlide = jSlider.find('.js-slide-active').last();
		if( prevSlide.length === 0 )
			return false;
		currentPosition--;
		_hideSlide(lastSlide);
		_showSlide(prevSlide);
		_moveSlides();
	}
	function _showSlide(slide) {
		slide
			.stop(true, true)
			.animate({opacity: 1}, {
				duration: 300,
				queue: false
			})
			.addClass('js-slide-active');
	}
	function _hideSlide(slide) {
		slide
			.stop(true, true)
			.animate({opacity: 0}, {
				duration: 300,
				queue: false
			})
			.removeClass('js-slide-active');
	}
	function _replaceImage(clickedSlide) {
		var source = clickedSlide.find('img').attr('src');
		jSliderLgImage
			.stop(true, true)
			.animate({opacity: 0}, 200, function() {
				jSliderLgImage.attr('src', source);
			})
			.animate({opacity: 1}, 200);
	}
	function _moveSlides() {
		jFirstImage
			.stop(true, true)
			.animate({
				marginLeft: -35*currentPosition +'%'}, 
				400);
	}
	function _setListeners() {
		jSliderRight.click(function(event) {
			event.preventDefault();
			_goRight();
		})
		jSliderLeft.click(function(event) {
			event.preventDefault();
			_goLeft();
		})
		jSliderImages.click(function() {
			var clickedSlide = $(this);
			_replaceImage(clickedSlide);
		});
	}
	
	return {
		init: function(selectors) {
			if(!selectors)
				console.log('Error init slider module');
			jSlider = $(selectors.slider);
			jSliderLeft = $(selectors.leftControl);
			jSliderRight = $(selectors.rightControl);
			jSliderLgImage = $(selectors.image);
			jSliderImages = jSlider.children();
			jFirstImage = jSliderImages.first();
			//Add class for active images and  
			//hide (for correct animation) inactive
			jSliderImages
				.filter(':lt(3)')
				.addClass('js-slide-active');
			jSliderImages
				.filter(':not(.js-slide-active)')
				.css('opacity', 0);

			currentPosition = 0;
			_setListeners();
		}
	}
};
//Init slider
var mainSlider = slider();
mainSlider.init({
	slider: '.js-slider-list',
	leftControl: '.js-slider-left',
	rightControl: '.js-slider-right',
	image: '.js-slider-lg-img'
});
//Init scroll
$('.js-up-button').scroller();