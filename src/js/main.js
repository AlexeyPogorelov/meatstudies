var winWidth = $(window).width(),
		winHeight = $(window).height();

var dom = {
	$topLine: $('.top-line')
}
//scroll
	$(document).on('scroll', function () {
		var top = $(this).scrollTop();

		if (top > winHeight * 2) {
			dom.$topLine.addClass('showed');
		} else {
			dom.$topLine.removeClass('showed');
		}
	});

	// resize
	$(window).on('resize', function () {
		winWidth = $(window).width();
		winHeight = $(window).height();
	});