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
        self.$menuItemHasSubmenu = $('.header__menu__item--has-submenu');
        self.$menuSubmenu = $('.header__menu__submenu');
        self.$hamburger = $('.header__hamburger');
        self.$hash = '';
        self.$mobileMenuOpen = false;
        self.$mobileMenuWidth = '240px';
        self.$sections = $('section').not('section section');
    };

    var load = function() {
        self.$menuItems.mPageScroll2id({
            highlightClass: 'header__menu__item--highlighted',
            offset: 50,
            forceSingleHighlight: true
        });

        self.$hash = window.location.hash;
        if (self.$hash) {
            self.$menuItems.mPageScroll2id('scrollTo', self.$hash);
        }
    };

    var bindEvents = function() {
        // change menu style when scrolling
        self.$window.bind('scroll', scrollMenu);
        // change URL when strolling
        self.$window.bind('scroll', scrollUrl);
        // show/close menu when clicking hamburger on mobile
        self.$hamburger.bind('click', clickHambuger);
        // click/hover on menu with submenu
        self.$menuItemHasSubmenu.bind('click mouseenter', showSubmenu);
        self.$menuItemHasSubmenu.bind('mouseleave', hideSubmenu);
    };

    // Submenu
    var showSubmenu = function(event) {
        if (self.$menuSubmenu.hasClass('header__menu__submenu--show')) {
            return hideSubmenu();
        }

        self.$menuSubmenu.addClass('header__menu__submenu--show');
        self.$menuItemHasSubmenu.addClass('header__menu__item--has-open-submenu');
    };

    var hideSubmenu = function(event) {
        self.$menuSubmenu.removeClass('header__menu__submenu--show');
        self.$menuItemHasSubmenu.removeClass('header__menu__item--has-open-submenu');
    };

    // Hamburger
    var clickHambuger = function(event) {
        if (self.$mobileMenuOpen === false) {
            showMobileMenu();
        } else {
            closeMobileMenu();
        }
    };

    // Mobile menu
    var showMobileMenu = function() {
        self.$mobileMenuOpen = true;

        self.$hamburger.addClass('header__hamburger--open');
        self.$menu.addClass('header__menu--open');
        self.$menu.animate({ left: '0' }, 600);
        self.$hamburger.animate({ left: self.$mobileMenuWidth }, 0);
        self.$sections.addClass('opacity');
        self.$sections.animate({ left: self.$mobileMenuWidth }, 600);
        // close menu when user clicked some position of menu
        $('.header__menu--open .header__menu__item a').bind('click', closeMobileMenu);
    };

    var closeMobileMenu = function() {
        self.$mobileMenuOpen = false;

        self.$menu.animate({ left: '-' + self.$mobileMenuWidth }, 600);
        self.$hamburger.animate({ left: '15px' }, 0);
        self.$sections.animate({ left: '0' }, 600, function() {
            self.$menu.removeClass('header__menu--open');
            self.$sections.removeClass('opacity');
        });
        self.$hamburger.removeClass('header__hamburger--open');
        $('.header__menu--open .header__menu__item a').unbind('click');
    };

    // Scrolls
    var scrollMenu = function(event) {
        var origOffsetY = document.querySelector('.header__menu__item').offsetTop;

        if (self.$window.scrollTop() > origOffsetY) {
            self.$menu.addClass('header__menu--sticky');
        } else {
            self.$menu.removeClass('header__menu--sticky');
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