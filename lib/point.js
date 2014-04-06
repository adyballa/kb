/* global GD */
/**
 * @file 2.Dim Punkt-Behandlung
 * @author Generation Digitale
 * @memberOf GD
 */
(
/**
 * @param {GD} lib
 * @param {GD.Lib.Point} clss
 */
function(GD, clss) {
    
    "use strict";

    /**
     * @typedef {Object} Point_Dimension
     * @property {number} width
     * @property {number} height
     */

    /**
     * @typedef {Object} Point_Pos
     * @property {number} top
     * @property {number} left
     */

    /**
     * @typedef {Object} Point_Dimension_Px
     * @property {string} width Koordinate + px
     * @property {string} height Koordinate + px
     */

    /**
     * @typedef {Object} Point_Pos_Px
     * @property {string} top Koordinate + px
     * @property {string} left Koordinate + px
     */
    

    /**
     * <h5>2-Dimensionaler Punkt</h5>
     *
     * @constructs Point
     * @memberOf GD.Lib
     * @author Generation Digitale
     * @param {number} x x-coord
     * @param {number} y y-coord
     * @returns {GD.Lib.Point} instance
     */
    clss.constructor = function(x, y) {
        var _ = {};
        /**
         * @memberOf GD.Lib.Point
         * @member {number} x
         * @instance
         * @privileged
         */
        this.x = 0;
        /**
         * @memberOf GD.Lib.Point
         * @member {number} y
         * @instance
         * @privileged
         */
        this.y = 0;

        if (y !== undefined){
            this.set(x, y);
        }

        /**
         * Addiert Punkt Bei 2 Parametern als x,y Paar Bei einem als Punkt
         * @memberOf GD.Lib.Point
         * @function add
         * @instance
         * @privileged
         * 
         * @param {(GD.Lib.Point|number)} point X-Koordinate oder Punkt
         * @param {number=} y
         * @returns {GD.Lib.Point}
         */
        this.add = function(point, y) {
            if (y === undefined) {
                this.x += point.x;
                this.y += point.y;
            } else {
                this.x += +point;
                this.y += +y;
            }
            return this;
        };

        /**
         * Subtrahiert Punkt Bei 2 Parametern als x,y Paar Bei einem als Punkt
         * @memberOf GD.Lib.Point
         * @function sub
         * @instance
         * @privileged
         * 
         * @param {(GD.Lib.Point|number)} point X-Koordinate oder Punkt 
         * @param {number=} y
         * @returns {GD.Lib.Point}
         */
        this.sub = function(point, y) {
            if (y === undefined) {
                this.x -= point.x;
                this.y -= point.y;
            } else {
                this.x -= +point;
                this.y -= +y;
            }
            return this;
        };

        /**
         * Multipliziert Punkt mit Skalar
         * @memberOf GD.Lib.Point
         * @function mul
         * @instance
         * @privileged
         * 
         * @param {number} scalar
         * @returns {GD.Lib.Point}
         */
        this.mul = function(scalar) {
            this.x = scalar * this.x;
            this.y = scalar * this.y;
            return this;
        };

        /**
         * Clont Punkt
         * @memberOf GD.Lib.Point
         * @function clone
         * @instance
         * @privileged
         * 
         * @returns {GD.Lib.Point}
         */
        this.clone = function() {
            return GD.Fabric('Lib', 'Point').create(this.x, this.y);
        };

        return _;
    };

    /**
     * Setzt Punkt
     * @memberOf GD.Lib.Point#
     * @prototype
     * 
     * @param {number} x x-coord
     * @param {number} y y-coord
     * @returns {GD.Lib.Point}
     */
    clss.prototype.set = function(x, y) {
        this.x = +x;
        this.y = +y;
        return this;
    };

    /**
     * Formatiert Punkt in Position
     * @memberOf GD.Lib.Point#
     * @prototype
     * 
     * @returns {Point_Pos}
     */
    clss.prototype.toPos = function() {
        return {
            top : this.y,
            left : this.x
        };
    };

    /**
     * Formatiert Punkt in Dimension
     * @memberOf GD.Lib.Point#
     * @prototype
     * 
     * @returns {Point_Dimension}
     */
    clss.prototype.toDim = function() {
        return {
            width : this.x,
            height : this.y
        };
    };

    /**
     * Formatiert Punkt in Position mit Pixelangabe
     * @memberOf GD.Lib.Point#
     * @prototype
     * 
     * @returns {Point_Pos_Px}
     */
    clss.prototype.toPosPx = function() {
        return {
            top : this.y+"px",
            left : this.x+"px"
        };
    };

    /**
     * Formatiert Punkt in Dimension mit Pixelangabe
     * @prototype
     * 
     * @returns {Point_Dimension_Px}
     */
    clss.prototype.toDimPx = function() {
        return {
            width : this.x+"px",
            height : this.y+"px"
        };
    };

    /**
     * Formatiert Punkt in String
     * @memberOf GD.Lib.Point#
     * @prototype
     * 
     * @returns {string}
     */
    clss.prototype.toString = function() {
        return " x : "+this.x+" y : "+this.y;
    };

    /**
     * Formatiert Punkt in Produkt (x*y)
     * @memberOf GD.Lib.Point#
     * @prototype
     * 
     * @returns {number}
     */
    clss.prototype.toProduct = function() {
        return this.x*this.y;
    };

    /**
     * Formatiert Punkt als Summe (x+y)
     * @memberOf GD.Lib.Point#
     * @prototype
     * 
     * @returns {number}
     */
    clss.prototype.toSum = function() {
        return this.x+this.y;
    };

    /**
     * Gibt Maximum zurueck oder setzt Maximalwerte
     * von point und this, falls point gegeben ist.
     * @memberOf GD.Lib.Point#
     * @prototype
     *
     * @param {GD.Lib.Point=} point
     * @returns {(number|GD.Lib.Point)}
     */
    clss.prototype.max = function(point) {
        if(point){
            this.x = Math.max(point.x, this.x);
            this.y = Math.max(point.y, this.y);
            return this;
        }
        return Math.max(this.x,this.y);
    };

    /**
     * Gibt Minimum zurueck oder setzt Minimumwerte
     * von point und this, falls point gegeben ist.
     * @memberOf GD.Lib.Point#
     * @prototype
     * 
     * @param {GD.Lib.Point=} point
     * @returns {(number|GD.Lib.Point)}
     */
    clss.prototype.min = function(point) {
        if(point){
            this.x = Math.min(point.x, this.x);
            this.y = Math.min(point.y, this.y);
            return this;
        }
        return Math.min(this.x,this.y);
    };

    /**
     * Vergleicht point mit this
     * @memberOf GD.Lib.Point#
     * @prototype
     * 
     * @param {GD.Lib.Point} point
     * @param {compareFct} callback
     * 
     * @returns {mixed}
     */
    clss.prototype.compare = function(point, callback) {
        return callback(this.x, this.y, point.x, point.y);
    };
    
    /**
     * Wird zum Vergleich von 2 Punkten benutzt.
     *
     * @memberOf GD.Lib.Composite
     * @callback compareFct
     * @param {number} this.x
     * @param {number} this.y
     * @param {number} point.x
     * @param {number} point.y
     * @returns {boolean}
     */
})(GD, GD.Ns);