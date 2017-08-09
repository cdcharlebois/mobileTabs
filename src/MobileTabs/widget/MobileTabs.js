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
        TabsClass: null,

        ul: null,
        tabs: null,
        instanceContainerSelector: null,
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

            this._setupDOM();

            this._initializeOwlCarousel(this.instanceContainerSelector);

            // add the no swiping class
            $('.owl-stage-outer').addClass('swiper-no-swiping')
            $(this.ul).css({ height: $(this.ul).height() - $('.owl-nav').height() + 'px' })

            if (this.TabsClass) {
                $('.owl-stage-outer').addClass(this.TabsClass)
            }


            this._executeCallback(callback);
        },

        _initializeOwlCarousel: function(selector) {
            // get the ul as the tab carousel
            var $carousel = $(selector);
            // add event listeners to each item
            Array.from(this.tabs).forEach(lang.hitch(this, function(item) {
                this.connect(item, 'onclick', lang.hitch(this, function() {
                    var clicked = Array.from(item.parentElement.parentElement.children).indexOf(item.parentElement);
                    // console.log(`you clicked  ${clicked}`);
                    $carousel.owlCarousel('to', clicked);
                    this._updateButtonVisibility(clicked, selector);
                }))
            }));

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
                responsive: responsive,
                onDrag: function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            };

            $carousel.owlCarousel(options);

            // set the icons
            $carousel.find('.owl-next').addClass('glyphicon glyphicon-chevron-right')
            $carousel.find('.owl-prev').addClass('glyphicon glyphicon-chevron-left')

            // move the nav buttons up appropriately
            var tabsHeight = $carousel.find('.owl-stage-outer').height(),
                buttonContainerHeight = $carousel.find('.owl-nav').height();
            $carousel.find('.owl-nav').css({
                position: 'relative',
                top: -1 * (tabsHeight / 2 + buttonContainerHeight / 2) + 'px'
            });
        },

        _setupDOM: function() {
            // get the wrapper and each item
            this.ul = this.domNode.parentElement.querySelector('ul');
            this.tabs = this.ul.children;
            this.instanceContainerSelector = '.owl-carousel.' + this.id;

            // set the className on the wrapper
            this.ul.className += this.instanceContainerSelector.replace(/\./g, ' ');
        },

        _updateButtonVisibility: function(id, selector) {
            // console.log(`You clicked ${id}`)
            var $carousel = $(selector),
                sItems = this.smallNumber,
                lItems = this.largeNumber,
                active = $carousel.find('.owl-item.active').length,
                allItems = $carousel.find('.owl-item').length;
            // if the number of active tabs is less than the number that should be displayed, hide some buttons..?
            if (window.innerWidth > this.breakpoint && active < lItems || window.innerWidth < this.breakpoint && active < sItems) {
                if (id > allItems / 2) {
                    // if the one you click is > half, hide the next button    
                    $carousel.find('.owl-next').addClass('invisible')
                    $carousel.find('.owl-prev').removeClass('invisible')
                } else {
                    // if the one you click is < half, hide the prev button
                    $carousel.find('.owl-prev').addClass('invisible')
                    $carousel.find('.owl-next').removeClass('invisible')
                }
            } else {
                $carousel.find('.owl-prev, .owl-next').removeClass('invisible');
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