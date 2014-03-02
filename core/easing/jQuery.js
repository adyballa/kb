/* global GD */
/**
 * @file Kapslung von JQuery-Easing
 */

(function(GD) {

    "use strict";

    /**
     * <p>
     * Konfigurationssetting.
     * </p>
     * @memberOf GD.Core.Easing.JQuery
     * 
     * @property {object} config
     * @property {number} config.intFrameRateMs derfault=41 Framerate in Millisekunden 
     */
    var config = {
            intFrameRateMs : 41
    };
    
    GD.NS('Core', 'Easing', 'JQuery', config, GD.Core.Easing.Abstract);

    /**
     * <h5>Easing fuer JQuery</h5>
     * @see {@link http://jqueryui.com/demos/effect/easing.html|JQuery}
     * @constructs JQuery
     * @memberOf GD.Core.Easing
     * @augments GD.Core.Easing.Abstract
     * @author Andreas Dyballa
     * 
     * @return {GD.Core.Easing.JQuery} instance
     */
    GD.Core.Easing.JQuery.constructor = function(node) {
        var _ = GD.extend({
            /**
             * JQuery-objekt
             * 
             * @memberOf GD.Core.Easing.JQuery
             * @member $obj
             * @instance
             * @private
             * 
             * @type {jQuery}
             */
            $obj : null
        }, GD.Core.Easing.Abstract.constructor.apply(this, []));

        /**
         * setzt jQuery-Objekt oder gibt es zurueck
         *
         * @memberOf GD.Core.Easing.JQuery
         * @function $obj
         * @instance
         * @privileged
         * 
         * @param {jQuery} $obj
         * @returns {(GD.Core.Easing.JQuery|jQuery)}
         */
        this.$obj = function($obj) {
            if(typeof $obj === "undefined"){
                return _.$obj;
            }else{
                _.$obj = $obj;
                return this;
            }
        };

        return _;
    };
    
    /**
     * Stepfunction fuer JQuery-easing
     *
     * @callback StepFunction
     * @memberOf GD.Core.Easing.JQuery
     */

    /**
     * Fuehrt normales JQuery-animation aus
     * @prototype
     * 
     * @param {GD.Core.Easing.Run} callback
     * @param {GD.Core.Easing.JQuery.StepFunction} [stepFunction] custom Function
     */
    GD.Core.Easing.JQuery.prototype.run = function(callback, stepFunction) {
        if(stepFunction){
            this.$obj().animate(callback(), {
                step : stepFunction,
                duration : this.duration()
                }, this.ease, (this.finish) ? this.finish : null);
        }else{
            this.$obj().animate(callback(), this.duration(), this.ease, (this.finish) ? this.finish : null);
        }
    };
})(GD);