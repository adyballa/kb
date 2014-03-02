/* global GD */
/**
 * @file Utility-obj fuer Standalone-objekte
 */
(function(GD) {

    "use strict";

    /**
     * Grundsaetzlich Unwichtiges
     * 
     * @name Util
     * @class
     * @memberOf GD.Core
     * @author Andreas Dyballa
     */

    GD.NS('Core', 'Util');

    /**
     * Gibt kodierte GET-Parameter als Property-Value-Objekt zurueck
     * 
     * @memberOf GD.Core.Util
     * @param {string} url
     * @return {Object} res
     */
    GD.Core.Util.getGetParamsFromURL = function(url) {
        var d = decodeURI(url).split("&");
        var res = {};
        for ( var i = 0, j = d.length; i < j; i++){
            if (d[i].match(/[&?]?([^=]+)=([^=&]+)/gi)) {
                res[RegExp.$1] = decodeURIComponent(RegExp.$2);
            }
        }
        return res;
    };

    /**
     * Makes a string's first character uppercase
     * 
     * @memberOf GD.Core.Util
     * @version 1109.2015
     * @see {@link http://phpjs.org/functions/ucfirst}
     * @author Kevin van Zonneveld und Brett Zamir
     * @see {@link http://kevin.vanzonneveld.net|Kevin van Zonneveld}
     * @see {@link http://brett-zamir.me|Brett Zamir}
     * @param {string} str
     * @returns {string}
     */
    GD.Core.Util.ucFirst = function(str) {
        return (typeof str === "string") ? str.charAt(0).toUpperCase()+str.slice(1) : ""; 
    };

    /**
     * Konvertiert einen HTML-String in eine DOM-Node
     * 
     * @memberOf GD.Core.Util
     * @param {string} strDom
     * @return {(HTMLDocument|Element)}
     */
    GD.Core.Util.convertStr2Dom = function(strDom) {
        if (DOMParser in GD.win) {
            return new DOMParser().parseFromString(strDom, "text/xml");
        }
        /* bietet keinen getElementById */
        var div = GD.doc.createElement('DIV');
        div.innerHTML = strDom;
        return div;
    };

    /**
     * Gibt den Inhalt von einer Metabeschreibung zurueck.
     * 
     * @memberOf GD.Core.Util
     * @param {string} Name des Metatags. Ignoriert Klein- Grossschreibung
     */
    GD.Core.Util.getMeta = function(name) {
        /* gibt Beschreibung zurueck */
        var m = GD.doc.getElementsByTagName('meta');
        var d = null;
        for ( var i = 0, j = m.length; i < j; i++) {
            d = m[i].getAttribute("name");
            if (d && d.toLowerCase() === String(name).toLowerCase()) {
                return m[i].getAttribute("content");
            }
        }
        return "";
    };
})(GD);