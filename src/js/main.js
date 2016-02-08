var animationPrefix = (function () {
			var t,
			el = document.createElement("fakeelement");
			var transitions = {
				"transition": "animationend",
				"OTransition": "oAnimationEnd",
				"MozTransition": "animationend",
				"WebkitTransition": "webkitAnimationEnd"
			};
			for (t in transitions){
				if (el.style[t] !== undefined){
					return transitions[t];
				}
			}
		})(),
		loading = {
		avgTime: 3000,
		trg: 1,
		state: 0,
		preloader: $('body > .preloader'),
		loaded: function () {
			if(++loading.state == loading.trg) {
				loading.status(1);
				setTimeout(loading.done, 500);
			} else {
				loading.status(loading.state / loading.trg / 1.1);
			}
		},
		status: function (mult) {
			loading.preloader.find('> .after').css({
				'width': mult * 100 + '%'
			});
		},
		done: function () {
			if (loading.finished) {
				return;
			}

			// INIT plugins
			$('#gallery-slider').capabilitiesSlider();
			$('#persons-slider').capabilitiesSlider({
				slidesOnPage: 3
			});
			// WOW init
			if ($.browser.desktop) {
				$('.fadeInUp').addClass('wow fadeInUp').on(animationPrefix, function () {
					$(this).removeClass('wow');
				});
				$('.fadeInRight').addClass('wow fadeInRight').on(animationPrefix, function () {
					$(this).removeClass('wow');
				});
				$('section').not('.header, #program, #contact').find('> *').addClass('wow fadeInUp').on(animationPrefix, function () {
					$(this).removeClass('wow');
				});
				$('section.header').addClass('wow').on(animationPrefix, function () {
					$(this).removeClass('wow');
				});
				$('#program').find('.button-label').addClass('wow fadeInUp').on(animationPrefix, function () {
					$(this).removeClass('wow');
				});
				$('#program').find('> .border > *').addClass('wow fadeInUp').on(animationPrefix, function () {
					$(this).removeClass('wow');
				});
				$('#contact').find('> * > * > *').addClass('wow fadeInUp').on(animationPrefix, function () {
					$(this).removeClass('wow');
				});
				new WOW().init();
			}

			// menu navigation
			$('.main-navigation').landingNavigation();

			// hide preloader
			loading.preloader.animate({}).delay(100).animate({
				'opacity': 0
			}, 600, function () {
				loading.status(0);
				$(this).detach();
				loading.finished = true;
			});
		}
	};

setTimeout(function () {
	loading.status(1);
	setTimeout(loading.done, 500);
}, 10000);

// $('.main-navigation').pageNav();

// mail sent
function mailSent () {
	$('#mail-sent').addClass('opened');
}

$(window).on('load', function () {
	loading.status(1);
	setTimeout(loading.done, 500);
});

