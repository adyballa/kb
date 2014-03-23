/**
 * @file Diese Datei ist fuer die grundsaetzliche Kompatibilitaet zwischen 
 * verschiedenen Browsern zustaendig.
 */
/**
 * Sichert Kompatiblitaet ab
 */
if (!Array.isArray) {
    /**
     * Erweitert Array nach Kagnax
     * 
     * @memberOf Array
     * 
     * @param {Array}
     *            vArg zu pruefendes Objekt.
     * @return {boolean}
     */
    Array.isArray = function(vArg) {
        'use strict';
        return Object.prototype.toString.call(vArg) === '[object Array]';
    };
}

if (!Date.now) {
    Date.now = function() {
        return new Date().getTime();
    };
}

if (!("CustomEvent" in window)) {
    function CustomEvent(event, params) {
        params = params || {
            bubbles : false,
            cancelable : false,
            detail : undefined
        };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }
    ;

    CustomEvent.prototype = window.CustomEvent.prototype;

    window.CustomEvent = CustomEvent;
}

if (!Object.getOwnPropertyNames) {
    /**
     * Erweitert Object (Ecma5)
     * 
     * @memberOf Object
     * 
     * @param {Object}
     *            obj
     */
    Object.getOwnPropertyNames = function(obj) {
        "use strict";

        var res = [ 'constructor' ];
        for ( var i in obj) {
            res.push(i);
        }
        return res;
    };
}

if (!Object.create) {
    /**
     * Erweitert Object nach Kagnax
     * 
     * @memberOf Object
     * 
     * @param {Object}
     *            o Parent-object.
     * @return {function():Object}
     */
    Object.create = function(o) {
        'use strict';
        function F() {
        }
        F.prototype = o;
        var res = new F(), i = 0;
        if (arguments.length > 1) {
            /* Erweiterung v. adyballa */
            for (i in arguments[1]) {
                res[i] = ('value' in arguments[1][i]) ? arguments[1][i].value : null;
            }
        }
        return res;
    };
}

// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.com/#x15.4.4.18
if (!Array.prototype.forEach) {

    /**
     * @memberOf Array.prototype
     * @param {function()}
     *            callback
     * @param {Object}
     *            thisArg
     */
    Array.prototype.forEach = function forEach(callback, thisArg) {
        'use strict';
        var T, k;

        if (this === null) {
            throw new TypeError('this is null or not defined');
        }

        // 1. Let O be the result of calling ToObject passing the |this| value
        // as the argument.
        var O = Object(this);

        // 2. Let lenValue be the result of calling the Get internal method of O
        // with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = O.length >>> 0; // Hack to convert O.length to a UInt32

        // 4. If IsCallable(callback) is false, throw a TypeError exception.
        // See: http://es5.github.com/#x9.11
        if ({}.toString.call(callback) !== '[object Function]') {
            throw new TypeError(callback + ' is not a function');
        }

        // 5. If thisArg was supplied, let T be thisArg; else let T be
        // undefined.
        if (thisArg) {
            T = thisArg;
        }

        // 6. Let k be 0
        k = 0;

        // 7. Repeat, while k < len
        while (k < len) {

            var kValue;

            // a. Let Pk be ToString(k).
            // This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the HasProperty internal
            // method of O with argument Pk.
            // This step can be combined with c
            // c. If kPresent is true, then
            if (Object.prototype.hasOwnProperty.call(O, k)) {

                // i. Let kValue be the result of calling the Get internal
                // method of O with argument Pk.
                kValue = O[k];

                // ii. Call the Call internal method of callback with T as the
                // this value and
                // argument list containing kValue, k, and O.
                callback.call(T, kValue, k, O);
            }
            // d. Increase k by 1.
            k++;
        }
        // 8. return undefined
    };
}

if (!Array.prototype.every) {
    Array.prototype.every = function(fun /* , thisArg */) {
        'use strict';

        if (this === void 0 || this === null)
            throw new TypeError();

        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun !== 'function')
            throw new TypeError();

        var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
        for ( var i = 0; i < len; i++) {
            if (i in t && !fun.call(thisArg, t[i], i, t))
                return false;
        }

        return true;
    };
}

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(searchElement, fromIndex) {
        if (this === undefined || this === null) {
            throw new TypeError('"this" is null or not defined');
        }

        var length = this.length >>> 0; // Hack to convert object.length to a
                                        // UInt32

        fromIndex = +fromIndex || 0;

        if (Math.abs(fromIndex) === Infinity) {
            fromIndex = 0;
        }

        if (fromIndex < 0) {
            fromIndex += length;
            if (fromIndex < 0) {
                fromIndex = 0;
            }
        }

        for (; fromIndex < length; fromIndex++) {
            if (this[fromIndex] === searchElement) {
                return fromIndex;
            }
        }

        return -1;
    };
}