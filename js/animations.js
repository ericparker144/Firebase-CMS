// THIS FILE IS OPTIONAL
// Various functions to control web app animations

// Close mobile navigation ("Menu" dropdown) when a link clicked
$('.dropdown-menu li a').click(function () {
    $('.navbar-collapse').collapse('hide');
});

// jQuery to collapse the navbar on scroll
function collapseNavbar() {
    if ($(".navbar").offset().top > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
        $(".dropdown-menu").addClass("top-nav-collapse");
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
        $(".dropdown-menu").removeClass("top-nav-collapse");

    }
}
$(window).scroll(collapseNavbar);
$(document).ready(collapseNavbar);

$(function () {
    $('a.page-scroll').on('click', function (event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

$('body').on({
    'touchmove': function (e) {
        collapseNavbar();
        toTopButton();
    }
});

function toTopButton() {
    if ($(this).scrollTop() > 250) {
        if (!fixed) {
            fixed = true;
            // $('#to-top').css({position:'fixed', display:'block'});
            $('#to-top').show("slow", function () {
                $('#to-top').css({
                    position: 'fixed',
                    display: 'block'
                });
            });
        }
    } else {
        if (fixed) {
            fixed = false;
            $('#to-top').hide("slow", function () {
                $('#to-top').css({
                    display: 'none'
                });
            });
        }
    }
};

var fixed = false;
$(document).scroll(toTopButton);