$(document).on('ready', function () {
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

		// iOS fix
		if ($.browser.safari && !$.browser.mobile ) $('body').addClass('client-safari');
		if ($.browser.iphone || $.browser.ipad || $.browser.ipad) $('body').addClass('client-ios');
		if ($.browser.msie) $('body').addClass('client-ie');
		if ($.browser.name == 'mozilla') $('body').addClass('client-moz');
		if ($.browser.mac) $('body').addClass('client-mac');

		$('#phone-field').on('focus', function () {
			if (!$(this).val()) {
				$(this).val('+380')
			}
		});

		$('.top-line').find('.main-navigation a').on('click', function (e) {
			e.preventDefault();
			$(this).addClass('active')
			$(this).parent().siblings().find('> a').removeClass('active');
			var $target = $( $( this ).attr('href') );
			if ($target.length) {
				$("html, body").stop().animate({scrollTop:$target.offset().top - 100}, 800, 'swing', function () {
					paused = false;
				});
			}
			bodyOverflow.unfixBody();
		})
		$('#mobile-menu').find('.main-navigation a').on('click', function (e) {
			e.preventDefault();
			$('.mobile-menu').removeClass('opened')
			$(this).addClass('active')
			$(this).parent().siblings().find('> a').removeClass('active');
			var $target = $( $( this ).attr('href') );
			if ($target.length) {
				$("html, body").stop().animate({scrollTop:$target.offset().top}, 800, 'swing', function () {
					paused = false;
				});
			}
			bodyOverflow.unfixBody();
		})

		// validation
		$('#subscribe').find('form').validate();

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
				bodyOverflow.unfixBody();
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
				'pagination': false,
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
					DOM.$slides.eq(0).addClass('active')
				},
				init: function () {
					state.cur = state.cur || 0;
					state.slides = DOM.$slides.length;
					state.pages = Math.ceil(DOM.$slides.length / opt.slidesOnPage);
					DOM.$preloader.fadeOut(150);
				},
				resize: function () {
					state.sliderWidth = DOM.$viewport.width();
					if ($(window).width() > 300 && opt.slidesOnPage > 1 && $(window).width() <= 700) {
						opt.slidesOnPage = Math.floor( opt.slidesOnPage / 2 );
						plg.init();
						plg.toSlide(0);
					}
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
						this.toSlide(state.pages - 1);
						return;
					}
					this.toSlide(id);
				},
				nextSlide: function () {
					var id = state.cur + 1;
					if (id >= state.pages) {
						this.toSlide(0);
						return;
					}
					this.toSlide(id);
				},
				toSlide: function (id) {
					// console.log(typeof id);
					// console.log(id);
					// id = parseInt(id);
							// alert()
					DOM.$sliderHolder.css({
						'-webkit-transform': 'translateX( -' + (state.sliderWidth * id) + 'px)',
						'transform': 'translateX( -' + (state.sliderWidth * id) + 'px)'
					});
					DOM.$slides.eq(id).addClass('active').siblings().removeClass('active');
					DOM.$pagination.find('.page').eq(id).addClass('active').siblings().removeClass('active');
					state.cur = id;
				},
				createPagination: function () {
					if (DOM.$pagination) {
						DOM.$pagination.empty();
					} else {
						DOM.$pagination = $('<div>').addClass('paginator-holder');
						if (opt.pagination || true) {
							DOM.$pagination.appendTo(DOM.$slider);
						}
					}
					$('<div>')
						.addClass('prev-slide')
						.appendTo(DOM.$pagination);
					for (var i = 0; i < state.pages / opt.slidesOnPage; i++) {
						var page = $('<div>').data('page', i).addClass('page');
						if (!i) {
							page.addClass('active');
						}
						DOM.$pagination.append(page);
					}
					$('<div>')
						.addClass('next-slide')
						.appendTo(DOM.$pagination);
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
				} else if ($target.hasClass('prev-slide')) {
					plg.prevSlide();
				} else if ($target.hasClass('next-slide')) {
					plg.nextSlide();
				}
			});

			// drag events
			DOM.$slider.on('touchstart', function (e) {
				state.touchStart.xPos = e.originalEvent.touches[0].clientX;
				state.touchStart.yPos = e.originalEvent.touches[0].clientY;
				state.touchStart.timeStamp = e.timeStamp;
				// console.log('-----');
			});
			DOM.$slider.on('touchmove', function (e) {
				state.touchEnd.xPos = e.originalEvent.touches[0].clientX;
				state.touchEnd.yPos = e.originalEvent.touches[0].clientY;
				// console.log('-----');
			});
			DOM.$slider.on('touchend', function (e) {
				var distance = 70,
					speed = 200,
					deltaX = state.touchEnd.xPos - state.touchStart.xPos,
					deltaY = Math.abs(state.touchEnd.yPos - state.touchStart.yPos);
				state.touchEnd.xPos = 0;
				state.touchEnd.yPos = 0;
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

	$.fn.landingNavigation = function (opt) {

		this.each(function (i) {

			var DOM = {},
				state = {},
				array = [],
				$self = $(this);

			// options
			if (!opt) {
				opt = {
					'linkClass': 'a'
				};
			}
			opt = $.extend({
			}, opt);

			// methods
			var plg = {
				init: function () {
					DOM.$lnks = $self.find(opt.linkClass);
					// state.pages = DOM.$lnks.length;
					plg.resize();
				},
				scroll: function (top) {
					for (var y = 0; y < array.length; y++) {
						if (top < array[y].val && y) {
							plg.avtive(array[y - 1].$elem);
							return;
						} else if (y == array.length - 1) {
							plg.avtive(array[y].$elem);
						}
					};
				},
				avtive: function ($el) {
					if ($el !== state.$active) {
						DOM.$lnks.removeClass('active');
						$el.addClass('active');
						state.$active = $el;
					}
				},
				resize: function () {
					DOM.$lnks.each(function (i, elem) {
							array[i] = {};
							array[i]['$elem'] = $(elem);
							array[i]['trg'] = $(elem).attr('href') || $(elem).data('target');
							array[i]['val'] = $(array[i]['trg']).offset().top;
						});
				}
			};

			plg.init();
			$(window).on('scroll', function () {
				plg.scroll($(this).scrollTop() + 110);
			})

			$(window).on('resize', function () {
				plg.resize();
			})

			return plg;
		});
	};

	$.fn.validate = function (opt) {

		this.each(function (i) {

			var DOM = {},
				state = {},
				$self = $(this);

			// options
			if (!opt) {
				opt = {};
			}
			opt = $.extend({
			}, opt);

			// methods
			var plg = {
				init: function () {
					DOM.$fields = $self.find('[data-validate]');
					console.log(DOM.$fields);
				}
			};

			plg.init();

			return plg;
		});
	};

})(jQuery);

/*!
 * jQuery Browser Plugin 0.1.0
 * https://github.com/gabceb/jquery-browser-plugin
 *
 * Original jquery-browser code Copyright 2005, 2015 jQuery Foundation, Inc. and other contributors
 * http://jquery.org/license
 *
 * Modifications Copyright 2015 Gabriel Cebrian
 * https://github.com/gabceb
 *
 * Released under the MIT license
 *
 * Date: 05-07-2015
 */
/*global window: false */

