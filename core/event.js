/* global GD */
/**
 * @file Erweitert GD-Core um Eventhandling
 */
(function(GD) {

    /**
     * Eventhandling
     * 
     * @name Event
     * @class
     * @memberOf GD.Core
     * @author Andreas Dyballa
     */

    /**
     * Event-listener
     *
     * @callback EventListener
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Event|MDN-Event}
     * @memberOf GD.Core.Event
     * @param {Event} event
     */

    "use strict";

    /**
     * Konfigurationssetting
     * @memberOf GD.Core.Event
     *
     * @property {object} config leer
     */
    var config = {},

    /**
     * @memberOf GD.Core.Event
     * @private
     * @function initFct
     */
    initFct = function(){},

    /**
     * @memberOf GD.Core.Event
     * @private
     * @member initFct
     * @instance
     * @type {boolean}
     */
    readyBound = false;

    GD.NS('Core', 'Event', config).register();

    /**
     * X-Browser: Entfernt Event-listener
     * @memberOf GD.Core.Event
     * 
     * @param {Node} node DomNode, die mit dem Event erweitert wird
     * @param {(string|Array)} eventName Auf dieses Event wird reagiert
     * @param {GD.Core.Event.EventListener} listener Funktion die entfernt werden soll
     */
    GD.Core.Event.remove = function(node, eventName, listener) {
        if (typeof eventName === "string") {
            eventName = [ eventName ];
        }
        for ( var i = 0, j = eventName.length; i < j; i++) {
            if (node.removeEventListener) {
                node.removeEventListener(eventName[i], listener, false);
            } else if (node.detachEvent) {
                node.detachEvent("on" + eventName[i], listener);
            } else {
                node["on" + eventName[i]] = null;
            }
        }
    };

    /**
     * X-Browser: Fuegt einer Node node einen Eventhandler handler auf das Event
     * eventName hinzu. Ohne ON
     * @memberOf GD.Core.Event
     * 
     * @param {Node} node DomNode, die mit dem Event erweitert wird
     * @param {(string|Array)} eventName Auf dieses Event wird reagiert
     * @param {GD.Core.Event.EventListener} handler Diese Funktion/Handler wird ausgefuehrt
     */
    GD.Core.Event.add = function(node, eventName, handler) {
        if (typeof eventName === "string") {
            eventName = [ eventName ];
        }
        for ( var i = 0, j = eventName.length; i < j; i++) {
            if (node.addEventListener) {
                node.addEventListener(eventName[i], handler, false);
            } else if (node.attachEvent) {
                node.attachEvent("on" + eventName[i], handler);
            } else {
                node["on" + eventName[i]] = eventName[i];
            }
        }
    };

    /**
     * X-Browser: Fuegt readyEvent hinzu
     * @memberOf GD.Core.Event
     * @see {@link http://api.jquery.com/ready/|jquery}
     * 
     * @param {GD.Core.Event.EventListener} handler Diese Funktion/Handler wird ausgefuehrt
     */
    GD.Core.Event.ready = function(readyFn) {
        var caller = null;
        if (readyBound) {
            return;
        }
        readyBound = true;

        // Mozilla, Opera and webkit nightlies currently support this event
        if (GD.doc.addEventListener) {
            caller = function() {
                GD.doc.removeEventListener("DOMContentLoaded", caller, false);
                readyFn();
            };
            // Use the handy event callback
            GD.Core.Event.add(GD.doc, "DOMContentLoaded", caller);

            // If IE event model is used
        } else if (GD.doc.attachEvent) {
            caller = function() {
                if (GD.doc.readyState === "complete") {
                    GD.doc.detachEvent("onreadystatechange", caller);
                    readyFn();
                }
            };
            // ensure firing before onload,
            // maybe late but safe also for iframes
            GD.Core.Event.add(GD.doc, "onreadystatechange", caller);
        }

        // A fallback to window.onload, that will always work
        GD.Core.Event.add(window, "load", readyFn);
    };

    /**
     * X-Browser: ueberwacht das Mausrad.
     * gibt erweitertes Event-objekt(+gd) zurueck.
     * @memberOf GD.Core.Event
     *
     * @param {HtmlElement} node
     * @param {GD.Core.Event.EventListener} handler
     * @returns {boolean}
     */
    GD.Core.Event.mouseWheel = function(node, handler){
        GD.Core.Event.add(node, ["DOMMouseScroll", "mousewheel"], function(e){
            var delta = 0;
            GD.Core.Dbg.dir(e);
            // normalize the delta
            if (e.wheelDelta) {
                // IE and Opera
                delta = e.wheelDelta / 90;
            } else if (e.detail) {
                // W3C
                delta = -e.detail / 3;
            }
            e.gd = {
                delta : delta
            };
            handler(e);
        });

        return true;
    };

    /**
     * Init-methode fuer das gesamte Framework
     * @memberOf GD
     *
     * @param {boolean} IsInProduction
     */
    GD.INIT = function(IsInProduction) {
        var i = 0, _init = function() {
            if (!IsInProduction && GD.doc.body && GD.doc.body.onload) {
//                initFct = GD.doc.body.onload;
//                GD.doc.body.onload = null;
            }
            while (GD.doc.readyState === "complete") {
//                initFct();
                GD.runLifeCycle('init');
                GD.runLifeCycle('prepareRun');
                GD.runLifeCycle('run');
                return true;
            }
            i++;
            if (i < 300) {
                window.setTimeout(_init, 100);
            } else {
                throw new Error("Timeout exceeded");
            }
        };

        _init();
    };

    if (GD.isRunning('production')) {
        GD.Core.Event.ready(function() {
            GD.INIT(true);
        });
    }

    /* establish DESTROY lifecycle */
    GD.Core.Event.add(window, 'unload', function() {
        GD.runLifeCycle('destroy');
    });
})(GD);