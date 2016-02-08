import $ from 'jquery';
import {isInView} from '../util/index';

export default function (UIkit) {

    UIkit.component('scrollspy', {

        props: {
            initCls: String,
            cls: String,
            target: String,
            offsetTop: Number,
            offsetLeft: Number,
            repeat: Boolean,
            delay: Number
        },

        defaults: {
            initCls: 'uk-scrollspy-init-inview',
            cls: 'uk-scrollspy-inview',
            target: false,
            offsetTop: 0,
            offsetLeft: 0,
            repeat: false,
            delay: 0,
            inViewClass: 'uk-scrollspy-inview'
        },

        ready() {
            this.elements = this.target ? this.$el.find(this.target) : this.$el;
            this.check();
        },

        update: {

            handler: 'check',
            on: ['scrolling', 'load', 'resize', 'orientationchange']

        },

        methods: {

            check() {

                var index = this.elements.length === 1 ? 1 : 0;

                this.elements.each((i, el) => {

                    var $el = $(el);

                    if (!el.__uk_scrollspy) {
                        el.__uk_scrollspy = {toggles: ($el.attr('cls') ? $el.attr('cls') : this.cls).split(',')};
                    }

                    var data = el.__uk_scrollspy;

                    if (isInView(el, this.offsetTop, this.offsetLeft)) {

                        if (!data.inview && !data.timer) {

                            if (!$el.hasClass(this.initCls)) {
                                $el.addClass(this.initCls).trigger('init'); // TODO rename event?
                            }

                            data.timer = setTimeout(() => {

                                $el.addClass(this.inViewClass).toggleClass(data.toggles[0]).trigger('inview'); // TODO rename event?

                                data.inview = true;
                                delete data.timer;

                            }, this.delay * index);

                            index++;
                        }

                    } else {

                        if (data.inview && this.repeat) {

                            if (data.timer) {
                                clearTimeout(data.timer);
                                delete data.timer;
                            }

                            $el.removeClass(this.inViewClass).toggleClass(data.toggles[0]).trigger('outview'); // TODO rename event?
                            data.inview = false;
                        }

                    }

                    data.toggles.reverse();
                });

            }

        }

    });

}
