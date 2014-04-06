/**
 * @fileName main.js
 *
 * Diese Datei wird im Developermodus benutzt um die
 * Snippets zu laden.
 */

/**
 * @param {mixed}
 *            global
 */
(function(global) {

    'use strict';

    /**
     * @namespace
     * 
     * Local Loading NS
     * 
     * @type Load
     */
    var Load = {

        /**
         * Erzeugt zufaellige GUID
         * 
         * @return {String}
         */
        guid : "",

        /**
         * @type XMLHttpRequest
         */
        client : {},
        
        /**
         * erzeugt GUID
         */
        createGuid : function(){
            var s4 = function() {
                return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
            };
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        },

        /** @type HTMLHtmlElement */
        script : (function(scripts) {
            var i = 0, ln = scripts.length;
            while (!(/.*main\.js$/.test(scripts[i].src)) && i < ln) {
                i++;
            }
            return scripts[i];
        }(global.document.getElementsByTagName("script"))),

        /**
         * Defintion
         * 
         * @type {Array}
         */
        definition : [],

        /**
         * Zusaetzliche Dateien zu Modulen
         */
        additionalFiles : "",

        /**
         * @type {Array} loaded Files
         */
        files : [],

        /**
         * @type {Object} loaded Tasks
         */
        tasks : {},
        
        /**
         * Current task - set via data-task
         * @type {String}
         */
        task : "",
        
        /**
         * Current production-file - set via data-production-file
         * @type {String}
         */
        productionFile : "",
        
        /**
         * Current async - set via data-async
         * if async is set true, loading all files
         * is not finished after the main-script-tag
         *
         * @type {bool}
         */
        async : false,

        /**
         * Settings aus den JSON-Defintionen
         */
        settings : {},

        /**
         * Root-pfad wird berechnet
         */
        root : "",

        /**
         * Logging
         *
         * @param {mixed} mssg
         * @param {String} method
         */
        verbose : function(mssg, method){
            if(this.config.verbose){
                if(typeof mssg === "Object"){
                    console.dir(mssg);
                }else{
                    method = method || "log";
                    console[method](mssg);
                }
            }
        },

        /**
         * loads script
         * 
         * @memberOf Load
         * @private
         * 
         * @param {String} fileName
         * @param {Function} callback
         */
        loadScript : function(fileName, callback, fragment, i, async) {
            // get some kind of XMLHttpRequest
            var se = document.createElement('script');
            se.type = "text/javascript";
            se.src = fileName;
            se.async = async;
            se.onreadystatechange = function() {
                if (this.readyState == 'complete')
                    callback(i);
            };
            se.onload = function() {
                callback(i);
            };
            fragment.parentNode.insertBefore(se, fragment);
        },

        /**
         * loads all files
         * 
         * @memberOf LOAD
         */
        load : function() {
            var i = 0, j = this.files.length,
            loadFile = function(file, i){
                this.files.i = i;
                
                this.loadScript(this.root + file, function(i) {
                    var file = this.files[i];
                    this.verbose("Load.load File nr "+i+" : " + file+" is loaded");
                    if(this.files.hasDi && i < j-1){
                        this.verbose("DI Container ist geladen - laedt Datei "+file);
                        GD.Core.Di.get(this.files[i+1]);
                    }
                    if (file === "core/core.js" && this.script.getAttribute('data-config')) {
                        // GD.Config = GD.extend(GD.Config, LOAD.Config);
                        // GD = frag.contentWindow.GD;
                        GD.runningMode = this.settings.runningMode;
                        GD.Config.settings = this.settings;
                        GD.Config.Core.root = this.root;
                    }
                    if (i === j - 1) {
                        GD._isReady = true;
                        GD.Core.Event.dispatch("gd:load");
                        if(!this.async){
                            this.verbose("GUID ist "+this.guid);
                            this.client.open('GET', 'http://' + this.settings.host + ':' + this.settings.nodejsserver.port +
                                    "/wait/modulesAreLoaded?id=" + this.guid, false);
                            this.client.send();
                        }
                        this.verbose("LOAD is save", "info");
                        // GD.INIT(false);
                    }
                    if(file === "core/dependency_injection.js"){
                        this.verbose("GUID ist "+this.guid);
                        this.files.hasDi = true;
                        if(this.async){
                            this.client.open('GET', 'http://' + this.settings.host + ':' + this.settings.nodejsserver.port +
                                    "/wait/modulesAreLoaded?id=" + this.guid, false);
                            this.client.send();
                        }
                        
                        while(i<j-1){
                            i++;
                            loadFile(this.files[i], i);
                        }
                    }
                }.bind(this), this.script, i, false);
            }.bind(this);
            
            this.files.hasDi = false;
            
            while(i<j && this.files[i] !== "core/dependency_injection.js"){
                loadFile(this.files[i], i);
                i++;
            }
            loadFile(this.files[i], i);
            
        },
        
        /**
         * Erzeugt XMLHttpRequest-objekt
         *
         * @type XMLHttpRequest
         */
        createXMLHTTPObject : function() {
            var XMLHttpFactories = [ function() {
                return new XMLHttpRequest();
            }, function() {
                return new ActiveXObject("Msxml2.XMLHTTP");
            }, function() {
                return new ActiveXObject("Msxml3.XMLHTTP");
            }, function() {
                return new ActiveXObject("Microsoft.XMLHTTP");
            } ],

            _createXMLHTTPObject = function() {
                var xmlhttp = false;
                for ( var i = 0; i < XMLHttpFactories.length; i++) {
                    try {
                        xmlhttp = XMLHttpFactories[i]();
                    } catch (e) {
                        continue;
                    }
                    break;
                }
                return xmlhttp;
            };

            return _createXMLHTTPObject();
        },

        /**
         * @memberOf Load
         *
         * setzt das Produkionsfile nach folgender Regel:
         * Das Attribut "data-production-file" im Main-script-tag
         * hat Vorrang. Danach wird untersucht ob in der Modul-konfiguration
         * die Produktionsdatei gesetzt ist, wenn nur ein Modul geladen wird.
         * Als letztes wird in den Settings nach production_file gesucht.
         */
        setProductionFile : function(){
            this.productionFile = this.script.getAttribute('data-production-file');
            if(!this.productionFile){
                if(this.task.indexOf(",")===-1){
                    this.productionFile = this.definition.modules[this.task].production_file;
                }
                if(!this.productionFile){
                    this.productionFile = this.settings.production_file;
                }
            }
        },

        /**
         * Initialisiert wichtige Variablen
         */
        init : function(){
            var configName;
            this.root = this.script.src.replace(/([^\/]+)$/, "").replace(/http\:\/\/([^\/]+)/, "");
            this.client = this.createXMLHTTPObject();
            this.guid = this.createGuid();
            configName = this.script.getAttribute('data-config');
            this.additionalFiles = this.script.getAttribute('data-files');
            this.client.open('GET', this.root + 'config.project.json', false);
            this.client.send();
            this.definition = JSON.parse(this.client.responseText);
            this.settings = this.definition['settings'];
            this.task = this.script.getAttribute('data-task');
            this.async = this.script.getAttribute('data-async');
            this.async = (this.async && (this.async.toLowerCase() === "true" || this.async === "1")) ? true : false;
            this.setProductionFile();
            global.__LIB__ = this.settings.libname;
            global[global.__LIB__] = function(){};
            global[global.__LIB__].Config = global[configName];
            this.config = global[global.__LIB__].Config.general;
            global[global.__LIB__].Config.Core = CONFIG.Core || {};
            global[global.__LIB__].Config.Core.root = this.root;
            global[global.__LIB__].Config.Core.task = this.task;
            this.client.open('GET', this.root + 'modules.core.json', false);
            this.client.send();
            global[global.__LIB__].Config._Modules_ = JSON.parse(this.client.responseText);
            for(var i in this.definition.modules){
                if(this.definition.modules.hasOwnProperty(i)){
                    global[global.__LIB__].Config._Modules_[i] = this.definition.modules[i];
                }
            }
        },

        /**
         * setzt files mit allen benoetigten Dateien
         */
        getModules : function() {
            this.client.open('GET', 'http://' + this.settings.host + ':' + this.settings.nodejsserver.port +
                    "/info/getModules?tasks=" + this.task + "&files=" +
                    (this.additionalFiles || ''), false);
            this.client.send();
            this.files = JSON.parse(this.client.responseText);
        },

        /**
         * Schreibt eine synchrone Skript-Datei vom Node-js-Server.
         * Der beendet die Datei erst wenn die Methode "load"
         * die Datei modulesAreLoaded anfordert oder settings.timeout ablaeuft.
         */
        waitUntilAllModulesAreLoaded : function() {
            this.verbose("waitUntilAllModulesAreLoaded GUID:"+this.guid);
            document.writeln("<script src=\"http://" + this.settings.host + ":" + this.settings.nodejsserver.port +
                    "/wait/loadIsFinished?id=" + this.guid+"\"></script>");
        }
    };

    // global.module = {};
    // LOAD.body = null;

    Load.init();
    if(Load.settings.runningMode == "development"){
        Load.getModules();
        Load.load();
        Load.waitUntilAllModulesAreLoaded();
    }
    if(Load.settings.runningMode == "production"){
        Load.loadScript("../"+Load.productionFile, function(){}, Load.script, 0, Load.async);
        GD._isReady = true;
        GD.Core.Event.dispatch("gd:load");
    }
    // Exportieren?
    // global.LOAD = LOAD;
})(this);
