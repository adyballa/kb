/* global GD */
/* jshint devel: true */
/**
 * @file GD-Standalone Log-Format
 */
(function(GD) {

    "use strict";

    GD.NS('Core', 'Log', 'Format');

    /**
     * @memberOf GD.Core.Log
     * @constructs Format
     * @abstract
     * @author Andreas Dyballa
     *
     * <h5>GD-Standalone LOG-Formater</h5>
     * Es wird sich an Zend orientiert.
     * Ein Formatter formatiert eine Fehlerevent
     *
     * @see {@link http://framework.zend.com/manual/2.3/en/modules/zend.log.overview.html|Zend-log}
     *
     */
    GD.Core.Log.Format.constructor = function() {};

    /**
     * Formatiert ein Fehlerevent
     *
     * @memberOf GD.Core.Log.Format#
     * @prototype
     * 
     * @param {GD.Core.Log.Event} event
     */
    GD.Core.Log.Format.prototype.run = function(event){
    };
    
    GD.Core.Event.dispatch("gd:core:log:format:load");
})(GD);
