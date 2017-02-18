/* jshint strict: true */
'use strict';

// Modal
(function() {
    var modal = {
        init: function() {
            this.cacheDom();
            this.bindEvents();
        },
        cacheDom: function() {
            this.$form = $('.modal__content form');
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
            // send form in model
            this.$form.on('submit', this.submitForm.bind(this));
        },
        showModal: function(event) {
            this.$displayed = $('#' + $(event.target).data('modal'));
            this.$displayed.show();

            $.fn.fullpage.setAllowScrolling(false);
        },
        closeModal: function(event) {
            if (
                this.$displayed !== false &&
                this.$displayed !== ''
            ) {
                this.$displayed.hide();
                this.$displayed = '';
            }

            $.fn.fullpage.setAllowScrolling(true);
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
        },
        submitForm: function(event) {
            event.preventDefault();

            var target = $(event.target);
            target.find('input[type="submit"]').val('Wysyłam...');

            $.post(target.attr('action'), target.serialize(), function(data) {
                target.parents('.modal__content').height('100%');
                target.html('<div class="column-12 text-center">' + data + '</div>');
            });
        }
    };
    modal.init();
})();