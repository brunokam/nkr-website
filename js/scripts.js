function changeProjectBackground(projectBackgrounds, projectsImg, i) {
    projectsImg.fadeOut(400, function() {
        projectsImg
            .css('background-image', 'url("/assets/img/' + projectBackgrounds[i] + '")')
            //.css('width', $('#projects').width() + 'px')
            //.css('height', $('#projects').height() + 'px')
            .fadeIn(400, function() {
                setTimeout(function () {
                    changeProjectBackground(projectBackgrounds, projectsImg, (i + 1) % projectBackgrounds.length)
                }, 5000);
            });
    });
}

$(document).on('ready', function() {
    // Activates scrollspy menu
    $('body').scrollspy({
        target: '#navbar-collapsible',
        offset: 50
    });

    // Smooth scrolling sections
    $('a[href*=#]:not([href=#])').on('click', function() {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top - 50
                }, 1000);

                return false;
            }
        }
    });

    // Newsfeed fade in/out
    $(window).scroll(function() {
        var threshold = 30;
        var coef = (threshold - $(window).scrollTop()) / threshold;
        var top = (coef - 1) * threshold * 1.5;
        $('.newsfeed, .under-constr').css({
            'opacity': coef,
            'top': (top <= 0 ? top + 51 : 51) + 'px'
        });
    });

    // Parses RSS
    $.getFeed({
        url: '/news/feed/',
        success: function (feed) {
            var n = 0;
            for (var i = 0; i < feed.items.length && n < 5; ++i) {
                var item = feed.items[i];

                if (item.title.length > 0) {
                    $('<p class="item"><a href="'
                    + item.link + '">'
                    + item.title + '</a><span>'
                    + item.updated.substr(0, item.updated.length - 9) + '</span></p>')
                        .appendTo('.newsfeed .items');

                    ++n;
                }
            }
        }
    });

    // Controls project slider
    var projectBackgrounds = [
        'projects1.jpg',
        'projects2.jpg'
    ];

    var projectsImg = $('#projects img.background');

    changeProjectBackground(projectBackgrounds, projectsImg, 0);
});
