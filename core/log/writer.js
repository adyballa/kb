/* global GD */
/* jshint devel: true */
/**
 * @file GD-Standalone Abstrakter Log-Writer
 */
(function(GD) {

    "use strict";

    /**
     * <p>
     * Konfigurationssetting.
     * </p>
     * @memberOf GD.Core.Log#
     * 
     * @property {object} config
     * @property {boolean} config.priority default=3 Prioritaet ist 3.
     * @property {string=} config.key default=_ Key zum finden Log
     */
    var config = {
            priority : 3,
            key: "_"
    };

    GD.NS('Core', 'Log', 'Writer', config);

    /**
     * @memberOf GD.Core.Log
     * @constructs Writer
     * @abstract
     * @author Andreas Dyballa
     *
     * <h5>GD-Standalone abstrakter Log-Writer</h5>
     * Es wird sich an Zend orientiert.
     * Ein Writer schreibt die Logs.
     *
     * @see {@link http://framework.zend.com/manual/2.3/en/modules/zend.log.overview.html|Zend-log}
     */
    GD.Core.Log.Writer.constructor = function() {};

    /**
     * @memberOf GD.Core.Log.Writer#
     * @prototype
     * 
     * @param {GD.Core.Log.Event} event
     */
    GD.Core.Log.Writer.prototype.write = function(event){
        return this.doWrite(event);
    };

    /**
     * Interface: <b>Muss vom konkreten Logger ueberschrieben werden.</b>
     *
     * @memberOf GD.Core.Log.Writer#
     * @function doWrite
     * @instance
     * @abstract
     *
     * @param {GD.Core.Log.Event} event
     */
    GD.Core.Log.Writer.prototype.doWrite = function(event){
        return null;
    };

    /**
     * @memberOf GD.Core.Log.Writer#
     * @prototype
     * 
     * @returns {string}
     */
    GD.Core.Log.Writer.prototype.getKey = function(){
        return this.config.key;
    };

    /**
     * @memberOf GD.Core.Log.Writer#
     * @prototype
     * 
     * @param {string} key
     */
    GD.Core.Log.Writer.prototype.setKey = function(key){
        this.config.key = key;
    };
    
    /**
     * @memberOf GD.Core.Log.Writer#
     * @prototype
     * 
     * @returns {string}
     */
    GD.Core.Log.Writer.prototype.getPriority = function(){
        return this.config.priority;
    };

    /**
     * @memberOf GD.Core.Log.Writer#
     * @prototype
     * 
     * @param {string|priority} priority
     */
    GD.Core.Log.Writer.prototype.setPriority = function(priority){
        this.config.priority =  GD.Core.Log.priorities(priority);
    };
    
    /**
     * @memberOf GD.Core.Log.Writer#
     * @prototype
     * 
     * @param {GD.Core.Log.Event} event
     * @returns {Array}
     */
    GD.Core.Log.Writer.prototype.format = function(event){
        return [event.message];
    };
})(GD);
