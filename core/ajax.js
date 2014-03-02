/* global GD, GDDEV */
/**
 * Erweitert GD-Core um Ajax-objekt
 * 
 * @memberOf GD
 */
(function(GD) {

    "use strict";

    /**
     * <h5>Ajax-handling</h5>
     * 
     * @name Ajax
     * @class
     * @memberOf GD.Core
     * @author Andreas Dyballa
     */
    
    /**
     * Callback-script
     * @callback Script
     * @memberOf GD.Core.Ajax
     */
    
    /**
     * Callback-successhandler fuer JSON Ajax
     * @callback Successhandler
     * @memberOf GD.Core.Ajax
     * @param {Object} unbekannt
     */

    /**
     * <p>
     * Konfigurationssetting.
     * </p>
     * @memberOf GD.Core.Ajax
     * 
     * @property {object} config
     */
    var config = {};
    
    GD.NS('Core', 'Ajax', config);

    /**
     * loads script
     * @memberOf GD.Lib.Ajax
     * 
     * @param {string} fileName
     * @param {GD.Core.Ajax.Script} callback
     */
    GD.Core.Ajax.loadScript = function(fileName, callback){
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = fileName;
        script.onreadystatechange= function () {
            if (this.readyState === 'complete'){
                callback();
            }
        };
        script.onload = callback;
        GD.doc.getElementsByTagName("head")[0].appendChild(script);
    };

    /**
     * loads and parses JSON-file
     * @memberOf GD.Lib.Ajax
     * TODO: to implement
     * 
     * @param {string} url
     * @param {GD.Core.Ajax.Successhandler} sucessHandler
     */
    GD.Core.Ajax.getJSON = function(url, sucessHandler) {
        sucessHandler(null);
    };
})(GD);