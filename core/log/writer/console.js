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
     * @memberOf GD.Core.Log.Writer.Console
     * @member node
     * @instance
     * @private
     * 
     * @type {GD.Lib.Node}
     */
    var node = null,

    /**
     * <p>
     * Konfigurationssetting.
     * </p>
     * 
     * @memberOf GD.Core.Log.Writer.Console#
     * 
     * @property {object} config
     * @property {boolean} config.force default=false - Wenn keine console
     *           gefunden wird, kann damit ein Alert erzwungen werden.
     * @property {string=} config.id default=null Id zur DOM-Node fuer die
     *           Konsole
     */
    config = {
        force : false,
        id : null
    },

    /**
     * Ausgabe ueber node
     * 
     * @memberOf GD.Core.Log.Writer.Console
     * @private
     * 
     * @param {string}
     *            head
     * @param {string}
     *            body
     */
    _out = function(head, body) {
        var txt = '<p style="border-top:2px solid #000000;border-bottom:1px dotted#333333;margin-top:3px">' + head +
                '</p>' + '<p>' + body + '</p>', dNode, d = new Error();
        if (node) {
            dNode = GD.Core.Util.convertStr2Dom(txt);

            node.appendChild(dNode);
        } else if (GD.Core.Log.Writer.Console.config.force) {
            alert(txt);
        }
    };

    GD.NS('Core', 'Log', 'Writer', 'Console', config, GD.Core.Log.Writer).register();

    /**
     * @memberOf GD.Core.Log.Writer
     * @constructs Console
     * @author Andreas Dyballa
     * 
     * <h5>GD-Standalone Log-Writer Console</h5>
     * Ist Keine Console vorhanden kann mit einer id ins HTML
     * 
     * @see {@link http://framework.zend.com/manual/2.3/en/modules/zend.log.overview.html|Zend-log}
     */
    GD.Core.Log.Writer.Console.constructor = function() {
        /**
         * @memberOf GD.Core.Log.Writer.Console#
         * @member {Object}
         * @public
         */
        this.console = {
            /**
             * Fehler
             * 
             * @function error
             * 
             * @param {string}
             *            mssg
             */
            error : function(mssg) {
                _out('<p style="background-color:#ff2222">Error</p>', '<p style="background-color:#ff2222">' + mssg +
                        '</p>');
            },
            /**
             * einfaches Warning
             * 
             * @function warn
             * 
             * @param {string}
             *            mssg
             */
            warn : function(mssg) {
                _out('<p style="background-color:#ffff00">WARN</p>', '<p style="background-color:#ffff00">' + mssg +
                        '</p>');
            },
            /**
             * einfache Log-ausgabe
             * 
             * @function log
             * 
             * @param {string}
             *            mssg
             */
            log : function(mssg) {
                _out('LOG', mssg);
            },
            /**
             * einfache INFO-ausgabe
             * 
             * @function info
             * 
             * @param {string}
             *            mssg
             */
            info : function(mssg) {
                _out('INFO', mssg);
            },
            /**
             * einfache Debug-ausgabe
             * 
             * @function debug
             * 
             * @param {string}
             *            mssg
             */
            debug : function(mssg) {
                _out('DEBUG', mssg);
            },
            /**
             * einfache Serialisation von Objekten oder Arrays
             * 
             * @function dir
             * 
             * @param {Object}
             *            obj
             */
            dir : function(obj) {
                _out('DIR', GD.Core.Convert.obj2String(obj));
            },

            /**
             * Stack-trace: momentan leer
             * 
             * @function trace
             * 
             * TODO not implemented yet
             */
            trace : function(mssg) {
                _out('TRACE', mssg);
            }
        };

        if (this.config.id) {
            GD.Core.Event.ready(function(){
                this.setNode(GD.doc.getElementById(this.config.id));
            }.bind(this));
        } else {
            if (console) {
                this.console = console;
            }
        }
    };

    /**
     * @memberOf GD.Core.Log.Writer.Console#
     * 
     * @param {GD.Core.Log.Event}
     *            event
     */
    GD.Core.Log.Writer.Console.prototype.doWrite = function(event) {
        if (typeof event.message === "string") {
            switch (event.priority) {
            case 0:
                this.console.error.apply(this.console, this.format(event));
                break;
            case 1:
                this.console.error.apply(this.console, this.format(event));
                break;
            case 2:
                this.console.error.apply(this.console, this.format(event));
                break;
            case 3:
                this.console.warn.apply(this.console, this.format(event));
                break;
            case 4:
                this.console.warn.apply(this.console, this.format(event));
                break;
            case 5:
                this.console.info.apply(this.console, this.format(event));
                break;
            case 6:
                this.console.log.apply(this.console, this.format(event));
                break;
            case 7:
                this.console.debug.apply(this.console, this.format(event));
                break;
            }
        }
        if (event.priority < 2 || typeof event.message !== "string") {
            this.console.dir.apply(this.console, event.message);
        }
        if (event.fTrace) {
            this.console.trace();
        }
    };

    /**
     * @memberOf GD.Core.Log.Writer.Console#
     * @prototype
     * 
     * @param {GD.Core.Log.Event}
     *            event
     * @returns {Array}
     */
    GD.Core.Log.Writer.Console.prototype.format = function(event) {
        if (event.stack && !node) {
            return [ "%c" + event.stack.head + "%c:\n" + event.message + "\n%c" + event.stack.trace,
                    "font-weight:bold", "font-weight:normal", "font-size:10px;font-style:italic" ];
        }
        return [ event.message ];
    };

    /**
     * erzeugt Consolen als DOM - GD.Lib.Node
     * 
     * @memberOf GD.Core.Log.Writer.Console#
     * 
     * @param {mixed}
     *            dNode
     * @return {GD.Core.Log.Writer.Console}
     */
    GD.Core.Log.Writer.Console.prototype.setNode = function(dNode) {
        node = dNode;
        return GD.Core.Log.Writer.Console;
    };
})(GD);