(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], function ($) {
      return factory($);
    });
  } else if (typeof module === 'object' && typeof module.exports === 'object') {
    // Node-like environment
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(window.jQuery);
  }
}(function(jQuery) {
  "use strict";

  function uaMatch( ua ) {
    // If an UA is not provided, default to the current browser UA.
    if ( ua === undefined ) {
      ua = window.navigator.userAgent;
    }
    ua = ua.toLowerCase();

    var match = /(edge)\/([\w.]+)/.exec( ua ) ||
        /(opr)[\/]([\w.]+)/.exec( ua ) ||
        /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
        /(iemobile)[\/]([\w.]+)/.exec( ua ) ||
        /(version)(applewebkit)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec( ua ) ||
        /(webkit)[ \/]([\w.]+).*(version)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec( ua ) ||
        /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
        /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
        /(msie) ([\w.]+)/.exec( ua ) ||
        ua.indexOf("trident") >= 0 && /(rv)(?::| )([\w.]+)/.exec( ua ) ||
        ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
        [];

    var platform_match = /(ipad)/.exec( ua ) ||
        /(ipod)/.exec( ua ) ||
        /(windows phone)/.exec( ua ) ||
        /(iphone)/.exec( ua ) ||
        /(kindle)/.exec( ua ) ||
        /(silk)/.exec( ua ) ||
        /(android)/.exec( ua ) ||
        /(win)/.exec( ua ) ||
        /(mac)/.exec( ua ) ||
        /(linux)/.exec( ua ) ||
        /(cros)/.exec( ua ) ||
        /(playbook)/.exec( ua ) ||
        /(bb)/.exec( ua ) ||
        /(blackberry)/.exec( ua ) ||
        [];

    var browser = {},
        matched = {
          browser: match[ 5 ] || match[ 3 ] || match[ 1 ] || "",
          version: match[ 2 ] || match[ 4 ] || "0",
          versionNumber: match[ 4 ] || match[ 2 ] || "0",
          platform: platform_match[ 0 ] || ""
        };

    if ( matched.browser ) {
      browser[ matched.browser ] = true;
      browser.version = matched.version;
      browser.versionNumber = parseInt(matched.versionNumber, 10);
    }

    if ( matched.platform ) {
      browser[ matched.platform ] = true;
    }

    // These are all considered mobile platforms, meaning they run a mobile browser
    if ( browser.android || browser.bb || browser.blackberry || browser.ipad || browser.iphone ||
      browser.ipod || browser.kindle || browser.playbook || browser.silk || browser[ "windows phone" ]) {
      browser.mobile = true;
    }

    // These are all considered desktop platforms, meaning they run a desktop browser
    if ( browser.cros || browser.mac || browser.linux || browser.win ) {
      browser.desktop = true;
    }

    // Chrome, Opera 15+ and Safari are webkit based browsers
    if ( browser.chrome || browser.opr || browser.safari ) {
      browser.webkit = true;
    }

    // IE11 has a new token so we will assign it msie to avoid breaking changes
    if ( browser.rv || browser.iemobile) {
      var ie = "msie";

      matched.browser = ie;
      browser[ie] = true;
    }

    // Edge is officially known as Microsoft Edge, so rewrite the key to match
    if ( browser.edge ) {
      delete browser.edge;
      var msedge = "msedge";

      matched.browser = msedge;
      browser[msedge] = true;
    }

    // Blackberry browsers are marked as Safari on BlackBerry
    if ( browser.safari && browser.blackberry ) {
      var blackberry = "blackberry";

      matched.browser = blackberry;
      browser[blackberry] = true;
    }

    // Playbook browsers are marked as Safari on Playbook
    if ( browser.safari && browser.playbook ) {
      var playbook = "playbook";

      matched.browser = playbook;
      browser[playbook] = true;
    }

    // BB10 is a newer OS version of BlackBerry
    if ( browser.bb ) {
      var bb = "blackberry";

      matched.browser = bb;
      browser[bb] = true;
    }

    // Opera 15+ are identified as opr
    if ( browser.opr ) {
      var opera = "opera";

      matched.browser = opera;
      browser[opera] = true;
    }

    // Stock Android browsers are marked as Safari on Android.
    if ( browser.safari && browser.android ) {
      var android = "android";

      matched.browser = android;
      browser[android] = true;
    }

    // Kindle browsers are marked as Safari on Kindle
    if ( browser.safari && browser.kindle ) {
      var kindle = "kindle";

      matched.browser = kindle;
      browser[kindle] = true;
    }

     // Kindle Silk browsers are marked as Safari on Kindle
    if ( browser.safari && browser.silk ) {
      var silk = "silk";

      matched.browser = silk;
      browser[silk] = true;
    }

    // Assign the name and platform variable
    browser.name = matched.browser;
    browser.platform = matched.platform;
    return browser;
  }

  // Run the matching process, also assign the function to the returned object
  // for manual, jQuery-free use if desired
  window.jQBrowser = uaMatch( window.navigator.userAgent );
  window.jQBrowser.uaMatch = uaMatch;

  // Only assign to jQuery.browser if jQuery is loaded
  if ( jQuery ) {
    jQuery.browser = window.jQBrowser;
  }

  return window.jQBrowser;
}));
