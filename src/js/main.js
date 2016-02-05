+function () {
	var winWidth = $(window).width(),
		winHeight = $(window).height(),
		dom = {
			$topLine: $('.top-line')
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
			};
			$el.on('click', function () {
				plg.up();
			});
			return plg;
		})();



		// modals
		$('.modal-open').on('click', function (e) {
			e.preventDefault();
			$($(this).attr('href') || $(this).data('target')).addClass('opened');
			bodyOverflow.fixBody();
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

}();
