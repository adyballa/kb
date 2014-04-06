/* global GD, CONFIG */
/**
 * @file Diese Datei ist fuer die Kompatibilitaet zwischen allen 
 * GD-JS-Objekte zustaendig. Sie wird als erstes eingebunden.
 */

/**
 * Alle Interfaces werden hier gesammelt.
 * Sie existieren nur virtuell.
 * 
 * @namespace Interface
 */

/**
 * @param {window|mixed} global
 */
(function(global) {

    "use strict";

    /**
     * Generation Digitale Namespace
     * 
     * Cycles are: - configure... after core is load, before classes are loaded -
     * init - prepareRun - run
     * 
     * @namespace GD
     * @author Andreas Dyballa
     * @type GD
     */
    var GD = global.GD || function() {
    },

    /**
     * all registered objects
     * @memberOf GD
     * @member obj
     * @instance
     * @private
     * 
     * @type {Array}
     */
    objs = [],

    /**
     * Aktuelle Fabrik
     * @memberOf GD
     * @member fabric
     * @instance
     * @private
     * 
     * @type {GD.Core.Fabric}
     */
    fabric = null;

    /**
     * HTML-Document of Window
     * @memberOf GD
     * @member doc
     * @instance
     * @public
     * 
     * @type {HTMLDocument}
     */
    GD.doc = global.document;

    /**
     * Window
     * @memberOf GD
     * @member win
     * @instance
     * @public
     * 
     * @type {Window|mixed}
     */
    GD.global = global;

    /**
     * Framework is running in which mode?
     * Wert ist production, development oder test.
     *
     * @memberOf GD
     * @member runningMode
     * @default "production"
     * @instance
     * @private
     * 
     * @type {string}
     */
    GD.runningMode = "production";
    
    /**
     * Ist alles geladen
     * @memberOf GD
     * @member isReady
     * @default false
     * @instance
     * @private
     * 
     * @type {boolean}
     */
    GD._isReady = false;

    /**
     * <p>
     * Konfigurationssetting.
     * </p>
     * @memberOf GD
     * 
     * @property {Object} config
     * @property {Object} config.lifeCycleAutomation
     * @property {boolean} config.lifeCycleAutomation.init default=true
     * @property {boolean} config.lifeCycleAutomation.prepareRun default=true
     * @property {boolean} config.lifeCycleAutomation.run default=true
     * @property {boolean} config.lifeCycleAutomation.destroy default=true
     */
    GD.config = {
        lifeCycleAutomation : {
            init : true,
            prepareRun : true,
            run : true,
            destroy : true
        }
    };

    /**
     * Alle Module sind geladen. GD ist bereit.
     * @memberOf GD
     *
     * @param {Function} callback
     */
    GD.isReady = function(callback){
        if(GD._isReady){
            callback();
        }else{
            GD.Core.Event.add("gd:load", callback);
        }
    };

    /**
     * Is it running in Mode mode
     * @memberOf GD
     *
     * @param {string} mode (production|development|test)
     * @returns {boolean}
     */
    GD.isRunning = function(mode){
        return (GD.runningMode === mode);
    };

    /**
     * returns Fabric for the calculated NS
     * @memberOf GD
     * 
     * @example var d = GD.Fabric("Lib", "Node", {obj_conf1:'test'}).create(constructor_arg1, constructor_arg2);
     * //d ist nun ein GD-Lib-Node-Objekt. Es hat die Konfiguration obj_conf1 mit Wert test. 
     * 
     * @param {...string} nsPath Namensraum
     * @param {Object} [config] optionale Konfiguration
     * @return {GD.Core.Fabric}
     */
    GD.Fabric = function() {
        var params = Array.prototype.slice.call(arguments, 0);
        fabric = GD.Core.Fabric.getFabric(params);
        fabric.setNS(params);
        return fabric;
    };

    /**
     * Builds NameSpace Optional last Parameter could be <?config?>, <?parent?>
     * @memberOf GD
     * @example GD.NS("Lib", "Node", conf, parent);
     * //Erzeugt Namensraum GD.Lib.Node mit klassenweiter Konfiguration conf und vererbt von parent 
     * 
     * @param {...string} nsPath Namensraum
     * @param {Object} [config] optionale Konfiguration
     * @param {Object} [parent] optionales Elternobjekt
     * @returns {GD.Core.Fabric}
     */
    GD.NS = function() {
        var params = Array.prototype.slice.call(arguments, 0), config = {}, parent = null, i = params.length - 1;
        if (typeof params[params.length - 1] === "function") {
            parent = params[params.length - 1];
            i--;
        }
        if (typeof params[i] === "object") {
            config = params[i];
            i--;
        }
        params = params.slice(0, i + 1);
        fabric = GD.Core.Fabric.getFabric(params);
        fabric.setNS(params, true);
        fabric.NS(config, parent);
        return fabric;
    };

    /**
     * Stellt fest ob variable leer ist
     * @memberOf GD
     *
     * @param {mixed} a
     * @returns {boolean}
     */
    GD.isEmpty = function(a){
        if(Array.isArray(a)){
            return (!a.length);
        }
        if(!a){
            return true;
        }
        if(a instanceof Object){
            
            if(a instanceof Date){
                return false;
            }
            
            var props = Object.getOwnPropertyNames(a);
            if(props.length < 2){
                return (!props.length || props[0] === "constructor");
            }
        }
        return false;
    };

    /**
     * erweitert ein Objekt mit einem anderen.
     * @example var dest = {a:{b:12, c:11}}, source = {a:{b:13,d:15}};
     * GD.extend(source, dest);
     * //dest.a.c ist unbekannt
     * dest = {a:{b:12, c:11}}
     * GD.extend(source, dest, true);
     * //dest.a.c ist 11, dest.a.b ist 13 und dest.a.d=15
     * GD.extend(source, dest, true, true);
     * //dest.a.c ist 11 und dest.a.b ist 12 und dest.a.d=15
     * 
     * @memberOf GD
     * 
     * @param {Object} source Quelle
     * @param {Object} dest Destination/Zieö
     * @param {boolean} fDeep rekursive absteigen?
     * @param {boolean} fNoOverride Soll nicht ueberschrieben werden?
     * @return {Object}
     */
    GD.extend = function(source, dest, fDeep, fNoOverride) {
        if (typeof (dest) === "undefined"){
            dest = {};
        }
        for ( var i in source) {
            if (i !== undefined) {
                if (fNoOverride && typeof (dest[i]) !== "undefined"){
                    continue;
                }
                if (fDeep && source[i] && typeof (source[i]) === "object") {
                    dest[i] = GD.extend(source[i], dest[i] || ((Array.isArray(source[i])) ? [] : {}), fDeep,
                            fNoOverride);
                } else {
                    dest[i] = source[i];
                }
            }
        }
        return dest;
    };

    /**
     * clont ein Objekt
     * @memberOf GD
     * 
     * @param {Object} source
     */
    GD.clone = function(source) {
        if (source instanceof Node) {
            return source.cloneNode(true);
        }
        return Object.create(source);
    };

    /**
     * register Objects to do automatic cycles
     * @memberOf GD
     * 
     * @param {Object} obj GD-object/class
     */
    GD.register = function(obj) {
        objs.push(obj);
    };

    /**
     * entfernt Objekt aus der Registrierung
     * @memberOf GD
     * 
     * @param {Object} obj GD-object/class
     * @returns {boolean}
     */
    GD.unRegister = function(obj) {
        for(var i=0,j=objs.length;i<j;i++){
            if(objs[i] === obj){
                objs.splice(i, 1);
                return true;
            }
        }
        return false;
    };

    /**
     * Configures class there must be more than 2 arguments
     * @memberOf GD
     * 
     * @param {Object} objConfig Configuration from object
     * @param {Array} nsArray Namespace-array
     * @returm {Object} config
     */
    GD.configure = function(nsArray) {
        var conf = GD.Config, clss = GD, found = true, param = "";
        for ( var i = 0, j = nsArray.length; i < j; i++) {
            param = nsArray[i];
            if (found && typeof conf[param] === "object") {
                conf = conf[param];
            } else {
                found = false;
            }
            clss = clss[param];
        }
        return GD.extend((found) ? conf : {}, GD.extend(GD.Config.general || {}, clss.config, true), true);
    };

    /**
     * durchlaueft einen Lebenszyklus
     * @memberOf GD
     * @private
     * 
     * @param {string} lifeCycle
     */
    GD.runLifeCycle = function(lifeCycle) {
        if(GD.config.lifeCycleAutomation[lifeCycle]){
            objs.forEach(function(obj) {
                if (typeof obj[lifeCycle] === 'function'){
                    obj[lifeCycle]();
                }
            });
        }
    };

    /**
     * Verkehrt Keys und Values von einem Array
     * Methode wird von spaeter von Convert uebernommen.
     *
     * @param {Array} trans
     * @returns {Array}
     */
    GD.arrayFlip = function(trans){
        var key, tmp_ar = {};

        for ( key in trans ){
            if ( trans.hasOwnProperty( key ) )
            {
                tmp_ar[trans[key]] = key;
            }
        }

        return tmp_ar;
    };

    /**
     * Namespace Core All often used, necessary objects
     * 
     * will be created. If used globally as class, else as objects (IDE)
     * 
     * @namespace Core
     * @memberOf GD
     */
    GD.Core = function() {
    };

    /**
     * Namespace Lib will be created. All stand-alone classes which are not an
     * plugin found here.
     * 
     * @namespace Lib
     * @memberOf GD
     */
    GD.Lib = function() {
    };

    /**
     * Namespace JQuery will be created. All jQuery classes and plugin found
     * here.
     * 
     * @namespace JQuery
     * @memberOf GD
     */
    GD.JQuery = function() {
    };

    /**
     * Namespace Plugins will be created. All stand-alone plugins found here.
     * 
     * @namespace Plugins
     * @memberOf GD
     */
    GD.Plugins = function() {
    };

    /**
     * Configuration GD.<ns1>.<ns2>.config <=> GD.Config.<ns1>.<ns2>
     * 
     * The Configuration-object must be filled before the scripts are loaded
     * 
     * @memberOf GD
     */
    
    global.GD = GD;

})(this);