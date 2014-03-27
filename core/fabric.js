/* global GD */
/**
 * @file GD-Core Fabric: Erzeugt GD-Objekte
 */
(function(GD) {

    "use strict";
    
    /**
     * creates Object
     * @memberOf GD.Core.Fabric
     * @function
     * @private
     *
     * @param {Function} ns
     * @param {Object} props
     * @param {Function} initProperties
     * @param {Object} objConfig
     * @param {Object} obj
     * @returns {Object} GD-Object
     */
    var _create = function(ns, props, initProperties, objConfig, obj, constructParams){
        var proto = ('prototype' in ns) ? ns.prototype : {},
                ctx = Object.create((proto === undefined) ? {} : proto, props);
        /*
         * Ueberschreibt NS-Config mit object-settings NS-Config ist schon durch
         * den Configure gelaufen
         */
        ctx.config = GD.extend(ns.config);
        GD.extend(objConfig, ctx.config, true);
        if(obj){
            _mixin.call(obj, ctx);
        }

        if ('constructor' in ns) {
            /*
             * Im Constructor koennen wieder Objekte erzeugt werden deshalb wird
             * die statische private Variable, erst spaeter gesetzt.
             */
            ns.constructor.apply(ctx, constructParams);
        }

        initProperties(ctx);
        ctx = _inherit(ns, ctx, ctx.config, constructParams);
        
        if ('register' in ns && ns.register) {
            GD.register(ctx);
        }

        return ctx;
    },
    

    /**
     * inherits Object not the prototype
     * @memberOf GD.Core.Fabric
     * @function
     * @private
     *
     * @param {Function} ns current Namespace
     * @param {Object} obj zu erweiterndes Objekt
     * @param {Object} config Konfigurationsobjekt
     * @param {Array} constructParams
     */
    _inherit = function(ns, obj, config, constructParams){
        var parent = {};
        for(var i = 0, j = ns.parents.length; i < j; i++){
            parent = _create(
                        ns.parents[i], 
                        ('properties' in ns.parents[i]) ? ns.parents[i].properties : {}, 
                        ns.parents[i].fabric.initProperties, 
                        config, 
                        ns.parents[i].fabric,
                        constructParams);
            obj = GD.extend(parent, obj, false, true);
            obj.parent = parent;
        }
//        if('parent' in ns){
//            obj.parent = ns.parent;
//        }
        return obj;
    },

    /**
     * Standard-mixins fuer alle Objekte
     * @memberOf GD.Core.Fabric
     * @function
     * @private
     *
     * @param {Object} obj
     */
    _mixin = function(obj){
        var i = 0, j = 0;
        if(GD.isRunning('development')){
            for(i = 0, j = GD.Core.Fabric.mixins.obj.development.length; i < j; i++){
                GD.Core.Fabric.mixins.obj.development[i](obj, this);;
            }
        }
        for(i = 0, j = GD.Core.Fabric.mixins.obj.all.length; i < j; i++){
            GD.Core.Fabric.mixins.obj.all[i](obj, this);;
        }
   },
    
    /**
     * Standard-mixins fuer alle NS
     * @memberOf GD.Core.Fabric
     * @function
     * @private
     *
     * @param {Function} ns
     */
    _mixinNS = function(ns){
        
    },
    
    /**
     * mixinObj-Function
     * @memberOf mixinObj
     * @function
     * @private
     *
     * @returns {mixinObj}
     */
    mixinObj = function(){
        this.development = [];
        this.all = [];

        /**
         * adds Mixin-object
         */
        this.add = function(type, mixin){
            this[type].push(mixin);
        };

        /**
         * remove mixin-object
         */
        this.remove = function(type, i, mixin){
            var j = this[type].length;
            if(typeof mixin === "function"){
                i = 0;
                while(i<j && this[type][i] !== mixin){
                    i++;
                }
            }
            if(i < j){
                this[type].slice(i,1);
            }
        };
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
     * @memberOf GD.Core.Fabric
     *
     * @property {Object} mixins
     * @property {mixinObj} mixins.ns
     * @property {mixinObj} mixins.obj
     */
    GD.Core.Fabric.mixins = {
        "ns" : new mixinObj(),
        "obj" : new mixinObj()
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
     * Mixt source in dest.
     * Ein Objekt(source) uebergibt Eigenschaften einem anderen(dest).
     * 
     * @memberOf GD.Core.Fabric
     * 
     * @param dest Ziel-objekt
     * @param source Quell-objekt
     * @param fOverride
     */
    GD.Core.Fabric.mixin = function(dest, source, fOverride){
        for(var i in source){
            if(source.hasOwnProperty(i) && (fOverride || !(i in dest))){
                dest[i] = source[i];
            }
        }
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
        Fabric.nsPath = dArguments;
        return Object.create(Fabric, GD.Core.Fabric);
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
        if (typeof this.nsPath[this.nsPath.length - 1] === "object") {
            this.objConfig = this.nsPath.pop();
        }
        this.ns = this.getNS(this.nsPath, fForce);
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
        var res = function() {
            var fabric = GD.Fabric.apply(GD, nsPath);
            return fabric.exporting.apply(fabric, arguments);
        };
        res.parents = [];
        res.nsPath = nsPath;
        res.fabric = GD.Core.Fabric.getFabric.apply(GD.Core.Fabric, [nsPath]);
        return res;
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
     * Creates and returns Namespace. Es erzeugt den Prototypen aus 
     * dem Prototypen der Eltern. Danach kann der Prototype einfach benutzt werdebn.
     * Auch wegen Fluent Interface kann NS immer weiter erweitert werden. 
     * Die erste Vererbung ist massgeblich und entscheidet den Konstruktor (instanceof). 
     * Also keine Mehrfachvererbung. Die weiteren Aufrufe fuegen neue Methoden und
     * Eigenschaften hinzu.
     * 
     * @memberOf GD.Core.Fabric
     * 
     * @param {Object} nsConfig NS-Configuration-settings
     * @param {Object=} parent Parent-object for inheritance
     * @returns {GD.Core.Fabric.NS}
     */
    GD.Core.Fabric.prototype.NS = function(nsConfig, parent) {
        var config = GD.Config, fMixin = false;
        this.ns = this.getNS(this.nsPath, true);
        if (parent) {
            if (!GD.isEmpty(this.ns.prototype)) {
                // this.ns.prototype = Object.create(parent.prototype);
                this.ns.prototype = GD.extend(parent.prototype, this.ns.prototype, true);
                // this.ns.prototype.prototype =
                // Object.create(parent.prototype);
            } else {
                this.ns.prototype = Object.create(parent.prototype);
                this.ns.parent = this.ns.prototype;
                fMixin = true;
            }
            this.ns.parents.push(parent);
        }
        this.ns.config = GD.extend(GD.configure(this.nsPath), nsConfig, true);
        for ( var i = 0, j = this.nsPath.length; i < j; i++) {
            if (!(this.nsPath[i] in config)) {
                config[this.nsPath[i]] = {};
            }
            config = config[this.nsPath[i]];
        }
        config = this.ns.config;
        if(fMixin){
            _mixinNS(this.ns);
        }
        return this.ns;
    };

    /**
     * creates Object
     * @memberOf GD.Core.Fabric
     *
     * @returns {Object} GD-Object
     */
    GD.Core.Fabric.prototype.create = function() {
        var obj = _create(this.ns, this.buildProperties(), this.initProperties, this.objConfig, this, arguments);
        return obj;
    };

    /**
     * creating an object and exporting for
     * save use
     *
     * @memberOf GD.Core.Fabric
     *
     * @returns {Object} GD-Object
     */
    GD.Core.Fabric.prototype.exporting = function() {
        var params = GD.Core.Convert.array(arguments), obj = {}, res = {};
        this.objConfig = params.pop();
        obj = this.create.apply(this, params);
        for(var i in obj){
            if(i.charAt(0) !== "_"){
                if(typeof obj[i] === "function"){
                    res[i] = obj[i].bind(obj);
                }else{
                    res[i] = obj[i];
                }
            }
        }
//        _mixin.call(this, res);
        return res;
    };

    /**
     * Gibt qualufizierten Name/URI des NS zurueck
     * @memberOf GD.Core.Fabric
     * 
     * @returns {String}
     */
    GD.Core.Fabric.prototype.nsURI = function() {
        return GD.global.__LIB__.toLowerCase()+":"+this.nsPath.join(":").toLowerCase();
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
     * Mixt/Injektiert einen NS in den aktuellen.
     * Es werden nur statische und prototype-Methoden
     * benutzt.
     *
     * @memberOf GD.Core.Fabric
     * 
     * @returns GD.Core.Fabric
     */
    GD.Core.Fabric.prototype.mixinNS = function(ns) {
        /* static mixin */
        this.ns = GD.Core.Fabric.mixin(this.ns, ns);
        /* prototype mixin */
        GD.Core.Fabric.mixin(this.ns.prototype, ns.prototype);
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
})(GD);