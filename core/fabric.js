/* global GD */
/**
 * @file GD-Core Fabric: Erzeugt GD-Objekte
 */
(function(GD) {

    "use strict";
    
    /**
     * Ein GD-Namensraum
     * @name NS
     * @memberOf GD.Core.Fabric
     * @function
     * @returns {Object} GD-Object
     */

    var openPrivacy = function (_, ns, ctx, proto) {
        var _openPrivacy = function (func) {
            ctx[ns.openMethods[i]] = function () {
                ctx._ = _;
                var res = proto[func].apply(ctx, arguments);
                ctx._ = null;
                return res;
            };
        };

        if ('openMethods' in ns) {
            var i = ns.openMethods.length, func;
            while (i--) {
                _openPrivacy(ns.openMethods[i]);
                ctx[ns.openMethods[i]].func = func;
            }

        }
    };

    /**
     * <h5>Fabric-objekt</h5>
     * <p>Erweitert GD-Core um Fabrik.</p>
     * <p>
     * Call like var d = GD.Core.Fabric("Lib", "Node",
     * {obj_conf1:'test'}).create(constructor_arg1, constructor_arg2) d is now
     * an object of Class GD.Lib.Node with - private, privileged, public Classes
     * via Class-constructor, - is configured (Class > global-general > global >
     * object), - has build Properties (look to Object.create) and - is
     * registered at GD.
     * </p>
     * @example var d = GD.Core.Fabric("Lib", "Node", {obj_conf1:'test'}).create(constructor_arg1, constructor_arg2);
     * //d ist nun ein GD-Lib-Node-Objekt. Es hat die Konfiguration obj_conf1 mit Wert test. 
     * 
     * @constructs Fabric
     * @memberOf GD.Core
     * @author Andreas Dyballa
     * 
     * @returns {GD.Core.Fabric} GD-Object
     */
    GD.Core.Fabric = function() {
        /**
         * object Configuration
         *
         * @memberOf GD.Core.Fabric
         * @member objConfig
         * @instance
         * @privileged
         * @protected
         * @type {Object}
         */
        this.objConfig = {};

        /**
         * current GD-NS
         *
         * @memberOf GD.Core.Fabric
         * @member ns
         * @instance
         * @privileged
         * @protected
         * @type {GD.Core.Fabric.NS}
         */
        this.ns = null;

        /**
         * current GD-NS-Path as Array
         *
         * @memberOf GD.Core.Fabric
         * @member nsPath
         * @instance
         * @privileged
         * @protected
         * @type {Array}
         */
        this.nsPath = [];
    };

    /**
     * initialize Configuration
     * @memberOf GD.Plugins.Fabric
     * 
     * @param {Array=} path property
     * @returns {string}
     */
    GD.Fabric.getAttributeName = function(path) {
        return "data-gd-" + path.join("-").toLowerCase();
    };

    /**
     * Setzt Namespace
     * @memberOf GD.Plugins.Fabric
     * 
     * @param {Array} nsPath
     * @param {boolean} fForce NameSpace wird erzwungen, heißt wenn nicht vorhanden,
     *            wird es gebaut
     */
    GD.Core.Fabric.prototype.setNS = function(nsPath, fForce) {
        this.nsPath = nsPath;
        if (typeof this.nsPath[this.nsPath - 1] === "object") {
            this.objConfig = this.nsPath.pop();
        }
        this.ns = this.getNS(this.nsPath, fForce);
    };

    /**
     * returns Fabric
     * @memberOf GD.Core.Fabric
     * @protected
     * 
     * @returns {GD.Core.Fabric} GD-Fabric
     */
    GD.Core.Fabric.getFabric = function() {
        var clss = GD, param = "", dArguments = arguments[0], j = dArguments.length, params = [], isIn = false, Fabric = GD.Core.Fabric;
        for ( var i = 0; i < j; i++) {
            param = dArguments[i];
            params.push(param);
            if (param in clss) {
                clss = clss[param];
                if ('Fabric' in clss) {
                    Fabric = clss.Fabric;
                }
            } else {
                break;
            }
        }
        Fabric = new Fabric();
        return Object.create(Fabric, GD.Core.Fabric);
    };

    /**
     * erzeugt Namensraum
     * @memberOf GD.Core.Fabric
     * @private
     * 
     * @param {Array} nsPath Namensraum-pfad
     * @returns {GD.Core.Fabric.NS} ns Namensraum
     */
    GD.Core.Fabric.prototype.createNS = function(nsPath) {
        return function() {
        };
    };

    /**
     * Existiert GD-NS?
     * @memberOf GD.Core.Fabric
     * 
     * @param {Array} nsPath
     * @returns {boolean}
     */
    GD.Core.Fabric.NSExists = function(nsPath) {
        var clss = GD, param = "", i = 0, params = [];
        for (i = 0; i < nsPath.length; i++) {
            param = nsPath[i];
            params.push(param);
            if (param in clss) {
                clss = clss[param];
            } else {
                return false;
            }
        }
        return true;
    };

    /**
     * builds and validates GD-NS
     * @memberOf GD.Core.Fabric
     * @private
     * 
     * @param {Array} nsPath
     * @param {boolean} fForce
     * @returns {GD.Core.Fabric.NS} GD-NS
     */
    GD.Core.Fabric.prototype.getNS = function(nsPath, fForce) {
        var clss = GD, param = "", i = 0, params = [];
        for (i = 0; i < nsPath.length; i++) {
            param = nsPath[i];
            params.push(param);
            if (param in clss) {
                clss = clss[param];
            } else {
                if (fForce) {
                    clss[param] = this.createNS(params);
                    clss = clss[param];
                } else {
                    throw new Error("invalid Namespace " + param);
                }
            }
        }
        return clss;
    };

    /**
     * Creates and returns Namespace Kann vererben. Auch wegen Fluent Interface
     * kann NS immer weiter erweitert werden. Die erste Vererbung ist
     * massgeblich und entscheidet den Konstruktor (instanceof). Also keine
     * Mehrfachvererbung. Die weiteren Aufrufe fuegen neue Methoden und
     * Eigenschaften hinzu.
     * 
     * @memberOf GD.Core.Fabric
     * 
     * @param {Object} nsConfig NS-Configuration-settings
     * @param {Object=} parent Parent-object for inheritance
     * @returns {GD.Core.Fabric.NS}
     */
    GD.Core.Fabric.prototype.NS = function(nsConfig, parent) {
        var config = GD.Config;
        this.ns = this.getNS(this.nsPath, true);
        if (parent) {
            if (!GD.isEmpty(this.ns.prototype)) {
                // this.ns.prototype = Object.create(parent.prototype);
                this.ns.prototype = GD.extend(parent.prototype, this.ns.prototype, true);
                // this.ns.prototype.prototype =
                // Object.create(parent.prototype);
            } else {
                this.ns.prototype = Object.create(parent.prototype);
            }
        }
        this.ns.config = GD.extend(GD.configure(this.nsPath), nsConfig, true);
        for ( var i = 0, j = this.nsPath.length; i < j; i++) {
            if (!(this.nsPath[i] in config)) {
                config[this.nsPath[i]] = {};
            }
            config = config[this.nsPath[i]];
        }
        config = this.ns.config;
        return this.ns;
    };

    /**
     * creates Object
     * @memberOf GD.Core.Fabric
     *
     * @returns {Object} GD-Object
     */
    GD.Core.Fabric.prototype.create = function() {
        var proto = ('prototype' in this.ns) ? this.ns.prototype : {}, props = this.buildProperties(), ctx = Object
                .create((proto === undefined) ? {} : proto, props), _ = null;
        if ('constructor' in this.ns) {
            /*
             * Im Constructor koennen wieder Objekte erzeugt werden deshalb wird
             * die statische private Variable, erst spaeter gesetzt.
             */
            _ = this.ns.constructor.apply(ctx, arguments);
            openPrivacy(_, this.ns, ctx, proto);
        }

        this.initProperties(ctx);
        /*
         * Ueberschreibt NS-Config mit object-settings NS-Config ist schon durch
         * den Configure gelaufen
         */
        ctx.config = GD.extend(this.objConfig, this.ns.config, true);

        if ('register' in this.ns && this.ns.register) {
            GD.register(ctx);
        }

        return ctx;
    };

    /**
     * initialize properties with values
     * @memberOf GD.Core.Fabric
     * @protected
     * 
     * @param {Object} GD-Object
     * @param {Array} props
     * @returns {Object} Object
     */
    GD.Core.Fabric.prototype.initProperties = function(ctx, props) {
    };

    /**
     * registriert kommende Objekte
     * @memberOf GD.Core.Fabric
     * 
     * @returns GD.Core.Fabric
     */
    GD.Core.Fabric.prototype.register = function() {
        this.ns.register = true;
        return this;
    };

    /**
     * open Scope of privates to public methods
     * @memberOf GD.Core.Fabric
     * 
     * @returns GD.Core.Fabric
     */
    GD.Core.Fabric.prototype.openMethods = function() {
        this.ns.openMethods = Array.prototype.slice.call(arguments, 0);
        return this;
    };

    /**
     * builds Properties
     * @memberOf GD.Core.Fabric
     * 
     * @returns {Object} Object
     */
    GD.Core.Fabric.prototype.buildProperties = function() {
        var properties = ('properties' in this.ns) ? this.ns.properties : {};
        return properties;
    };

    /**
     * Creates and returns Class
     * @memberOf GD.Core.Fabric
     * @deprecated
     * TODO entfernen
     * 
     * @param {Object} parent
     * @returns {GD.Core.Fabric.NS}
     */
    GD.Core.Fabric.prototype.Class = function(parent) {
        var res = function() {
        };
        if (parent) {
            res.prototype = Object.create(parent.prototype);
        }
        return res;
    };
})(GD);