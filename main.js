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
        guid : (function() {
            var s4 = function() {
                return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
            };
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        }()),

        /**
         * @type XMLHttpRequest
         */
        client : {},

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
         * Sind alle Module geladen?
         */
        isSave : false,

        /**
         * Settings aus den JSON-Defintionen
         */
        settings : {},

        /**
         * Root-pfad wird berechnet
         */
        root : "",

        /**
         * loads script
         * 
         * @memberOf GD
         * @private
         * 
         * @param {String}
         *            fileName
         * @param {Function}
         *            callback
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
            var file = "";
            for ( var i = 0, j = this.files.length; i < j; i++) {

                file = this.files[i];
                this.files.i = i;
                this.loadScript(this.root + file, function(i) {
                    var file = this.files[i];
                    console.info("Load.load File nr "+i+" : " + file+" is loaded");
                    if (file === "core/core.js" && this.script.getAttribute('data-config')) {
                        // GD.Config = GD.extend(GD.Config, LOAD.Config);
                        // GD = frag.contentWindow.GD;
                        GD.runningMode = this.settings.runningMode;
                        GD.Config.settings = this.settings;
                        GD.Config.Core.root = this.root;
                    }
                    if (i === this.files.length - 1) {
                        this.isSave = true;
                        this.client.open('GET', 'http://' + this.settings.host + ':' + this.settings.nodejsserver.port +
                                "/wait/modulesAreLoaded?id=" + this.guid, false);
                        this.client.send();
                        GD.Core.Console.info("LOAD is save");
                        // GD.INIT(false);
                    }
                }.bind(this), this.script, i, false);
            }
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
         * Initialisiert wichtige Variablen
         */
        init : function(){
            this.root = this.script.src.replace(/([^\/]+)$/, "").replace(/http\:\/\/([^\/]+)/, "");
            this.client = this.createXMLHTTPObject();
            this.additionalFiles = this.script.getAttribute('data-files');
            this.client.open('GET', this.root + 'config.project.json', false);
            this.client.send();
            this.definition = JSON.parse(this.client.responseText);
            this.settings = this.definition['settings'];
        },

        /**
         * setzt files mit allen benoetigten Dateien
         */
        getModules : function() {
            this.client.open('GET', 'http://' + this.settings.host + ':' + this.settings.nodejsserver.port +
                    "/info/getModules?tasks=" + this.script.getAttribute('data-task') + "&files=" +
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
            document.writeln("<script src=\"http://" + this.settings.host + ":" + this.settings.nodejsserver.port +
                    "/wait/loadIsFinished?id=" + this.guid + "\"></script>");
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
    // Exportieren?
    // global.LOAD = LOAD;
})(this);
