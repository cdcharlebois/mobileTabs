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

        breakpoint: null,
        smallNumber: null,
        largeNumber: null,
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
            var self = this;
            logger.debug(this.id + "._updateRendering");

            // get the wrapper and each item
            var ul = this.domNode.parentElement.querySelector('ul'),
                tabs = ul.children;

            // set the className on the wrapper
            ul.className += ' owl-carousel';

            // get the ul as the tab carousel
            var tabsOwl = $('.owl-carousel');
            // add event listeners to each item
            Array.from(tabs).forEach(function(item) {
                item.addEventListener('click', function() {
                    tabsOwl.owlCarousel('to', item.dataset.id * 1);
                    self._updateButtonVisibility(item.dataset.id * 1);
                })
            });

            // init carousel
            var brk = "" + this.breakpoint,
                responsive = {};

            responsive[brk] = { items: this.largeNumber };

            var options = {
                nav: true,
                center: true,
                items: this.smallNumber,
                loop: false,
                margin: 0,
                responsive: responsive
            };

            tabsOwl.owlCarousel(options);

            // set the icons
            $('.owl-next').addClass('glyphicon glyphicon-chevron-right')
            $('.owl-prev').addClass('glyphicon glyphicon-chevron-left')

            // move the nav buttons up appropriately
            var tabsHeight = $('.owl-stage-outer').height(),
                buttonContainerHeight = $('.owl-nav').height();
            $('.owl-nav').css({
                position: 'relative',
                top: -1 * (tabsHeight / 2 + buttonContainerHeight / 2) + 'px'
            });

            this._executeCallback(callback);
        },

        _updateButtonVisibility: function(id) {
            // console.log(`You clicked ${id}`)
            var sItems = this.smallNumber,
                lItems = this.largeNumber,
                active = $('.owl-item.active').length,
                allItems = $('.owl-item').length;
            // if the number of active tabs is less than the number that should be displayed, hide some buttons..?
            if (window.innerWidth > this.breakpoint && active < lItems || window.width < this.breakpoint && active < sItems) {
                if (id > allItems / 2) {
                    // if the one you click is > half, hide the next button    
                    $('.owl-next').addClass('invisible')
                    $('.owl-prev').removeClass('invisible')
                } else {
                    // if the one you click is < half, hide the prev button
                    $('.owl-prev').addClass('invisible')
                    $('.owl-next').removeClass('invisible')
                }
            } else {
                $('.owl-prev, .owl-next').removeClass('invisible');
            }


        },

        _executeCallback: function(cb) {
            if (cb && typeof cb === "function") {
                cb();
            }
        }
    });

});

require(["MobileTabs/widget/MobileTabs"]);