/* global GD */
/**
 * @file absrtakte Easing-klassen 
 */
(function(GD) {

    "use strict";

    /**
     * <p>
     * Konfigurationssetting.
     * </p>
     * @memberOf GD.Core.Easing.Abstract
     * 
     * @property {object} config
     * @property {number} config.intFrameRateMs derfault=41 Framerate in Millisekunden 
     */
    var config = {
            intFrameRateMs : 41
    };

    GD.NS('Core', 'Easing', 'Abstract', config);

    /**
     * <h5>abstrakte Grundlage fuer Easingklassen</h5>
     *
     * @constructs Abstract
     * @memberOf GD.Core.Easing
     * @author Andreas Dyballa
     * 
     * @returns {GD.Core.Easing.Abstract} instance
     */
    GD.Core.Easing.Abstract.constructor = function() {
        var _ = {
                /**
                 * Gesamtdauer
                 * 
                 * @memberOf GD.Core.Easing.Abstract
                 * @member duration
                 * @instance
                 * @private
                 * 
                 * @type {number}
                 */
                duration : 0
        };
        
        /**
         * Eine Easingklasse
         *
         * @memberOf GD.Core.Easing.Abstract
         * @member ease
         * @instance
         * @privileged
         * @protected
         * @default linear
         *
         * @type {string}
         */
        this.ease = 'linear';

        /**
         * letzter Frame
         * @memberOf GD.Core.Easing.Abstract
         * @member end
         * @instance
         * @privileged
         * @protected
         * @default 0
         *
         * @type {number}
         */
        this.end = 0;

        /**
         * Gesamtdistanz
         * @memberOf GD.Core.Easing.Abstract
         * @member distance
         * @instance
         * @privileged
         * @protected
         * @default 0
         *
         * @type {number}
         */
        this.distance = 0;

        /**
         * Endroutine
         * @memberOf GD.Core.Easing.Abstract
         * @member finish
         * @instance
         * @privileged
         * @protected
         * @default null
         *
         * @type {GD.Core.Easing.Finish}
         */
        this.finish = null;

        /**
         * Setzt Dauer des Ease oder gibt es zurueck
         *
         * @memberOf GD.Core.Easing.Abstract
         * @function duration
         * @instance
         * @privileged
         * 
         * @param {number} duration
         * @returns {(GD.Core.Easing.Abstract|number)}
         */
        this.duration = function(duration) {
            if(typeof duration === "undefined"){
                return _.duration;
            }else{
                _.duration = duration;
                this.end = Math.ceil(_.duration / this.config.intFrameRateMs);
                return this;
            }
        };
       
        return _;
    };

    /**
     * Setzt Endroutine
     * @prototype
     *
     * @param {GD.Core.Easing.Finish} finish
     * @returns {GD.Core.Easing.Abstract}
     */
    GD.Core.Easing.Abstract.prototype.setFinish = function(finish) {
        this.finish = finish;
        return this;
    };

    /**
     * Setzt Dauer des Ease
     * @prototype
     *
     * @param {number} distance
     * @returns {GD.Core.Easing.Abstract}
     */
    GD.Core.Easing.Abstract.prototype.setDistance = function(distance) {
        this.distance = distance;
        return this;
    };

    /**
     * Setzt Ease-Function als Callback
     * @prototype
     * 
     * @param {GD.Core.Easing.Free.translate} easeFct
     * @returns {GD.Core.Easing.Abstract}
     */
    GD.Core.Easing.Abstract.prototype.setEase = function(ease) {
        this.ease = ease;
        return this;
    };

    /**
     * Ease ausfuehren
     * @prototype
     * @abstract
     *
     * @param {GD.Core.Easing.Run} callback
     */
    GD.Core.Easing.Abstract.prototype.run = function(callback) {
    };
})(GD);