/* global GD */
/**
 * @file freie, eigene Easing-klasse 
 */
(function(GD) {

    "use strict";

    /**
     * <p>
     * Konfigurationssetting.
     * </p>
     * @memberOf GD.Core.Easing.Free
     * 
     * @property {object} config
     * @property {number} config.intFrameRateMs derfault=41 Framerate in Millisekunden 
     */
    var config = {
            intFrameRateMs : 41
    },

    /**
     * Alle Easing-klassen
     * @memberOf GD.Core.Easing.Free
     * @private
     * @see {@link http://easings.net/de|cheat-sheet}
     *
     * @property {Object} translate
     * @property {string} translate.linear              freeLinear
     * @property {string} translate.easeInQuad          quadIn
     * @property {string} translate.easeOutQuad         quadOut
     * @property {string} translate.easeInOutQuad       quadInOut
     * @property {string} translate.easeInCubic         cubicIn
     * @property {string} translate.easeOutCubic        cubicOut
     * @property {string} translate.easeInOutCubic      cubicInOut
     * @property {string} translate.easeInQuart         quartIn
     * @property {string} translate.easeOutQuart        quartOut
     * @property {string} translate.easeInOutQuart      quartInOut
     * @property {string} translate.easeInQuint         quintIn
     * @property {string} translate.easeOutQuint        quintOut
     * @property {string} translate.easeInOutQuint      quintInOut
     * @property {string} translate.easeInExpo          freeInExpo
     * @property {string} translate.easeOutExpo         freeOutExpo
     * @property {string} translate.easeInOutExpo       freeInOutExpo
     * @property {string} translate.easeInSine          sineIn
     * @property {string} translate.easeOutSine         sineOut
     * @property {string} translate.easeInOutSine       sineInOut
     * @property {string} translate.easeInCirc          circIn
     * @property {string} translate.easeOutCirc         circOut
     * @property {string} translate.easeInOutCirc       circInOut
     * @property {string} translate.easeInElastic       elasticIn
     * @property {string} translate.easeOutElastic      elasticOut
     * @property {string} translate.easeInOutElastic    elasticInOut
     * @property {string} translate.easeInBack          backIn
     * @property {string} translate.easeOutBack         backOut
     * @property {string} translate.easeInOutBack       backInOut
     * @property {string} translate.easeInBounce        bounceIn
     * @property {string} translate.easeOutBounce       bounceOut
     * @property {string} translate.easeInOutBounce     bounceInOut
     */
    translate = {
            linear : 'freeLinear',
            easeInQuad : 'quadIn',
            easeOutQuad : 'quadOut',
            easeInOutQuad : 'quadInOut',
            easeInCubic : 'cubicIn',
            easeOutCubic : 'cubicOut',
            easeInOutCubic : 'cubicInOut',
            easeInQuart : 'quartIn',
            easeOutQuart : 'quartOut',
            easeInOutQuart : 'quartInOut',
            easeInQuint : 'quintIn',
            easeOutQuint : 'quintOut',
            easeInOutQuint : 'quintInOut',
            easeInExpo : 'freeInExpo',
            easeOutExpo : 'freeOutExpo',
            easeInOutExpo : 'freeInOutExpo',
            easeInSine : 'sineIn',
            easeOutSine : 'sineOut',
            easeInOutSine : 'sineInOut',
            easeInCirc : 'circIn',
            easeOutCirc : 'circOut',
            easeInOutCirc : 'circInOut',
            easeInElastic : 'elasticIn',
            easeOutElastic : 'elasticOut',
            easeInOutElastic : 'elasticInOut',
            easeInBack : 'backIn',
            easeOutBack : 'backOut',
            easeInOutBack : 'backInOut',
            easeInBounce : 'bounceIn',
            easeOutBounce : 'bounceOut',
            easeInOutBounce : 'bounceInOut'
    };
    
    GD.NS('Core', 'Easing', 'Free', config, GD.Core.Easing.Abstract);

    /**
     * <h5>Easing-klasse: Free</h5>
     * Freie Easing-klassen
     * Das Problem ist die Synchronisation zwischen den 
     * der Eas-fkts und Namen zwischen verschiedenen
     * Libs.
     * <p> Hier wurde {@link http://www.createjs.com/#!/TweenJS|Tween.js} als Voralge benutzt.</p>
     *
     * @constructs Free
     * @memberOf GD.Core.Easing
     * @augments GD.Core.Easing.Abstract
     * @author Andreas Dyballa
     * @see {@link https://github.com/CreateJS/TweenJS/blob/release_v0.4.1/src/tweenjs/Ease.js}
     * @return {GD.Core.Easing.Free} instance
     */
    GD.Core.Easing.Free.constructor = function() {
        var _ = GD.extend({}, GD.Core.Easing.Abstract.constructor.apply(this, []));

        return _;
    };

    /**
     * Setzt Ease-Function als Callback
     * @prototype
     * 
     * @throws RangeError
     * @param {GD.Core.Easing.Free.translate} ease
     * @return GD.Easing.free
     */
    GD.Core.Easing.Free.prototype.setEase = function(ease) {
        if(ease in translate){
            this.ease = GD.Core.Easing.Free[translate[ease]];
            return this;
        }
        GD.Core.Error.exception(new RangeError(ease+' ist kein gueltiger Ease-name'));
    };

    /**
     * Ease ausfuehren
     * @prototype
     *
     * @param {GD.Core.Easing.Run} callback
     */
    GD.Core.Easing.Free.prototype.run = function(callback) {
        var ctx = this, _i = 1;

        function _run() {
            if (ctx.end <= _i) {
                callback(ctx.distance);
                if (ctx.finish) {
                    ctx.finish();
                }
            } else {
                callback(ctx.distance * ctx.ease(_i / ctx.end));
                _i++;
                setTimeout(_run, ctx.config.intFrameRateMs);
            }
        }

        _run();
    };
    

    
    /************************************************
     * Hier beginnt die Tween.js-Kopie
     * @see {@link https://github.com/CreateJS/TweenJS/blob/release_v0.4.1/src/tweenjs/Ease.js}
     ***********************************************/
    /**
     * Configurable exponential ease.
     * @memberOf GD.Core.Easing.Free
     * @see {@link https://github.com/CreateJS/TweenJS/blob/release_v0.4.1/src/tweenjs/Ease.js}
     * @protected
     * 
     * @function getPowIn
     * @param {number} pow The exponent to use (ex. 3 would return a cubic ease).
     */
    GD.Core.Easing.Free.getPowIn = function(pow) {
        return function(t) {
            return Math.pow(t, pow);
        };
    };

    /**
     * Configurable exponential ease.
     * @memberOf GD.Core.Easing.Free
     * @see {@link https://github.com/CreateJS/TweenJS/blob/release_v0.4.1/src/tweenjs/Ease.js}
     * @protected
     * 
     * @function getPowOut
     * @param {number} pow The exponent to use (ex. 3 would return a cubic ease).
     */
    GD.Core.Easing.Free.getPowOut = function(pow) {
        return function(t) {
            return 1 - Math.pow(1 - t, pow);
        };
    };

    /**
     * Configurable exponential ease.
     * @memberOf GD.Core.Easing.Free
     * @see {@link https://github.com/CreateJS/TweenJS/blob/release_v0.4.1/src/tweenjs/Ease.js}
     * @protected
     * 
     * @function getPowInOut
     * @param {number} pow The exponent to use (ex. 3 would return a cubic ease).
     */
    GD.Core.Easing.Free.getPowInOut = function(pow) {
        return function(t) {
            if ((t *= 2) < 1){
                return 0.5 * Math.pow(t, pow);
            }
            return 1 - 0.5 * Math.abs(Math.pow(2 - t, pow));
        };
    };

    /**
     * @memberOf GD.Core.Easing.Free
     * @see {@link https://github.com/CreateJS/TweenJS/blob/release_v0.4.1/src/tweenjs/Ease.js}
     * @function quadIn
     */
    GD.Core.Easing.Free.quadIn = GD.Core.Easing.Free.getPowIn(2);
    /**
     * @memberOf GD.Core.Easing.Free
     * @see {@link https://github.com/CreateJS/TweenJS/blob/release_v0.4.1/src/tweenjs/Ease.js}
     * @function quadOut
     */
    GD.Core.Easing.Free.quadOut = GD.Core.Easing.Free.getPowOut(2);
    /**
     * @memberOf GD.Core.Easing.Free
     * @see {@link https://github.com/CreateJS/TweenJS/blob/release_v0.4.1/src/tweenjs/Ease.js}
     * @function quadInOut
     */
    GD.Core.Easing.Free.quadInOut = GD.Core.Easing.Free.getPowInOut(2);

    /**
     * @memberOf GD.Core.Easing.Free
     * @see {@link https://github.com/CreateJS/TweenJS/blob/release_v0.4.1/src/tweenjs/Ease.js}
     * @function cubicIn
     */
    GD.Core.Easing.Free.cubicIn = GD.Core.Easing.Free.getPowIn(3);
    /**
     * @memberOf GD.Core.Easing.Free
     * @see {@link https://github.com/CreateJS/TweenJS/blob/release_v0.4.1/src/tweenjs/Ease.js}
     * @function cubicOut
     */
    GD.Core.Easing.Free.cubicOut = GD.Core.Easing.Free.getPowOut(3);
    /**
     * @memberOf GD.Core.Easing.Free
     * @see {@link https://github.com/CreateJS/TweenJS/blob/release_v0.4.1/src/tweenjs/Ease.js}
     * @function cubicInOut
     */
    GD.Core.Easing.Free.cubicInOut = GD.Core.Easing.Free.getPowInOut(3);

    /**
     * @memberOf GD.Core.Easing.Free
     * @see {@link https://github.com/CreateJS/TweenJS/blob/release_v0.4.1/src/tweenjs/Ease.js}
     * @function quartIn
     */
    GD.Core.Easing.Free.quartIn = GD.Core.Easing.Free.getPowIn(4);
    /**
     * @memberOf GD.Core.Easing.Free
     * @see {@link https://github.com/CreateJS/TweenJS/blob/release_v0.4.1/src/tweenjs/Ease.js}
     * @function quartOut
     */
    GD.Core.Easing.Free.quartOut = GD.Core.Easing.Free.getPowOut(4);
    /**
     * @memberOf GD.Core.Easing.Free
     * @see {@link https://github.com/CreateJS/TweenJS/blob/release_v0.4.1/src/tweenjs/Ease.js}
     * @function quartInOut
     */
    GD.Core.Easing.Free.quartInOut = GD.Core.Easing.Free.getPowInOut(4);

    /**
     * @memberOf GD.Core.Easing.Free
     * @see {@link https://github.com/CreateJS/TweenJS/blob/release_v0.4.1/src/tweenjs/Ease.js}
     * @function quintIn
     */
    GD.Core.Easing.Free.quintIn = GD.Core.Easing.Free.getPowIn(5);
    /**
     * @memberOf GD.Core.Easing.Free
     * @see {@link https://github.com/CreateJS/TweenJS/blob/release_v0.4.1/src/tweenjs/Ease.js}
     * @function quintOut
     */
    GD.Core.Easing.Free.quintOut = GD.Core.Easing.Free.getPowOut(5);
    /**
     * @memberOf GD.Core.Easing.Free
     * @see {@link https://github.com/CreateJS/TweenJS/blob/release_v0.4.1/src/tweenjs/Ease.js}
     * @function quintInOut
     */
    GD.Core.Easing.Free.quintInOut = GD.Core.Easing.Free.getPowInOut(5);

    /**
     * @memberOf GD.Core.Easing.Free
     * @see {@link https://github.com/CreateJS/TweenJS/blob/release_v0.4.1/src/tweenjs/Ease.js}
     * @function sineIn
     * @param {number} t
     */
    GD.Core.Easing.Free.sineIn = function(t) {
        return 1 - Math.cos(t * Math.PI / 2);
    };

    /**
     * @memberOf GD.Core.Easing.Free
     * @see {@link https://github.com/CreateJS/TweenJS/blob/release_v0.4.1/src/tweenjs/Ease.js}
     * @function sineOut
     * @param {number} t
     */
    GD.Core.Easing.Free.sineOut = function(t) {
        return Math.sin(t * Math.PI / 2);
    };

    /**
     * @memberOf GD.Core.Easing.Free
     * @see {@link https://github.com/CreateJS/TweenJS/blob/release_v0.4.1/src/tweenjs/Ease.js}
     * @function sineInOut
     * @param {number} t
     */
    GD.Core.Easing.Free.sineInOut = function(t) {
        return -0.5 * (Math.cos(Math.PI * t) - 1);
    };

    /**
     * Configurable "back in" ease.
     * 
     * @memberOf GD.Core.Easing.Free
     * @protected
     * @see {@link https://github.com/CreateJS/TweenJS/blob/release_v0.4.1/src/tweenjs/Ease.js}
     * @function getBackIn
     *
     * @param {number} amount The strength of the ease.
     */
    GD.Core.Easing.Free.getBackIn = function(amount) {
        return function(t) {
            return t * t * ((amount + 1) * t - amount);
        };
    };

    /**
     * @memberOf GD.Core.Easing.Free
     * @see {@link https://github.com/CreateJS/TweenJS/blob/release_v0.4.1/src/tweenjs/Ease.js}
     * @function backIn
     */
    GD.Core.Easing.Free.backIn = GD.Core.Easing.Free.getBackIn(1.7);

    /**
     * Configurable "back out" ease.
     * 
     * @memberOf GD.Core.Easing.Free
     * @protected
     * @see {@link https://github.com/CreateJS/TweenJS/blob/release_v0.4.1/src/tweenjs/Ease.js}
     * @function getBackOut
     *
     * @param {number} amount The strength of the ease.
     */
    GD.Core.Easing.Free.getBackOut = function(amount) {
        return function(t) {
            return (--t * t * ((amount + 1) * t + amount) + 1);
        };
    };

    /**
     * @memberOf GD.Core.Easing.Free
     * @see {@link https://github.com/CreateJS/TweenJS/blob/release_v0.4.1/src/tweenjs/Ease.js}
     * @function backOut
     */
    GD.Core.Easing.Free.backOut = GD.Core.Easing.Free.getBackOut(1.7);

    /**
     * Configurable "back in out" ease.
     *
     * @memberOf GD.Core.Easing.Free
     * @protected
     * @see {@link https://github.com/CreateJS/TweenJS/blob/release_v0.4.1/src/tweenjs/Ease.js}
     * @function getBackInOut
     *
     * @param {number} amount The strength of the ease.
     */
    GD.Core.Easing.Free.getBackInOut = function(amount) {
        amount *= 1.525;
        return function(t) {
            if ((t *= 2) < 1){
                return 0.5 * (t * t * ((amount + 1) * t - amount));
            }
            return 0.5 * ((t -= 2) * t * ((amount + 1) * t + amount) + 2);
        };
    };

    /**
     * @memberOf GD.Core.Easing.Free
     * @see {@link https://github.com/CreateJS/TweenJS/blob/release_v0.4.1/src/tweenjs/Ease.js}
     * @function backInOut
     */
    GD.Core.Easing.Free.backInOut = GD.Core.Easing.Free.getBackInOut(1.7);

    /**
     * @memberOf GD.Core.Easing.Free
     * @see {@link https://github.com/CreateJS/TweenJS/blob/release_v0.4.1/src/tweenjs/Ease.js}
     * @function circIn
     * @param {number} t
     */
    GD.Core.Easing.Free.circIn = function(t) {
        return -(Math.sqrt(1 - t * t) - 1);
    };

    /**
     * @memberOf GD.Core.Easing.Free
     * @see {@link https://github.com/CreateJS/TweenJS/blob/release_v0.4.1/src/tweenjs/Ease.js}
     * @function circOut
     * @param {number} t
     */
    GD.Core.Easing.Free.circOut = function(t) {
        return Math.sqrt(1 - (--t) * t);
    };

    /**
     * @memberOf GD.Core.Easing.Free
     * @see {@link https://github.com/CreateJS/TweenJS/blob/release_v0.4.1/src/tweenjs/Ease.js}
     * @function circInOut
     */
    GD.Core.Easing.Free.circInOut = function(t) {
        if ((t *= 2) < 1){
            return -0.5 * (Math.sqrt(1 - t * t) - 1);
        }
        return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
    };

    /**
     * @memberOf GD.Core.Easing.Free
     * @see {@link https://github.com/CreateJS/TweenJS/blob/release_v0.4.1/src/tweenjs/Ease.js}
     * @function bounceIn
     * @param {number} t
     */
    GD.Core.Easing.Free.bounceIn = function(t) {
        return 1 - GD.Core.Easing.Free.bounceOut(1 - t);
    };

    /**
     * @memberOf GD.Core.Easing.Free
     * @see {@link https://github.com/CreateJS/TweenJS/blob/release_v0.4.1/src/tweenjs/Ease.js}
     * @function bounceOut
     * @param {number} t
     */
    GD.Core.Easing.Free.bounceOut = function(t) {
        if (t < 1 / 2.75) {
            return (7.5625 * t * t);
        } else if (t < 2 / 2.75) {
            return (7.5625 * (t -= 1.5 / 2.75) * t + 0.75);
        } else if (t < 2.5 / 2.75) {
            return (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375);
        } else {
            return (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375);
        }
    };

    /**
     * @memberOf GD.Core.Easing.Free
     * @see {@link https://github.com/CreateJS/TweenJS/blob/release_v0.4.1/src/tweenjs/Ease.js}
     * @function bounceInOut
     * @param {number} t
     */
    GD.Core.Easing.Free.bounceInOut = function(t) {
        if (t < 0.5){
            return GD.Core.Easing.Free.bounceIn(t * 2) * 0.5;
        }
        return GD.Core.Easing.Free.bounceOut(t * 2 - 1) * 0.5 + 0.5;
    };

    /**
     * Configurable elastic ease.
     * @memberOf GD.Core.Easing.Free
     * @protected
     * @see {@link https://github.com/CreateJS/TweenJS/blob/release_v0.4.1/src/tweenjs/Ease.js}
     * 
     * @function getElasticIn
     * @param {number} amplitude
     * @param {number} period
     */
    GD.Core.Easing.Free.getElasticIn = function(amplitude, period) {
        var pi2 = Math.PI * 2;
        return function(t) {
            if (t === 0 || t === 1){
                return t;
            }
            var s = period / pi2 * Math.asin(1 / amplitude);
            return -(amplitude * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * pi2 / period));
        };
    };

    /**
     * @memberOf GD.Core.Easing.Free
     * @see {@link https://github.com/CreateJS/TweenJS/blob/release_v0.4.1/src/tweenjs/Ease.js}
     * @function elasticIn
     */
    GD.Core.Easing.Free.elasticIn = GD.Core.Easing.Free.getElasticIn(1, 0.3);

    /**
     * Configurable elastic ease.
     * @memberOf GD.Core.Easing.Free
     * @protected
     * @see {@link https://github.com/CreateJS/TweenJS/blob/release_v0.4.1/src/tweenjs/Ease.js}
     * @function getElasticOut
     *
     * @param {number} amplitude
     * @param {number} period
     */
    GD.Core.Easing.Free.getElasticOut = function(amplitude, period) {
        var pi2 = Math.PI * 2;
        return function(t) {
            if (t === 0 || t === 1){
                return t;
            }
            var s = period / pi2 * Math.asin(1 / amplitude);
            return (amplitude * Math.pow(2, -10 * t) * Math.sin((t - s) * pi2 / period) + 1);
        };
    };

    /**
     * @function elasticOut
     * @see {@link https://github.com/CreateJS/TweenJS/blob/release_v0.4.1/src/tweenjs/Ease.js}
     * @memberOf GD.Core.Easing.Free
     */
    GD.Core.Easing.Free.elasticOut = GD.Core.Easing.Free.getElasticOut(1, 0.3);

    /**
     * Configurable elastic ease.
     * @memberOf GD.Core.Easing.Free
     * @protected
     * @see {@link https://github.com/CreateJS/TweenJS/blob/release_v0.4.1/src/tweenjs/Ease.js}
     * @function getElasticInOut
     *
     * @param {number} amplitude
     * @param {number} period
     */
    GD.Core.Easing.Free.getElasticInOut = function(amplitude, period) {
        var pi2 = Math.PI * 2;
        return function(t) {
            var s = period / pi2 * Math.asin(1 / amplitude);
            if ((t *= 2) < 1){
                return -0.5 * (amplitude * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * pi2 / period));
            }
            return amplitude * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - s) * pi2 / period) * 0.5 + 1;
        };
    };

    /**
     * @memberOf GD.Core.Easing.Free
     * @see {@link https://github.com/CreateJS/TweenJS/blob/release_v0.4.1/src/tweenjs/Ease.js}
     * @function elasticInOut
     */
    GD.Core.Easing.Free.elasticInOut = GD.Core.Easing.Free.getElasticInOut(1, 0.3 * 1.5);


    /************************************************
     * Hier beginnen die eigenen Easings
     * @see {https://github.com/CreateJS/TweenJS/blob/release_v0.4.1/src/tweenjs/Ease.js}
     ***********************************************/
    /**
     * Frei: lineares Easing.
     * @memberOf GD.Core.Easing.Free
     * 
     * @param {number} t
     */
    GD.Core.Easing.Free.freeLinear = function(t) {
        return t;
    };

    /**
     * @function freeInExpo
     * @memberOf GD.Core.Easing.Free
     */
    GD.Core.Easing.Free.freeInExpo = GD.Core.Easing.Free.getPowIn(10);

    /**
     * @function freeOutExpo
     * @memberOf GD.Core.Easing.Free
     */
    GD.Core.Easing.Free.freeOutExpo = GD.Core.Easing.Free.getPowOut(10);

    /**
     * @function freeInOutExpo
     * @memberOf GD.Core.Easing.Free
     */
    GD.Core.Easing.Free.freeInOutExpo = GD.Core.Easing.Free.getPowInOut(10);
})(GD);