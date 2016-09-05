/* jshint strict: true */
'use strict';

// Revealing module pattern
var nav = (function() {
    var self;

    var init = function() {
        self = this;
        cacheDom();
        load();
        bindEvents();
    };

    var cacheDom = function() {
        self.$window = $(window);
        self.$menu = $('.header__menu');
        self.$menuItems = $('.header__menu__item a');
        self.$hamburger = $('.header__hamburger');
        self.$hash = '';
        self.$hamburgerOpen = false;
    };

    var load = function() {
        self.$menuItems.mPageScroll2id({
            highlightClass: 'header__menu__item--highlighted',
            offset: 50,
            forceSingleHighlight: true
        });

        self.$hash = window.location.hash;
        if (self.$hash) {
            $('a[href="' + self.$hash + '"]').click();
        }
    };

    var bindEvents = function() {
        // change menu style when scrolling
        self.$window.bind('scroll', scrollMenu);
        // change URL when strolling
        self.$window.bind('scroll', scrollUrl);
        // show/close menu when clicking hamburger on mobile
        self.$hamburger.bind('click', clickHambuger);
    };

    // Clicks
    var clickMenuItem = function(event) {
        self.$hamburger.click();
        $('.header__menu--open .header__menu__item a').unbind('click');
    };

    var clickHambuger = function(event) {
        var hamburger = $(event.target).closest('.header__hamburger');
        var sections = $('section').not('section section');
        var width = '240px';

        if (self.$hamburgerOpen === false) {
            hamburger.addClass('header__hamburger--open');
            self.$menu.addClass('header__menu--open');
            self.$menu.animate({ left: '0' }, 600);
            self.$hamburger.animate({ left: width }, 0);
            sections.css('opacity', '0.4');
            sections.animate({ left: width }, 600);
            self.$hamburgerOpen = true;
            // close menu when user clicked some position of menu
            $('.header__menu--open .header__menu__item a').bind('click', clickMenuItem);
        } else {
            self.$menu.animate({ left: '-' + width }, 600);
            self.$hamburger.animate({ left: '15px' }, 0);
            sections.animate({ left: '0' }, 600, function() {
                self.$menu.removeClass('header__menu--open');
                sections.css('opacity', '1');
            });
            self.$hamburgerOpen = false;
            hamburger.removeClass('header__hamburger--open');
        }
    };

    // Scrolls
    var scrollMenu = function(event) {
        if (self.$window.scrollTop() > 40) {
            self.$menu.addClass('header__menu--scroll');
        } else {
            self.$menu.removeClass('header__menu--scroll');
        }
    };

    var scrollUrl = function(event) {
        var hash = self.$menuItems.closest('.header__menu__item--highlighted').attr('href');
        if (typeof hash === 'undefined') {
            hash = '#';
        }

        if (self.$hash !== hash) {
            self.$hash = hash;
            window.history.pushState('', '', hash);                
        }
    };

    return {
        init: init
    };
})();
nav.init();