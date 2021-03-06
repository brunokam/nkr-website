function changeProjectBackground(projectBackgrounds, projectImgs, i, bgId) {
    projectImgs[bgId].css('z-index', 1);
    projectImgs[(bgId + 1) % 2]
        .css('z-index', 0)
        .css({
            'background-image': 'url("/assets/img/' + projectBackgrounds[i] + '")'
        })
        .show();

    projectImgs[bgId].fadeOut(600, function () {
        setTimeout(function () {
            changeProjectBackground(projectBackgrounds, projectImgs, (i + 1) % projectBackgrounds.length, (bgId + 1) % 2)
        }, 5000);
    });
}

// Adjusts news iframe height to its content height
function setIframeHeight() {
    var iframe = document.getElementById('news-frame');

    if (iframe) {
        iframe.height = '';
        iframe.height = iframe.contentWindow.document.body.scrollHeight + 'px';
    }
}

// Clears hash
function clearHash() {
    var href = location.href;
    if (href.indexOf('#') > 0) {
        location.href = href.substring(0, href.indexOf('#'));
    }
}

// Loads gallery
function loadGallery(id, fullName, imgCount) {
    var column = $(
        '<div class="col-xs-12 gallery-body">' +
        '<p class="lead">' + fullName + '</p>' +
        '</div>');
    var buttonBack = $(
        '<button class="gallery-back">' +
        '<i class="fa fa-chevron-left fa-2x"></i>' +
        'Powrót do widoku galerii' +
        '</button>'
    );
    var imageContainer = $(
        '<div class="' + id + '"></div>'
    );

    buttonBack.on('click', function () {
        clearHash();
        setupGallery();
    });

    $('.gallery-link').parent().detach();

    $(this).detach();
    buttonBack.appendTo(column);
    imageContainer.appendTo(column);
    column.appendTo('#gallery');

    for (var i = 1; i <= imgCount; ++i) {
        var a = '<a href="/assets/img/' + id + '/' + i + '.jpg">' +
            '<img src="/assets/img/' + id + '/' + i + '.jpg"></a>';
        imageContainer.append(a);
    }

    imageContainer.justifiedGallery();
    location.hash = id;
}

// Setups gallery
function setupGallery() {
    var galleries = {
        'general': {
            fullName: 'Ogólne',
            imgs: 34
        },
        'krakrobot2014': {
            fullName: 'KrakRobot 2014',
            imgs: 50
        },
        'dniwydzialu': {
            fullName: 'Dni Wydziału',
            imgs: 27
        }
    };

    if (location.hash.length > 0) {
        var galleryId = location.hash.substring(1);
        var galleryFullName = galleries[galleryId].fullName,
            galleryImgCount = galleries[galleryId].imgs;

        loadGallery(galleryId, galleryFullName, galleryImgCount);
        return;
    }

    clearHash();
    $('.gallery-body').detach();
    $('.gallery-link').parent().detach();

    for (var galleryId in galleries) {
        var galleryFullName = galleries[galleryId].fullName,
            galleryImgCount = galleries[galleryId].imgs;

        var galleryLink = $(
            '<div class="col-xs-12 col-sm-6 col-lg-4 text-center">' +
            '<div class="gallery-link">' +
            '<img src="/assets/img/' + galleryId + '/link.jpg">' +
            '<p class="lead text-center">' +
            galleryFullName +
            '</p>' +
            '</div>' +
            '</div>'
        );

        galleryLink
            .appendTo('#gallery')
            .on('click', loadGallery.bind(galleryLink, galleryId, galleryFullName, galleryImgCount));
    }
}

$(document).on('ready', function () {
    // Activates scrollspy menu
    $('body').scrollspy({
        target: '#navbar-collapsible',
        offset: 50
    });

    // Smooth scrolling sections
    $('a[href*=#]:not([href=#])').on('click', function () {
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
    $(window).scroll(function () {
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
            for (var i = 0; i < feed.items.length && n < 3; ++i) {
                var item = feed.items[i];

                if (item.title.length > 0) {
                    if (item.title.length > 28) {
                        item.title = item.title.substr(0, 28) + '...';
                    }

                    $('<p class="item"><a href="'
                    + '/news.html#' + item.link + '">'
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
        'projects2.jpg',
        'projects3.jpg',
        'projects4.jpg'
    ];

    var randomBackground = Math.floor((Math.random() * projectBackgrounds.length) + 1);

    var projectImgs = [$('#projects #background0'), $('#projects #background1')];

    projectImgs[0].css('background-image', 'url("/assets/img/' + projectBackgrounds[0] + '")');
    changeProjectBackground(projectBackgrounds, projectImgs, randomBackground, 0);
});
