/* jshint strict: true */
'use strict';

// Revealing module pattern
var nav = (function() {
    var self;

    // Submenu
    var hideSubmenu = function(event) {
        self.$menuSubmenu.removeClass('header__menu__submenu--show');
        self.$menuItemHasSubmenu.removeClass('header__menu__item--has-open-submenu');
    };

    var showSubmenu = function(event) {
        if (self.$menuSubmenu.hasClass('header__menu__submenu--show')) {
            return hideSubmenu();
        }

        self.$menuSubmenu.addClass('header__menu__submenu--show');
        self.$menuItemHasSubmenu.addClass('header__menu__item--has-open-submenu');
    };

    // Bold submenu with active item
    var boldSubMenu = function(index, nextIndex, direction) {
        var menuAnchor = $('#section' + (nextIndex-1)).attr('class').split(' ')[0];
        var activeItemInSubmenu = $('li[data-menuanchor="' + menuAnchor + '"]').parents('.header__menu__submenu');

        self.$menuSubmenu.prev('span').removeClass('highlighted');

        if(activeItemInSubmenu.length !== 0) {
            activeItemInSubmenu.prev('span').addClass('highlighted');
        }
    };

    // Mobile menu
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

    // Hamburger
    var clickHambuger = function(event) {
        if (self.$mobileMenuOpen === false) {
            showMobileMenu();
        } else {
            closeMobileMenu();
        }
    };

    var bindEvents = function() {
        // Show/close menu when clicking hamburger on mobile
        self.$hamburger.bind('click', clickHambuger);
        // Click/hover on menu with submenu
        self.$menuItemHasSubmenu.bind('click mouseenter', showSubmenu);
        self.$menuItemHasSubmenu.bind('mouseleave', hideSubmenu);
        // Disable auto scrolling on mobile
        self.$window.bind('resize', responsive);
    };

    // Responsive
    var responsive = function() {
        var autoScrolling = true;
        if (self.$window.width() < 800 && self.$window.height() < 600) {
            autoScrolling = false;
        }

        $.fn.fullpage.setAutoScrolling(autoScrolling);
    };

    var load = function() {
        $('#fullpage').fullpage({
            sectionSelector: 'section',
            anchors: [
                'first', 'why', 'mission',
                'team', 'security', 'partners',
                'offer', 'english-nanny', 'price',
                'carrier', 'contact'
            ],
            responsiveHeight: 600,
            responsiveWidth: 800,
            bigSectionsDestination: 'top',
            menu: '.header__menu',
            onLeave: boldSubMenu
        });

        responsive();
    };

    var cacheDom = function() {
        self.$window = $(window);
        self.$menu = $('.header__menu');
        self.$menuItemHasSubmenu = $('.header__menu__item--has-submenu');
        self.$menuSubmenu = $('.header__menu__submenu');
        self.$hamburger = $('.header__hamburger');
        self.$hash = '';
        self.$mobileMenuOpen = false;
        self.$mobileMenuWidth = '240px';
        self.$sections = $('section').not('section section');
    };

    var init = function() {
        self = this;
        cacheDom();
        load();
        bindEvents();
    };

    return {
        init: init
    };
})();
nav.init();