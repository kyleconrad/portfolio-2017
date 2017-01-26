$(document).ready(function() {
	var windowWidth = $(window).width(),
		windowHeight = $(window).height();
	var isMobile = navigator.userAgent.match(/mobile/i),
		isDesktop;



	// MOBILE / DESKTOP CLASSES + CHECKS
	if ( isMobile ) {
		$( 'body' ).addClass( 'mobile' );
	} else {
		isDesktop = true;
		$( 'body' ).addClass( 'desktop' );
	}



	// INITIALIZE FUNCTIONS
	responsiveLoad();
	valuePosition();
	widowControl();
	lazyLoading();



	// RESPONSIVE FUNCTIONS
	function responsiveLoad() {
		$( '.full .half' ).fitVids();

		$( 'p' ).flowtype({
			minimum : 700,
			maximum : 1800
		});
	}



	// NAV MENU
	var heroHeight = $( '.hero-main' ).height(),
		scrollPos = $( window ).scrollTop(),
		didScroll = false;

	window.onscroll = scrollYes;

	function scrollYes() {
		didScroll = true;
	}

	setInterval(function() {
	    if( didScroll ) {
	        didScroll = false;
	        heroHeight = $( '.hero-main' ).height();
	        scrollPos = $( window ).scrollTop();

	        if ( scrollPos > heroHeight ) {
	        	$( 'nav' ).addClass( 'visible' );
	        }
	        else {
	        	$( 'nav' ).removeClass( 'visible' );
	        }
	    }
	}, 100);




	// GET MOUSE POSITION
	function valuePosition() {
		var valueX,
			valueY;

		$( 'body' ).on( 'mousemove', function() {
			if ( isDesktop ) {
				valueX = ('00' + (event.pageX * 2671)).slice(-5);
				valueY = new Date(125251 * event.pageY).toISOString().substr(11, 8);

				$( '.data-x' ).text( valueX );
				$( '.data-y' ).text( valueY );
			}
		});
		// if ( isMobile && window.DeviceOrientationEvent ) {
		// 	window.addEventListener('deviceorientation', function(e) {
		// 		var horizontalTilt = e.gamma,
		// 			verticalTilt = e.beta;
		// 	});
		// }
	};



	// WIDOW CONTROL
	function widowControl() {
		windowWidth = $( window ).width();

		var widowElements = $( 'h1, h2, h3, h4, p, .caption' );

		widowElements.each(function() {
			$( this ).html($(this).html().replace(/&nbsp;/g, ' '));
		});

		if ( windowWidth > 640 ) {
			widowElements.each(function() {
			    $( this ).html($(this).html().replace(/\s((?=(([^\s<>]|<[^>]*>)+))\2)\s*$/,'&nbsp;$1'));
			});
		}
	}



	// LAZY LOADING
	function lazyLoading() {
		window.lazySizesConfig = window.lazySizesConfig || {};
		window.lazySizesConfig.srcAttr = 'data-original';
		window.lazySizesConfig.loadMode = 2;
		window.lazySizesConfig.expand = windowHeight * 3.5;
		window.lazySizesConfig.expFactor = 3;
		// document.addEventListener('lazybeforeunveil', function(e){
		// 	lazyPos = Math.round($(window).scrollTop());

		// 	$('.work-block').each(function(index) {
		// 		var lazySectionPos = Math.round($(this).offset().top);

		// 		if ( lazyPos >= lazySectionPos && lazyPos < (lazySectionPos + $(this).outerHeight()) ) {
		// 			$('.work-block').removeClass('active');
		// 			$(this).addClass('active');

		// 			thisElement = $(this),
		// 			thisElementPos = Math.round(thisElement.offset().top);

		// 			if ( !$('.work-block').last().hasClass('active') ) {
		// 				nextElement = $(this).next('.work-block');
		// 			}
		// 			if ( !$('.work-block').first().hasClass('active') ) {
		// 				prevElement = $(this).prev('.work-block');
		// 			}
		// 		}
		// 	});
		// });

		$( '.video-load' ).lazyload({
			threshold: windowHeight * 2.25,
			load: function(element){
				$( '.full, .half' ).fitVids();
			}
		});
	}



	// SECTION HEIGHTS FOR LAZY LOADING & ACTIVE ELEMENT ON LOAD
	var loadScrollPos = 0;
	var initialPos = 0,
		scrollDown = false,
		scrollUp = false;
	var thisElement = $('.work-block.active'),
		prevElement = $('.work-block.active').prev('.work-block'),
		nextElement = $('.work-block.active').next('.work-block'),
		thisElementPos,
		prevElementPos,
		nextElementPos;


	// ACTIVE SECTIONS
	$('.work-block').first().addClass('active');
	
	$(window).on('load', function(){
		initialPos = Math.round($(window).scrollTop());

		if ( loadScrollPos >= $('#about').offset().top ) {
			$('.work-block').removeClass('active');
			$('.work-block').last().addClass('active');
		}

		$('.work-block').each(function(index) {
			var thisSectionPos = Math.round($(this).offset().top);

			if ( initialPos >= thisSectionPos && initialPos < (thisSectionPos + $(this).outerHeight()) ) {
				$('.work-block').removeClass('active');
				$(this).addClass('active');

				thisElement = $(this),
				thisElementPos = Math.round(thisElement.offset().top);

				if ( !$('.work-block').last().hasClass('active') ) {
					nextElement = $(this).next('.work-block');
				}
				if ( !$('.work-block').first().hasClass('active') ) {
					prevElement = $(this).prev('.work-block');
				}
			}
		});

		// NAV ELEMENTS
		var aboutOffset = $('#about').offset();
		if ( $('.work-block').first().hasClass('active') ) {
			$('.nav-previous').addClass('inactive');
		} else if ( $('.work-block').last().hasClass('active') || windowScroll >= aboutOffset.top ) {
			$('.nav-next').addClass('inactive');
			$('.work-block').last().addClass('active');
		} else {
			$('.nav-link').removeClass('inactive');
		}
	});


	// SCROLLING
	var windowScroll,
		currentlyScrolling = false;

	$(window).on('scroll', function(){
		windowScroll = Math.round($(window).scrollTop());
		initialPos = windowScroll;

		// DETERMINE ACTIVE ELEMENT BASED ON SCROLL POSITION
		thisElement = $('.work-block.active');
		thisElementPos = Math.round(thisElement.offset().top);

		if ( !$('.work-block').last().hasClass('active') ) {
			nextElement = thisElement.next('.work-block');
		}
		if ( !$('.work-block').first().hasClass('active') ) {
			prevElement = thisElement.prev('.work-block');
		}

		if ( windowScroll >= thisElementPos + thisElement.outerHeight() && !$('.work-block').last().hasClass('active') ) {
			$('.work-block').removeClass('active');
			nextElement.addClass('active');
		}
		if ( windowScroll <= thisElementPos && !$('.work-block').first().hasClass('active') ) {
			$('.work-block').removeClass('active');
			prevElement.addClass('active');
		}

		// NAV ELEMENTS
		var aboutOffset = $('#about').offset();
		if ( $('.work-block').first().hasClass('active') ) {
			$('.nav-previous').addClass('inactive');
		} else if ( $('.work-block').last().hasClass('active') || windowScroll >= aboutOffset.top ) {
			$('.nav-next').addClass('inactive');
		} else {
			$('.nav-link').removeClass('inactive');
		}
	});


	// NAV
	$('#nav-link-home').on('click', function(){
		if ( !currentlyScrolling ) {
			var timing = windowScroll / 2;
			$('.hero-main').velocity('scroll', {
				duration: timing,
				easing: 'swing',
				mobileHA: false,
				begin: function() {
					currentlyScrolling = true;
				},
				complete: function() {
					currentlyScrolling = false;
				}
			});
		}

		return false;
	});

	$('#nav-previous').on('click', function(){
		if ( !$(this).hasClass('inactive') && !currentlyScrolling ) {
			thisElement = $('.work-block.active');
			prevElement = thisElement.prev('.work-block'),
			prevElementPos = Math.round(prevElement.offset().top);

			var timing = (windowScroll - prevElementPos) / 1.5;

			$(prevElement).velocity('scroll', {
				duration: timing,
				easing: 'swing',
				offset: 2,
				mobileHA: false,
				begin: function() {
					currentlyScrolling = true;
				},
				complete: function() {
					currentlyScrolling = false;
				}
			});
		}

		return false;
	});
	$('#nav-next').on('click', function(){
		if ( !$(this).hasClass('inactive') && !currentlyScrolling ) {
			thisElement = $('.work-block.active');
			nextElement = thisElement.next('.work-block'),
			nextElementPos = Math.round(nextElement.offset().top);

			var timing = (nextElementPos - windowScroll) / 1.5;

			$(nextElement).velocity('scroll', {
				duration: timing,
				easing: 'swing',
				offset: 2,
				mobileHA: false,
				begin: function() {
					currentlyScrolling = true;
				},
				complete: function() {
					currentlyScrolling = false;
				}
			});
		}

		return false;
	});
});