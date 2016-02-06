$(window).on('load', function () {
	var winWidth = $(window).width(),
		winHeight = $(window).height(),
		dom = {
			$topLine: $('.top-line')
		},
		bodyOverflow = {
			fixBody: function () {
				$('body').width($('body').width())
					.addClass('fixed');
			},
			unfixBody: function () {
				$('body')
					.css({
						'width': 'auto'
					})
					.removeClass('fixed');
			},
			resize: function () {
				this.unfixBody();
			}.bind(this)
		},
		goUp = (function () {
			var $el = $('#to-top'),
				state = false,
				speed = 900,
				paused = false;
			var plg = {
				up: function () {
					paused = true;
					$("html, body").stop().animate({scrollTop:0}, speed, 'swing', function () {
						paused = false;
					});
					plg.hide();
				},
				show: function () {
					if (!state && !paused) {
						$el.addClass('opened');
						state = true;
					}
				},
				hide: function () {
					if (state) {
						$el.removeClass('opened');
						state = false;
					}
				},
				$el: $el
			}
			$el.on('click', function () {
				plg.up();
			});
			return plg;
		})();

		// modals
		$('.modal-open').on('click', function (e) {
			e.preventDefault();
			var $el = $($(this).attr('href') || $(this).data('target')).addClass('opened');
			if ($el.length) {
				bodyOverflow.fixBody();
			}
		});
		$('.modal-holder').on('click', function (e) {
			if (this == e.target) {
				if ($(this).attr('target')) {
					document.location = $(this).attr('target');
				} else {
					$(this).removeClass('opened');
					bodyOverflow.unfixBody();
				}
			}
		});
		$('.close-modal').on('click', function () {
			$(this).closest('.opened').removeClass('opened');
			bodyOverflow.unfixBody();
		});
		$(window).on('keyup', function (e) {
			// esc pressed
			if (e.keyCode == '27') {
				$('.modal-holder').removeClass('opened');
				$('#result').addClass('clothing').children().animate({
					'opacity': 0
				}, function () {
					$(this).remove();
					$('#result').removeClass('clothing');
				});
			}
		});
		$('#result').on('click', function () {
			var $self = $(this);
			$(this).addClass('clothing').children().animate({
				'opacity': 0
			}, function () {
				$(this).remove();
				$self.removeClass('clothing');
			});
		});

	// INIT plugins

	$('#gallery-slider').capabilitiesSlider();
	$('#persons-slider').capabilitiesSlider({
		slidesOnPage: 3
	});

	//scroll
		$(document).on('scroll', function () {
			var top = $(this).scrollTop();

			if (top > winHeight / 2) {
				dom.$topLine.addClass('showed');
			} else {
				dom.$topLine.removeClass('showed');
			}
			if (top > winHeight / 2) {
				goUp.show();
			} else {
				goUp.hide();
			}
		});

		// resize
		$(window).on('resize', function () {
			winWidth = $(window).width();
			winHeight = $(window).height();
		});

});

