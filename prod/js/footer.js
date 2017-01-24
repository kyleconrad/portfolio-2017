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
});