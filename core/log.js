/* global GD */
/**
 * @file GD-Standalone Logger
 */
(function(GD) {

    "use strict";

    /**
     * Konfiguration
     * 
     * @memberOf GD.Core.Log
     * @private
     * 
     * @property {object} config
     * @property {number} config.priority default 3
     */
    var config = {
        priority : 3
    },

    /**
     * @memberOf GD.Core.Log
     * @private
     * @static
     * 
     * @type {GD.Core.Log[]}
     */
    _instances = {},

    /**
     * @memberOf GD.Core.Log
     * @private
     * @static
     * 
     * @member {Object} _priorities
     */
    _priorities = {
        "EMERG" : 0,
        "ALERT" : 1,
        "CRIT" : 2,
        "ERR" : 3,
        "WARN" : 4,
        "NOTICE" : 5,
        "INFO" : 6,
        "DEBUG" : 7
    },
    
    /**
     * @memberOf GD.Core.Log
     * @private
     * @static
     * @function createLog
     *
     * @param {GD.Core.Log}
     *            log
     * @param {number}
     *            priority
     * @param {object?}
     *            config
     */
    _createLog = function(log, priority, config) {
        return function(message, fTrace) {
            if (config.priority >= priority) {
                return log.log(priority, message, fTrace);
            }
        };
    }, 

    /**
     * Gibt Konstante zureuck
     * 
     * @memberOf GD.Core.Log
     * @private
     * @static
     * 
     * @param {String}
     *            name
     * @param {number}
     *            value
     * @returns {number}
     */
    _const = function(name, value) {
        Object.defineProperty(GD.Core.Log, name, {
            value : value,
            writable : true,
            configurable : true,
            enumerable : true
        });
        return GD.Core.Log[name];
    },

    /**
     * <h5>Hinzugefuegtes Log-mixin-objekt</h5>
     *
     * @memberOf GD.Core.Log
     * @mixin MixinLog
     */
    /**
     * Loggt Message nach Prioritaet
     *
     * @memberOf GD.Core.Log.MixinLog
     * @name log
     * @function
     * @param {number} priority
     * @param {string} message Fehlernachricht
     */    
    /**
     * Jede Prioritaet besitzt eine Methode mit
     * ihrer Fehlernachricht
     *
     * @memberOf GD.Core.Log.MixinLog
     * @name all_priorities
     * @function
     * @param {string} message
     */
    
    /**
     * Fuegt GD-Objekten ein Log-Objekt hinzu.
     * 
     * @memberOf GD.Core.Log
     * @private
     * @static
     * 
     * @param {Object} obj GD-Object
     */
    _mixin = function(obj) {
        var priorities = GD.Core.Log.priorities(), 
        logger = GD.Log(), error = GD.Log("error");

        /* Log wird nur im Development genutzt */
        obj.log = {};
        /* ERROR wird in allen Modis benutzt */
        obj.error = {};

        for ( var i in priorities ) {
            obj.log[i.toLowerCase()] = _createLog(logger, priorities[i], obj.config);
            obj.error[i.toLowerCase()] = _createLog(error, priorities[i], obj.config);
        }

        obj.log.log = function(priority, message, fTrace) {
            if (obj.config.priority >= priority) {
                logger.log(priority, message, fTrace);
            }
        };
    };

    GD.NS('Core', 'Log', config);

    /**
     * EMERG löst einen Exception aus
     * @memberOf GD.Core.Log
     * @constant {number}
     */
    GD.Core.Log.EMERG = _const("EMERG", _priorities["EMERG"]);

    /**
     * @memberOf GD.Core.Log
     * @constant {number} ALERT
     */
    GD.Core.Log.ALERT = _const("ALERT", _priorities["ALERT"]);

    /**
     * @memberOf GD.Core.Log
     * @constant {number} CRIT
     */
    GD.Core.Log.CRIT = _const("CRIT", _priorities["CRIT"]);

    /**
     * @memberOf GD.Core.Log
     * @constant {number} ERR
     */
    GD.Core.Log.ERR = _const("ERR", _priorities["ERR"]);

    /**
     * @memberOf GD.Core.Log
     * @constant {number} WARN
     */
    GD.Core.Log.WARN = _const("WARN", _priorities["WARN"]);

    /**
     * @memberOf GD.Core.Log
     * @constant {number} NOTICE
     */
    GD.Core.Log.NOTICE = _const("NOTICE", _priorities["NOTICE"]);

    /**
     * @memberOf GD.Core.Log
     * @constant {number} INFO
     */
    GD.Core.Log.INFO = _const("INFO", _priorities["INFO"]);

    /**
     * @memberOf GD.Core.Log
     * @constant {number} DEBUG
     */
    GD.Core.Log.DEBUG = _const("DEBUG", _priorities["DEBUG"]);

    /**
     * @memberOf GD
     * 
     * @param {?GD.Core.Log}
     *            value
     * @param {?string}
     *            key
     * @returns {GD.Core.Log}
     */
    GD.Log = function(value, key) {
        if (value instanceof GD.Core.Log) {
            _instances[key || "log"] = value;
        } else {
            key = value || "log";
        }
        return _instances[key];
    };

    /**
     * @memberOf GD.Core.Log
     * @constructs Event
     * @author Andreas Dyballa
     *
     * <h5>GD-Standalone Log Event</h5>
     * Es wird sich an Zend orientiert. Der logger besitzt n writer.
     *
     * @see {@link http://framework.zend.com/manual/2.3/en/modules/zend.log.overview.html|Zend-log}
     * 
     * @param {string|Error} message
     * @param {number} priority
     * @param {GD.Core.Log.Format} format
     * @param {boolean} fTrace Soll Log zusaetzlich getract werden
     */
    GD.Core.Log.Event = function(message, priority, format, fTrace){
        this.timestamp = (new Date()).getTime();
        if(typeof priority === "number"){
            this.priorityName = GD.arrayFlip(_priorities);
            this.priorityName = this.priorityName[priority];
            this.priority = priority;
        }else{
            this.priority = _priorities[priority];
            this.priorityName = priority;
        }
        this.fTrace = fTrace;
        this.stack = GD.Core.Log.Stack.getStack();
        if(this.priority === 0){
            this.error = message;
            this.message = message.message;
        }else{
            this.message = message;
            this.error = null;
        }
        format.run(this);
    };

    /**
     * Je nach Parameter werden alle Prioritaeten zurueckgegeben,
     * der Nummernwert, wenn der Name gegeben wird und
     * der Name wenn der Nummernwert gegeben wird.
     *
     * @memberOf GD.Core.Log
     *
     * @param {|number|string} priorities
     * @returns {Object|string|number}
     */
    GD.Core.Log.priorities = function(prio) {
        var res = _priorities;
        switch (typeof prio) {
        case "number":
            res = GD.arrayFlip(_priorities);
        case "string":
            if (prio in res) {
                return res[prio];
            } else {
                this.warn("Die Prioritaet " + prio + " ist nicht vorhanden.");
            }
        default:
            return res;
        }
    };

    /**
     * @memberOf GD.Core
     * @constructs Log
     * @author Andreas Dyballa
     *
     * <h5>GD-Standalone logger</h5>
     * Es wird sich an Zend orientiert. Der logger besitzt n writer.
     *
     * @see {@link http://framework.zend.com/manual/2.3/en/modules/zend.log.overview.html|Zend-log}
     */
    GD.Core.Log.constructor = function() {
        /**
         * @memberOf GD.Core.Log#
         * @member {Object} _
         * @instance
         * @private
         */
        this._ = {
            /**
             * @memberOf GD.Core.Log#
             * @member {GD.Core.Log.Format} format
             * @instance
             * @private
             */
            format : null,

            /**
             * @memberOf GD.Core.Log#
             * @member {GD.Core.Log.Writer[][]} writers
             * @instance
             * @private
             */
            writers : new Array(8),

            /**
             * @memberOf GD.Core.Log#
             * @member clearWriters
             * @function
             * @private
             */
            clearWriters : function() {
                for ( var i = 8; i--;) {
                    this.writers[i] = [];
                }
            },

            /**
             * @memberOf GD.Core.Log#
             * @member addWriter
             * @function
             * @private
             * 
             * @param {GD.Core.Log.Writer} writer
             */
            addWriter : function(writer) {
                this.writers[writer.getPriority()].push(writer);
            },

            /**
             * @memberOf GD.Core.Log#
             * @member walkWriters
             * @function
             * @private
             * 
             * @param {GD.Core.Log.Writer} callback
             * @returns {boolean}
             */
            walkWriters : function(callback) {
                var j = 0;
                for ( var i = 8; i--;) {
                    if(this.writers[i].length){
                        console.log("walkWriters i:"+i+" "+this.writers[i].length+" "+this.writers[i][0].getKey());
                    }
                    for (var j = this.writers[i].length; j--;) {
                        if (callback(this.writers[i][j], i, j)) {
                            return true;
                        }
                    }
                }
                return false;
            },

            /**
             * @memberOf GD.Core.Log#
             * @member getWriter
             * @function
             * @private
             * 
             * @param {number} key
             * @returns {GD.Core.Log.Writer?}
             */
            getWriter : function(key) {
                var res = false;
                this.walkWriters(function(item, i, j) {
                    if (key === item.getKey()) {
                        res = item;
                        return true;
                    }
                });
                return res;
            },

            /**
             * @memberOf GD.Core.Log#
             * @member removeWriter
             * @function
             * @private
             * 
             * @param {GD.Core.Log.Writer|number} writer
             * @returns {boolean}
             */
            removeWriter : function(writer) {
                var res = false, condition = (writer instanceof GD.Core.Log.Writer) ? function(subj) {
                    return (writer === subj);
                } : function(subj) {
                    return (key === subj.getKey());
                };
                return this.walkWriters(function(item, i, j) {
                    if (condition(item)) {
                        this.writers[i].splice(j, 1);
                        return true;
                    }
                });
            },

            /**
             * @memberOf GD.Core.Log#
             * @member flattenWriters
             * @function
             * @private
             * 
             * @returns {Array}
             */
            flattenWriters : function(){
                var res = [];
                this.walkWriters(function(item){
                    res.unshift(item);
                });
                return res;
            },

            /**
             * @memberOf GD.Core.Log#
             * @member resetWriters
             * @function
             * @private
             */
            resetWriters : function() {
                var writers = this.flattenWriters();
                this.clearWriters();
                writers.forEach(function(item) {
                    this.addWriter(writer);
                }, this);
            }
        };
        
        this._.clearWriters();

        for ( var i in _priorities ) {
            this[i.toLowerCase()] = _createLog(this, _priorities[i], this.config);
        }
        
        this.eventAdd("gd:core:log:format:load", function(){
            this.setFormat(GD.Fabric("Core", "Log", "Format").create());
        });
    };

    /**
     * Setzt das Format-objekt
     * @memberOf GD.Core.Log#
     * @prototype
     *
     * @param {GD.Core.Log.Format} format
     * @returns {GD.Core.Log#}
     */
    GD.Core.Log.prototype.setFormat = function(format) {
        this._.format = format;
        return this;
    };

    /**
     * @memberOf GD.Core.Log#
     * @prototype
     * 
     * @param {number|string} priority Prioritaet als Name oder Number
     * @param {string|Error} message Fehlernachricht
     * @param {boolean} fTrace Soll Log zusaetzlich getract werden
     */
    GD.Core.Log.prototype.log = function(priority, message, fTrace) {
        var format = this._.format;
        for (var i = priority; i < 8; i++) {
            this._.writers[i].forEach(function(item){
                item.write(new GD.Core.Log.Event(message, priority, format, fTrace));
            });
        }
        return message;
    };

    /**
     * @memberOf GD.Core.Log#
     * @prototype
     * @throws Error
     * 
     * @param {GD.Core.Log.Writer} writer
     * @return {GD.Core.Log#}
     */
    GD.Core.Log.prototype.addWriter = function(writer) {
        if (writer instanceof GD.Core.Log.Writer) {
            this._.addWriter(writer);
        } else {
            this.err("Der Logwriter hat die falsche Klasse");
        }
        return this;
    };

    /**
     * @memberOf GD.Core.Log#
     * @prototype
     * @throws Error
     * 
     * @param {number} key
     * @returns {GD.Core.Log.Writer?}
     */
    GD.Core.Log.prototype.getWriter = function(key) {
        return this._.getWriter(key);
    };

    /**
     * @memberOf GD.Core.Log#
     * @prototype
     * @throws Error
     * 
     * @param {GD.Core.Log.Writer|number} writer
     */
    GD.Core.Log.prototype.removeWriter = function(writer) {
        return this._.removeWriter(writer);
    };

    GD.Log(GD.Fabric("Core", "Log").create());
    GD.Log(GD.Fabric("Core", "Log").create(), "error");
    
    GD.Core.Event.add("gd:core:ajax:load", function(){
        GD.Core.Fabric.mixins.obj.add('development', _mixin);
    });
})(GD);
