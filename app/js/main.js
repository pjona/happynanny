/* jshint strict: true */
'use strict';

// Navigation
(function() {
    var nav = {
        init: function() {
            this.cacheDom();
            this.load();
            this.bindEvents();
        },
        cacheDom: function() {
            this.$window = $(window);
            this.$menuItems = $('.header__menu__item a');
            this.$hash = '';
        },
        load: function() {
            this.$menuItems.mPageScroll2id({
                highlightClass: 'header__menu__item--highlighted',
                offset: 50,
                forceSingleHighlight: true
            });

            this.$hash = window.location.hash;
            console.log('no' + this.$hash);
            if (this.$hash) {
                $('a[href="' + this.$hash + '"]').click();
            }
        },
        bindEvents: function() {
            // change menu style when scrolling
            this.$window.bind('scroll', this.scrollMenu.bind(this));
            // change URL when strolling
            this.$window.bind('scroll', this.scrollUrl.bind(this));
        },
        scrollMenu: function(event) {
            if (this.$window.scrollTop() > 40) {
                $('.header__menu').addClass('header__menu--scroll');
            } else {
                $('.header__menu').removeClass('header__menu--scroll');
            }
        },
        scrollUrl: function(event) {
            var hash = this.$menuItems.closest('.header__menu__item--highlighted').attr('href');
            if (typeof hash === 'undefined') {
                hash = '#';
            }

            if (this.$hash !== hash) {
                this.$hash = hash;
                window.history.pushState('', '', hash);                
            }
        }
    };
    nav.init();
})();

// Modal
(function() {
    var modal = {
        init: function() {
            this.cacheDom();
            this.bindEvents();
        },
        cacheDom: function() {
            this.$click = $('.modal__click');
            this.$close = $('.modal__close');
            this.$displayed = false;
        },
        bindEvents: function() {
             // show modal
            this.$click.click(this.showModal.bind(this));
            // close modal by cross
            this.$close.click(this.closeModal.bind(this));
            // close modal by clicking outsite of modal
            $(window).click(this.windowsCloseModal.bind(this));
            // close modal by esc key
            $(document).keyup(this.escCloseModal.bind(this));
        },
        showModal: function(event) {
            this.$displayed = $('#' + $(event.target).data('modal'));
            this.$displayed.show();
        },
        closeModal: function(event) {
            if(this.$displayed !== false) {
                this.$displayed.hide();
                this.$displayed = '';
            }
        },
        windowsCloseModal: function(event) {
            if (
                ! $(event.target).parents('.modal__content').length &&
                ! $('#' + $(event.target).data('modal')).length
            ) {
                this.closeModal();
            }
        },
        escCloseModal: function(event) {
            if (event.keyCode === 27) {
                this.closeModal();
            }
        }
    };
    modal.init();
})();