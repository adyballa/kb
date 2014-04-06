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
    var config = {},
    
    /**
     * erzeugt XMLHttpRequest-objekt
     *
     * @returns {XMLHttpRequest}
     */
    createClient = function() {
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
    };

    GD.NS('Core', 'Ajax', config);

    /**
     * loads script with promise 
     * @memberOf GD.Core.Ajax
     * 
     * @param {string} fileName
     * @param {boolean} async
     */
    GD.Core.Ajax.loadScript = function(fileName, async){
        return new Promise(function(resolve, reject){
            var script = document.createElement("script"), module = {};
            script.type = "text/javascript";
            script.src = fileName;
            script.async = (typeof async === "undefined") ? true : (async);
            script.onreadystatechange = function () {
                if (this.readyState === 'complete'){
                    resolve();
                }
            };
            script.onload = function(e){
                resolve(e);
            };
            GD.doc.getElementsByTagName("head")[0].appendChild(script);
        });
    };

    /**
     * Polyfill:
     * Require Nodejs-module
     * @memberOf window
     *
     * @params {String} fileName 
     * @returns {Object}
     */
    GD.global.require = function(fileName){
        var client = createClient(), headElement, newScriptElement;
        GD.global.module = {};
        client.open('GET', fileName, false);
        client.send(null);

        if(/^\W*[{]/gi.test(client.responseText)){
            return JSON.parse(client.responseText);
        }
        
        headElement = document.getElementsByTagName("head")[0];
        newScriptElement = document.createElement("script");
        newScriptElement.type = "text/javascript";
        newScriptElement.text = client.responseText;
        headElement.appendChild(newScriptElement);
        return GD.global.module.exports(); 
    };

    /**
     * loads and parses JSON-file
     * @memberOf GD.Core.Ajax
     * TODO: to implement
     * 
     * @param {string} url
     * @param {GD.Core.Ajax.Successhandler} sucessHandler
     */
    GD.Core.Ajax.getJSON = function(url) {
        return new Promise(function(resolve, reject){
            var client = createClient();
            client.open('GET', url, true);
            client.send();
            GD.Core.Event.add('load', function(e){
                resolve(JSON.parse(client.responseText), e);
            }, client);
            GD.Core.Event.add('error', function(e){
                reject("Error occured", e);
            }, client);
            GD.Core.Event.add('abort', function(e){
                reject("Abort", e);
            }, client);
        });
    };
    
    GD.Core.Event.dispatch("gd:core:ajax:load");
})(GD);