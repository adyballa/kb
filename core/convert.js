/* global GD */
/**
 * @file Erweitert GD-Core um Konvertierungen
 */
(function(GD) {

    "use strict";

    /**
     * <p>
     * Konfigurationssetting.
     * </p>
     * @memberOf GD.Core.Convert
     * 
     * @property {object} config
     */
    var config = {};
    
    /**
     * <h5>Konvertierungen</h5>
     * Sammlung von Konvertierungen von Typen und Klassen.
     * 
     * @name Convert
     * @class
     * @memberOf GD.Core
     * @author Andreas Dyballa
     */

    GD.NS('Core', 'Convert', config);

    /**
     * Konertiert in dezimalnummer
     * @memberOf GD.Core.Convert
     * 
     * @param {mixed} param
     * @returns {Number}
     */
    GD.Core.Convert.number = function(param) {
        return parseInt("0"+param ,10);
    };

    /**
     * Konertiert in Boolean
     * @memberOf GD.Core.Convert
     * 
     * @param {mixed} param
     * @returns {Boolean}
     */
    GD.Core.Convert.bool = function(param) {
        var res = String(param).toLowerCase();
        return !(!Boolean(res) || res === "false" || res === "0");
    };

    /**
     * Konertiert zu Array mit Slice
     * can now convert certain host objects
     * @see {@link http://perfectionkills.com/jscript-and-dom-changes-in-ie9-preview-3/|kagnax}
     * @memberOf GD.Core.Convert
     * 
     * @param {mixed} param
     * @returns {Array}
     */
    GD.Core.Convert.array = function(param) {
        return Array.prototype.slice.call(param);
    };

    /**
     * Konertiert Objekt zu String
     * @memberOf GD.Core.Convert
     * 
     * @param {Object} obj
     * @returns {String}
     */
    GD.Core.Convert.obj2String = function(obj, tab) {
        var ss = new String(), prefix = "";
        tab = parseInt(tab, 10);
        for(var i = tab.length; i--;){
            prefix += " ";
        }
        for(var i in obj){
            ss += prefix+i+":";
            if(obj.hasOwnProperty(i)){
                if(Array.isArray(obj[i])){
                    ss += "["+obj[i].join(",")+"]";
                }else{
                    if(typeof obj[i] === "object"){
                        ss += GD.Core.Convert.obj2String(obj[i], tab+1);
                    }else{
                        ss += prefixi+":"+obj[i];
                    }
                }
            }
            ss += "\n";
        }
        return ss;
    };

    /**
     * Verkehrt Keys und Values von einem Array
     * @memberOf GD.Core.Convert
     *
     * @param {Array} trans
     * @returns {Array}
     */
    GD.Core.Convert.arrayFlip = GD.arrayFlip;
})(GD);