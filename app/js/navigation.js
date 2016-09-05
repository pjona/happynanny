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
        self.$mobileMenuWidth = '240px';
        self.sections = $('section').not('section section');
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
        closeHambuger();
        $('.header__menu--open .header__menu__item a').unbind('click');
    };

    // Hamburger
    var clickHambuger = function(event) {
        if (self.$hamburgerOpen === false) {
            showHambuger();
        } else {
            closeHambuger();
        }
    };

    var showHambuger = function() {
        self.$hamburgerOpen = true;

        self.$hamburger.addClass('header__hamburger--open');
        self.$menu.addClass('header__menu--open');
        self.$menu.animate({ left: '0' }, 600);
        self.$hamburger.animate({ left: self.$mobileMenuWidth }, 0);
        self.sections.css('opacity', '0.4');
        self.sections.animate({ left: self.$mobileMenuWidth }, 600);
        // close menu when user clicked some position of menu
        $('.header__menu--open .header__menu__item a').bind('click', clickMenuItem);
    };

    var closeHambuger = function() {
        self.$hamburgerOpen = false;

        self.$menu.animate({ left: '-' + self.$mobileMenuWidth }, 600);
        self.$hamburger.animate({ left: '15px' }, 0);
        self.sections.animate({ left: '0' }, 600, function() {
            self.$menu.removeClass('header__menu--open');
            self.sections.css('opacity', '1');
        });
        self.$hamburger.removeClass('header__hamburger--open');
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