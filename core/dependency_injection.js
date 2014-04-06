/* global GD */
/**
 * @file Dependency Injection
 */
(function(GD) {

    "use strict";

    /**
     * Konfigurationssetting
     * @memberOf GD.Core.Di
     *
     * @property {object} config leer
     */
    var config = {},
    
    /**
     * fuehrt die Definition/Map
     * @memberOf GD.Core.Di
     * @private
     *
     * @property {object} map
     * @property {object} map.files
     */
    map = {
            files : {}
    },

    /**
     * Logging
     *
     * @param {mixed} mssg
     */
    verbose = function(mssg){
        if(this.config.verbose){
            if(typeof mssg === "Object"){
                console.dir(mssg);
            }else{
                console.log(mssg);
            }
        }
    },
    
    /**
     * Initialisiert die Map
     *
     * @memberOf GD.Core.Di
     * @private
     * @function
     */
    init = function(){
        var task = require(GD.Config.Core.root+"/nodeserver/task.js"), priority;
        
        GD.Config.Core.task.split(",").forEach(function(module) {
            
            verbose("Task " + module);
            if(module){
                task.getFiles(module);
            }
        });
        task.modules.forEach(function(module){
            GD.extend(GD.Config._Modules_[module].injection, map.files, true);
        });
        
        /* --- setzt Log-Writer --- */
        ["development", "production"].forEach(function(modi){
            ["log", "error"].forEach(function(mixin){
                if(GD.isRunning(modi)){
                    GD.extend(task.all_modi[mixin], task[modi][mixin], true, true);
                    for(var writer in task[modi][mixin].writer){
                        priority = task[modi][mixin].writer[writer].priority;
                        GD.Log(mixin).addWriter(GD.Fabric("Core", "Log", "Writer", writer,{
                            key : String(writer).toLowerCase(),
                            priority : priority
                        }).create());
                    }
                    if('format' in task[modi][mixin]){
                        GD.Log(mixin).setFormat(GD.Fabric.apply(GD.Fabric, task[modi][mixin]['format']['ns'].concat(task[modi][mixin]['format']['config'])).create());
                    }
                }
            });
        });
        
        verbose(map.files);
    };

    GD.NS('Core', 'Di', config);

    verbose = verbose.bind(GD.Core.Di);
    init();

    /**
     * Erzeugt einen DI-Container aus der Datei
     * @memberOf GD.Core.Di
     *
     * @param {string} file
     */
    GD.Core.Di.get = function(file){
        var di;
        verbose("GD.Core.Di.get file:"+file);
        if(file in map.files){
            verbose("GD.Core.Di.get file:"+file);
            di = GD.Fabric("Core", "Di").create(map.files[file]);
            GD.Ns = di.ns();
            GD.Ns.Di = di;
        }else{
            verbose(map);
            verbose("Fuer die Datei "+file+" existiert keine Injection", map);
            GD.Ns = {
                    Di : {}
            };
        }
        GD.Ns.Di.file = file;
    };

    /**
     * @constructs Di
     * @memberOf GD.Core
     * @author Andreas Dyballa
     * @param {object} definition
     * @returns {GD.Core.Di} instance
     */
    GD.Core.Di.constructor = function(definition){
        this.definition = definition;
        this.objs = {};
        verbose = verbose.bind(this);
    };

    /**
     * Gibt Objekt aus DI-Container zurueck
     *
     * @param {string} id
     * @returns {object}
     */
    GD.Core.Di.prototype.get = function(id){
        if(!(id in this.objs)){
            if(id in this.definition){
                if(!("create" in this.definition[id])){
                    this.definition[id]["create"] = "create";
                }
                this.objs[id] = this[this.definition[id]["create"]](this.definition[id]);
            }else{
                this.error.warn("DI-Container gibt es nicht zu id "+id);
            }
        }
        return this.objs[id];
    };

    /**
     * Erzeugt ein Objekt
     * 
     * @param {object} container
     * @returns {object} 
     */
    GD.Core.Di.prototype.create = function(container){
        var fabric = GD.Fabric.apply(GD.Fabric, container.ns);
        return fabric.create.apply(fabric, container.parameters);
    };

    /**
     * erzeugt einen Namensraum
     *
     * @returns {Object}
     */
    GD.Core.Di.prototype.ns = function(){
        var parent = {}, path = {};
        if('ns' in this.definition){
            if('parent' in this.definition.ns){
                parent = GD;
                for(var i = 0, j = this.definition.ns.parent.length; i < j; i++){
                    parent = parent[this.definition.ns.parent[i]];
                }
                return GD.NS.apply(GD.NS, this.definition.ns.path.concat(this.definition.ns.config).concat(parent)).ns;
            }
            path = (this.definition.ns.config) ? this.definition.ns.path.concat(this.definition.ns.config) : this.definition.ns.path;
            return GD.NS.apply(GD.NS, path).ns;
        }
        return {};
    };
})(GD);