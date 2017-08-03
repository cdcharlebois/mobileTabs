define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",

    "mxui/dom",
    "dojo/dom",
    "dojo/dom-prop",
    "dojo/dom-geometry",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/text",
    "dojo/html",
    "dojo/_base/event",
    "MobileTabs/lib/jquery-1.11.2",
    "MobileTabs/lib/owl"


], function(declare, _WidgetBase, dom, dojoDom, dojoProp, dojoGeometry, dojoClass, dojoStyle, dojoConstruct, dojoArray, lang, dojoText, dojoHtml, dojoEvent, _jQuery, _owl) {
    "use strict";

    var $ = _jQuery.noConflict(true);
    window.myjq = $;
    return declare("MobileTabs.widget.MobileTabs", [_WidgetBase], {


        // Internal variables.
        _handles: null,
        _contextObj: null,

        constructor: function() {
            this._handles = [];
        },

        postCreate: function() {
            var self = this;
            logger.debug(this.id + ".postCreate");
            // console.log(_owl);

        },

        update: function(obj, callback) {
            logger.debug(this.id + ".update");


            this._contextObj = obj;
            this._updateRendering(callback);
        },

        resize: function(box) {
            logger.debug(this.id + ".resize");
        },

        uninitialize: function() {
            logger.debug(this.id + ".uninitialize");
        },

        _updateRendering: function(callback) {
            logger.debug(this.id + "._updateRendering");

            var ul = this.domNode.parentElement.querySelector('ul'),
                tabs = ul.children;

            ul.className += ' owl-carousel';

            var tabsOwl = $('.owl-carousel');
            Array.from(tabs).forEach(function(item) {
                item.addEventListener('click', function() {
                    tabsOwl.owlCarousel('to', item.dataset.id * 1);
                })
            });

            tabsOwl.owlCarousel({
                nav: false,
                center: true,
                items: 3,
                loop: false,
                margin: 10,
                responsive: {
                    900: {
                        items: 5
                    }
                }
            });

            this._executeCallback(callback);
        },

        _executeCallback: function(cb) {
            if (cb && typeof cb === "function") {
                cb();
            }
        }
    });

});

require(["MobileTabs/widget/MobileTabs"]);