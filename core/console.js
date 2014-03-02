/* global GD */
/* jshint devel: true */
/**
 * @file Erweitert GD-Core um Consolen-objekt
 */
(function(GD) {

    "use strict";

    /**
     * <h5>Console for messaging (a.k.a. firebug)</h5>
     * 
     * @name Console
     * @class
     * @memberOf GD.Core
     * @author Andreas Dyballa
     */

    /**
     * Wenn Konsole in GD.Lib.Node ausgegeben werden soll.
     *
     * @memberOf GD.Core.Console
     * @member node
     * @instance
     * @private
     * 
     * @type {GD.Lib.Node}
     */
    var node = null,

    /**
     * Zwischenspeicher
     *
     * @memberOf GD.Core.Console
     * @member node
     * @instance
     * @private
     * @type GD.Core.Console
     */
    dConsole = null,
    
    /**
     * <p>
     * Konfigurationssetting.
     * </p>
     * @memberOf GD.Core.Convert
     * 
     * @property {object} config
     * @property {boolean} config.force default=false - Wenn keine console gefunden wird, kann damit ein Alert erzwungen werden.
     * @property {string=} config.id default=null Id zur DOM-Node fuer die Konsole
     */
    config = {
        force : false,
        id : null
    },

    /**
     * Ausgabe ueber node
     * @memberOf GD.Core.Console
     * @private
     * 
     * @param {string} head
     * @param {string} body
     */
    _out = function(head, body) {
        var txt = '<p style="border-top:2px solid #000000;border-bottom:1px dotted#333333;margin-top:3px">' +
                head + '</p>' + '<p>' + body + '</p>', dNode,
        d = new Error();
        if (node) {
            dNode = GD.Core.Util.convertStr2Dom(txt);

            node.appendChild(dNode);
        } else if (GD.Core.Console.config.force) {
            alert(txt);
        }
    };

    GD.NS('Core', 'Console', config).register();

    /**
     * Stack-trace: momentan leer
     * @memberOf GD.Core.Console
     * TODO not implemented yet
     */
    GD.Core.Console.trace = function() {
    };

    /**
     * einfache Log-ausgabe
     * @memberOf GD.Core.Console
     *
     * @param {string} mssg
     */
    GD.Core.Console.log = function(mssg) {
        _out('LOG', mssg);
    };

    /**
     * einfache Debug-ausgabe
     * @memberOf GD.Core.Console
     *
     * @param {string} mssg
     */
    GD.Core.Console.debug = function(mssg) {
        _out('DEBUG', mssg);
    };

    /**
     * einfache INFO-ausgabe
     * @memberOf GD.Core.Console
     *
     * @param {string} mssg
     */
    GD.Core.Console.info = function(mssg) {
        _out('INFO', mssg);
    };

    /**
     * einfaches Warning
     * @memberOf GD.Core.Console
     *
     * @param {string} mssg
     */
    GD.Core.Console.warn = function(mssg) {
        _out('<p style="background-color:#ffff00">WARN</p>',
                '<p style="background-color:#ffff00">' + mssg + '</p>');
    };

    /**
     * Fehler
     * @memberOf GD.Core.Console
     *
     * @param {string} mssg
     */
    GD.Core.Console.error = function(mssg) {
        _out('<p style="background-color:#ff2222">Error</p>',
                '<p style="background-color:#ff2222">' + mssg + '</p>');
    };

    /**
     * einfache Serialisation von Objekten oder Arrays
     * 
     * @memberOf GD.Core.Console
     * @param {Object} obj
     */
    GD.Core.Console.dir = function(obj) {
        _out('DIR', (Array.isArray(obj)) ? obj.toString : obj.toString(obj));
    };

    /**
     * erzeugt Consolen als DOM - GD.Lib.Node
     * 
     * @param {mixed} dNode
     * @return {GD.Core.Console}
     */
    GD.Core.Console.setNode = function(dNode) {
        node = dNode;
/*      
        try {
            if (console && dConsole) {
                GD.Core.Console = dConsole;
            }
        } catch (e) {
        }
        */
        return GD.Core.Console;
    };

    /*
     * look for console - just do it 1time switch console with dummy
     */
    try {
        if (console) {
            if (GD.Core.Console.config.id) {
                GD.Core.Console.setNode(GD.doc
                        .getElementById(GD.Core.Console.config.id));
            }else{
                dConsole = GD.Core.Console;
                GD.Core.Console = console;
                GD.Core.Console.config = dConsole.config;
                GD.Core.Console.setNode = dConsole.setNode;
            }
        }
    } catch (e) {
    }
})(GD);