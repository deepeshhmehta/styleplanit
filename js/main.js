$(document).ready(function(){
    // Mobile menu toggle
    $('.menu-toggle').on('click', function(){
        var expanded = $(this).attr('aria-expanded') === 'true';
        $(this).attr('aria-expanded', String(!expanded));
        $('.nav-links').toggleClass('active');
    });

    // close on nav click
    $('.nav-links a').on('click', function(){
        $('.nav-links').removeClass('active');
        $('.menu-toggle').attr('aria-expanded', 'false');
    });

    // Hero slideshow for mobile
    function heroSlideshow() {
        var heroBgs = $('.hero-bg');
        var current = 0;
        if (heroBgs.length === 0) return;

        // Initial state
        heroBgs.css('opacity', '0').css('transition', 'opacity 1s ease-in-out');
        heroBgs.eq(current).css('opacity', '1').addClass('active');

        setInterval(function(){
            heroBgs.eq(current).css('opacity', '0').removeClass('active');
            current = (current + 1) % heroBgs.length;
            heroBgs.eq(current).css('opacity', '1').addClass('active');
        }, 2000);
    }

    if (window.innerWidth <= 768) {
        heroSlideshow();
    }
});
