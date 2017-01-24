import { $, createEvent, ready } from '../util/index';

export default function (UIkit) {

    const DATA = UIkit.data;

    UIkit.prototype.$mount = function (el) {

        var name = this.$options.name;

        if (!el[DATA]) {
            el[DATA] = {};
            UIkit.elements.push(el);
        }

        if (el[DATA][name]) {
            console.warn(`Component "${name}" is already mounted on element: `, el);
            return;
        }

        el[DATA][name] = this;

        this.$el = $(el);

        this._initProps();

        this._callHook('init');

        this._initEvents();

        if (document.documentElement.contains(this.$el[0])) {
            this._callHook('connected');
        }

        ready(() => this._callReady());

    };

    UIkit.prototype.$emit = function (e) {
        this._callUpdate(e);
    };

    UIkit.prototype.$emitSync = function (e) {
        this._callUpdate(createEvent(e || 'update', true, false, {sync: true}));
    };

    UIkit.prototype.$update = function (e, parents) {
        UIkit.update(e, this.$el, parents);
    };

    UIkit.prototype.$updateSync = function (e, parents) {
        UIkit.update(createEvent(e || 'update', true, false, {sync: true}), this.$el, parents);
    };

    UIkit.prototype.$destroy = function (remove = false) {

        this._callHook('destroy');

        delete UIkit.instances[this._uid];

        var el = this.$options.el;

        if (!el || !el[DATA]) {
            return;
        }

        delete el[DATA][this.$options.name];

        if (!Object.keys(el[DATA]).length) {
            delete el[DATA];

            var index = UIkit.elements.indexOf(el);

            if (~index) {
                UIkit.elements.splice(index, 1);
            }
        }

        if (remove) {
            this.$el.remove();
        }
    };

}