(function ($) {
	$.fn.capabilitiesSlider = function (opt) {

		this.each(function (i) {

			var DOM = {},
				state = {
					'touchStart': {},
					'touchEnd': {}
				},
				self = this;

			// options
			if (!opt) {
				opt = {};
			}
			opt = $.extend({
				'loop': true,
				'interval': false,
				'easing': 'swing',
				'prevClass': 'arrow-left-1',
				'nextClass': 'arrow-right-1',
				'holderClass': '.slides-holder',
				'slideClass': '.slide',
				'nameClass': '.slide-name',
				'imageClass': '.slide-image',
				'slidesOnPage': 1
			}, opt);

			// methods
			var plg = {
				cacheDOM: function () {
					DOM.$slider = $(self);
					DOM.$preloader = DOM.$slider.find('.slider-preloader');
					DOM.$viewport = DOM.$slider.find('.slider-viewport');
					DOM.$sliderHolder = DOM.$viewport.find('.slider-holder');
					DOM.$slides = DOM.$sliderHolder.find('.slide');
				},
				init: function () {
					state.cur = state.cur || 0;
					state.slides = DOM.$slides.length;
					state.pages = Math.ceil(DOM.$slides.length / opt.slidesOnPage);
					DOM.$preloader.fadeOut(150);
					// console.log(state)
				},
				resize: function () {
					state.sliderWidth = DOM.$viewport.width();
					DOM.$slides.width( DOM.$viewport.width() / opt.slidesOnPage);
					DOM.$slides.height(
							(function ($slides) {
								var max = 1;
								$slides.each(function () {
									var height = $(this).find('> div').outerHeight();
									if (height > max) {
										max = height;
									}
								});
								return max;
							})(DOM.$slides) + 26
						);
					state.slideWidth = DOM.$slides.eq(0).outerWidth() + 12;
					DOM.$sliderHolder.width(state.slideWidth * state.slides);
				},
				prevSlide: function () {
					var id = state.cur - 1;
					if (id < 0) {
						// this.toSlide(state.activeSlides - 1);
						return;
					}
					this.toSlide(id);
				},
				nextSlide: function () {
					var id = state.cur + 1;
					if (id >= state.pages) {
						// this.toSlide(0);
						return;
					}
					this.toSlide(id);
				},
				toSlide: function (id) {
					DOM.$sliderHolder.css({
						'-webkit-transform': 'translateX( -' + (state.sliderWidth * id) + 'px)',
						'transform': 'translateX( -' + (state.sliderWidth * id) + 'px)'
					});
					// .one('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', function () {
					// 	$(this).css({
					// 		'left': 1
					// 	});
					// });
					// DOM.$sliderHolder.css({
					// 	'left': -(state.slideWidth * opt.slidesOnPage * id)
					// });
					DOM.$pagination.find('.page').eq(id).addClass('active').siblings().removeClass('active');
					state.cur = id;
				},
				createPagination: function () {
					if (DOM.$pagination) {
						DOM.$pagination.empty();
					} else {
						DOM.$pagination = $('<div>').addClass('paginator-holder');
						DOM.$pagination.appendTo(DOM.$slider);
					}
					for (var i = 0; i < state.pages / opt.slidesOnPage; i++) {
						var page = $('<div>').data('page', i).addClass('page');
						if (!i) {
							page.addClass('active');
						}
						DOM.$pagination.append(page);
					}
				}
			};

			plg.cacheDOM();
			plg.init();
			plg.createPagination();
			plg.resize();

			// resize
			$(window).on('resize', function () {
				plg.resize();
			});

			// click events
			DOM.$slider.on('click', function (e) {
				var $target = $(e.target);
				if ($target.hasClass('page')) {
					plg.toSlide($(e.target).data('page'));
				}
			});

			// drag events
			DOM.$slider.on('touchstart', function (e) {
				state.touchStart.xPos = e.originalEvent.touches[0].clientX;
				state.touchStart.yPos = e.originalEvent.touches[0].clientY;
				state.touchStart.timeStamp = e.timeStamp;
			});
			DOM.$slider.on('touchmove', function (e) {
				state.touchEnd.xPos = e.originalEvent.touches[0].clientX;
				state.touchEnd.yPos = e.originalEvent.touches[0].clientY;
			});
			DOM.$slider.on('touchend', function (e) {
				var distance = 70,
					speed = 200,
					deltaX = state.touchEnd.xPos - state.touchStart.xPos,
					deltaY = Math.abs(state.touchEnd.yPos - state.touchStart.yPos);
					// time = e.timeStamp - state.touchStart.timeStamp;
				// console.log('-----');
				// console.log(time);
				// console.log(deltaX);
				// console.log((deltaY));
				// console.log(state.touchEnd.originalEvent.touches[0].clientX);
				// console.log(state.touchStart.originalEvent.touches[0].clientX);
				if (deltaX > distance || -deltaX > distance && deltaY < 30) {
					if (deltaX < 0) {
						plg.nextSlide();
					} else {
						plg.prevSlide();
					}
				}
			});

			$(window).on('resize', plg.resize.bind(plg));
			plg.init();

			return plg;
		});
	};
})(jQuery);
