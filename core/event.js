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
     * @param {Event}
     *            event
     */

    "use strict";

    /**
     * Konfigurationssetting
     * 
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
    initFct = function() {
    },

    /**
     * @memberOf GD.Core.Event
     * @private
     * @member initFct
     * @instance
     * @type {boolean}
     */
    readyBound = false,

    /**
     * @property {object} subscribers
     * @property {array} subscribers.any
     */
    subscribers = {
        any : []
    },

    /**
     * X-Browser: Fuegt einer Node node einen Eventhandler handler auf das Event
     * eventName hinzu. Ohne ON
     * 
     * @memberOf GD.Core.Event
     * @private
     * 
     * @param {Node}
     *            node DomNode, die mit dem Event erweitert wird
     * @param {Array}
     *            eventName Auf dieses Event wird reagiert
     * @param {GD.Core.Event.EventListener}
     *            handler Diese Funktion/Handler wird ausgefuehrt
     * @param {boolean}
     *            fCapture default false
     */
    nodeSubscribe = function(node, eventName, handler, fCapture) {
        for ( var i = 0, j = eventName.length; i < j; i++) {
            if (node.addEventListener) {
                node.addEventListener(eventName[i], handler, (fCapture));
            } else if (node.attachEvent) {
                node.attachEvent("on" + eventName[i], handler);
            } else {
                node["on" + eventName[i]] = eventName[i];
            }
        }
    },
    
    /**
     * X-Browser: Entfernt Event-listener auf node
     * 
     * @memberOf GD.Core.Event
     * @private
     * 
     * @param {Node} node DomNode, dessen Event entfernt wird
     * @param {Array}
     *            eventName Auf dieses Event wird reagiert
     * @param {GD.Core.Event.EventListener}
     *            handler Diese Funktion/Handler wird ausgefuehrt
     * @param {boolean}
     *            fCapture default false
     */
    nodeRemove = function(node, eventName, handler, fCapture) {
        for ( var i = 0, j = eventName.length; i < j; i++) {
            if (node.removeEventListener) {
                node.removeEventListener(eventName[i], listener, (fCapture));
            } else if (node.detachEvent) {
                node.detachEvent("on" + eventName[i], listener);
            } else {
                node["on" + eventName[i]] = null;
            }
        }
    },

    /**
     * globales Subscribing von Context auf ein Event
     * @memberOf GD.Core.Event
     * @private
     * 
     * @param {Object} Context fuer globalen Observer
     * @param {Array}
     *            eventName Auf dieses Event wird reagiert
     * @param {GD.Core.Event.EventListener}
     *            handler Diese Funktion/Handler wird ausgefuehrt
     * @param {boolean}
     *            fCapture default false
     */
    subscribe = function(context, eventName, handler) {
        handler = typeof handler === 'function' ? handler : context[handler];
        eventName = eventName || 'any';
        for ( var i = 0, j = eventName.length; i < j; i++) {
            if (typeof subscribers[eventName] === "undefined") {
                subscribers[eventName] = [];
            }
            subscribers[eventName].push({
                handler : handler,
                context : context || this
            });
        }
    },

    /**
     * entfernt globales event nach EventName, context und Handler
     * @memberOf GD.Core.Event
     * @private
     *
     * @param {Object} Context fuer globalen Observer
     * @param {string}
     *            eventName Auf dieses Event wird reagiert
     * @param {GD.Core.Event.EventListener}
     *            handler Diese Funktion/Handler wird ausgefuehrt
     */
    remove = function(context, eventName, handler){
        getSubscribers(eventName).forEach(function(element, index){
            if (element.handler === handler && element.context === context) {
                subscribers.splice(index, 1);
            }
        });
    },
    
    /**
     * Dispatches GD-Events
     *
     * @member GD.Core.Event
     * @private
     *
     * @param {String} eventName
     * @param {Object} context
     * @param {Object} eventInitDict
     */
    dispatch = function(eventName, context, eventInitDict){
        var event = new GD.Event(context, eventName,eventInitDict);

        getSubscribers(eventName).every(function(element){
            /* Call our observers, passing along arguments */
            element.handler.call(element.context, event);
            return event.canceled();
        });
        return true;
    },

    /**
     * getSubscribers: Gibt alle Subscriber zu Event zurueck
     * @memberOf GD.Core.Event
     * @private
     * 
     * @param {String} eventName Auf dieses Event wird reagiert
     * @returns {Array}
     */
    getSubscribers = function(eventName){
        var pubtype = eventName || 'any',
        res = subscribers[pubtype];
        if(Array.isArray(res)){
            return res;
        }else{
            GD.Core.Error.error("No subscriber found for "+eventName, res);
        }
    };
    
    /**
     * Event-custom-class
     * Event-ersatz-objekt beim Dispatching von
     * Nicht-DOM-Objekte
     * 
     * @memberOf GD
     * @constructor
     * @param {Object} source Ausloeser-objekt
     * @param {String} name Name/Typ des Events
     * @param {Object} details Objekt-mixin
     * @returns {GD.Event}
     */
    GD.Event = function(source, name, details){
        /**
         * Wird propagation sofort gestoppt?
         *
         * @memberOf GD.Event
         * @private
         * @instance
         * @type {boolean}
         */
        var canceled = false;
        
        /**
         * Ausloeser-objekt des Events
         *
         * @memberOf GD.Event
         * @instance
         * @type {Object}
         */
        this.target = source;
        
        /**
         * Ausloeser-objekt des Events
         *
         * @memberOf GD.Event
         * @instance
         * @type {Object}
         */
        this.currentTarget = source;
        
        /**
         * Event-name/type
         *
         * @memberOf GD.Event
         * @instance
         * @type {String}
         */
        this.type = name;

        /**
         * Ausloesungszeit als UTC-Timestamp
         *
         * @memberOf GD.Event
         * @instance
         * @type {Number}
         */
        this.timeStamp = Date.now();
        
        for(var i in details){
            if(details.hasOwnProperty(i)){
                this[i] = details[i];
            }
        }

        /**
         * Soll das Eventdispatching unterbrochen werden.
         *
         * @memberOf GD.Event
         * @function
         * @instance
         */
        this.stopImmediatePropagation = function(){
            canceled = true;
        };
        
        /**
         * intern:
         * Soll der Eventdispatching unterbrochen werden.
         *
         * @memberOf GD.Event
         * @private
         * @function
         * @instance
         */
        this.canceled = function(){
            return canceled;
        };
    };

    /**
     * X-Browser: Gibt source-element des
     * Events zurueck
     * 
     * @params {Event} e
     * @returns {Node}
     */
    GD.Event.source = function(e){
        return e.target || e.srcElement;
    };

    /**
     * X-Browser: Gibt das Event zurueck
     * 
     * @params {Event} e
     * @returns {Event}
     */
    GD.Event.event = function(e){
        return e || GD.global.event;
    };

    /**
     * Gibt source-element des
     * Events zurueck
     * 
     * @returns {Node}
     */
    GD.Event.source = function(e){
        return e.target || e.srcElement;
    };

    GD.NS('Core', 'Event', config).register();

    /**
     * fuegt einem Objekt die Faehigkeit "event" hinzu.
     * Das sind die Methoden: dbg, info, warn, dir, dirArr, trace
     * @memberOf GD.Core.Event
     * 
     * @param {Objekt} obj Objekt erhaelt event-Faehigkeit
     * @param {GD.Core.Fabric} fabric
     */
    GD.Core.Event.mixin = function(obj, fabric) {
        var uri = fabric.nsURI(true)+":";
        obj.eventDispatch = (function(obj, uri){
            return function(eventName, eventInitDict){
                dispatch(uri+eventName, obj, eventInitDict);
            };
        }(obj, uri)); 
        obj.eventDispatch.uri = uri;

        obj.eventRemove = (function(obj, uri){
            return function(eventName, handler, fCapture){
                GD.Core.Event.remove(obj, uri+eventName, handler, fCapture);
            };
        }(obj, uri));

        obj.eventAdd = (function(obj, uri){
            return function(eventName, handler, fCapture){
                GD.Core.Event.add(obj, uri+eventName, handler, fCapture);
            };
        }(obj, uri));

        obj.eventDelegate = (function(obj, uri){
            return function(eventName, handler, triggers, fCapture){
                GD.Core.Event.delegate(obj, uri+eventName, triggers, handler, fCapture);
            };
        }(obj, uri));
    };

    /**
     * X-Browser: Entfernt Event-listener
     * @memberOf GD.Core.Event
     * 
     * @param {Object|Node}
     *            context DomNode, die mit dem Event erweitert wird oder Context
     *            fuer globalen Observer
     * @param {(string|Array)}
     *            eventName Auf dieses Event wird reagiert
     * @param {GD.Core.Event.EventListener}
     *            handler Funktion die entfernt werden soll
     * @param {boolean}
     *            fCapture default false
     */
    GD.Core.Event.remove = function(context, eventName, handler, fCapture) {
        if (typeof eventName === "string") {
            eventName = [ eventName ];
        }
        if (context instanceof Node) {
            nodeRemove(context, eventName, handler, fCapture);
        } else {
            remove(context, eventName, handler);
        }
    };

    /**
     * X-Browser: Fuegt einer Node node einen Eventhandler handler auf das Event
     * eventName hinzu. Ohne ON
     * @memberOf GD.Core.Event
     * 
     * @param {Object|Node}
     *            context DomNode, die mit dem Event erweitert wird oder Context
     *            fuer globalen Observer
     * @param {(string|Array)}
     *            eventName Auf dieses Event wird reagiert
     * @param {GD.Core.Event.EventListener}
     *            handler Diese Funktion/Handler wird ausgefuehrt
     * @param {boolean}
     *            fCapture default false
     */
    GD.Core.Event.add = function(context, eventName, handler, fCapture) {
        if (typeof eventName === "string") {
            eventName = [ eventName ];
        }
        if (context instanceof Node) {
            nodeSubscribe(context, eventName, handler, fCapture);
        } else {
            subscribe(context, eventName, handler);
        }
    };

    /**
     * Dispatches Event
     * @memberOf GD.Core.Event
     *
     * @param {Object|Node} context
     * @param {String} eventName
     * @param {Object} eventInitDict
     * @returns {boolean}
     */
    GD.Core.Event.dispatch = function(context, eventName, eventInitDict){
        var event;
        if (context instanceof Node) {
            if (eventName instanceof Event) {
                event = eventName;
                GD.extend(eventInitDict, event, true, true);
            } else {
                event = new CustomEvent(eventName, { 'detail': eventInitDict });
            }
            return context.dispatchEvent(event);
        }
        return dispatch(eventName, context, eventInitDict);
    };

    /**
     * Events weiter-delegieren
     * @memberOf GD.Core.Event
     *
     * @param {Object|Node} context
     * @param {String} eventName
     * @param {Array} triggers Gibt alle Trigger zurueck
     * @param {Function} handler Eventhandler
     * @returns {boolean} fCapture
     */
    GD.Core.Event.delegate = function(context, eventName, triggers, handler, fCapture){
        GD.Core.Event.add(context, eventName, 
            function(e){
                var e = GD.Event.event(e),
                src = GD.Event.source(e),
                i = triggers.indexOf(GD.Event.source(e));
                if(i>-1){
                    return handler(e, src);
                }
            }, fCapture);
    };

    /**
     * X-Browser: Fuegt readyEvent hinzu
     * @memberOf GD.Core.Event
     * @see {@link http://api.jquery.com/ready/|jquery}
     * 
     * @param {GD.Core.Event.EventListener}
     *            handler Diese Funktion/Handler wird ausgefuehrt
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
     * X-Browser: ueberwacht das Mausrad. gibt erweitertes Event-objekt(+gd)
     * zurueck.
     * 
     * @memberOf GD.Core.Event
     * 
     * @param {HtmlElement}
     *            node
     * @param {GD.Core.Event.EventListener}
     *            handler
     * @returns {boolean}
     */
    GD.Core.Event.mouseWheel = function(node, handler) {
        GD.Core.Event.add(node, [ "DOMMouseScroll", "mousewheel" ], function(e) {
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
     * 
     * @memberOf GD
     * 
     * @param {boolean}
     *            IsInProduction
     */
    GD.INIT = function(IsInProduction) {
        var i = 0, _init = function() {
            if (!IsInProduction && GD.doc.body && GD.doc.body.onload) {
                // initFct = GD.doc.body.onload;
                // GD.doc.body.onload = null;
            }
            while (GD.doc.readyState === "complete") {
                // initFct();
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

    GD.Core.Event.ready(function() {
        GD.INIT(GD.isRunning('production'));
    });

    /* establish DESTROY lifecycle */
    GD.Core.Event.add(window, 'unload', function() {
        GD.runLifeCycle('destroy');
    });
})(GD);