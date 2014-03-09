/* global GD */
/* jshint devel: true */
/**
 * @file GD-Standalone debugger
 */
(function(GD) {

    "use strict";

    /**
     * <h5>GD-Standalone debugger</h5>
     * @name Dbg
     * @class
     * @memberOf GD.Core
     * @author Andreas Dyballa
     */

    /**
     * <p>
     * Konfigurationssetting.
     * </p>
     * @memberOf GD.Core.Dbg
     * 
     * @property {object} config
     * @property {boolean} config.verbose derfault=true 
     * @property {boolean} config.fStackOutput derfault=true 
     * @property {boolean} config.fFullTrace derfault=false 
     */
    var config = {
        verbose : true,
        fStackOutput : true,
        fFullTrace : false
    },

    /**
     * Erzeugt eine DebugFunktion
     * 
     * @memberOf GD.Core.Dbg
     * @function
     * @private
     * 
     * @param {Objekt} obj Auzugebendes Objekt
     * @param {boolean} fForce Wird die Ausgabe erzwungen?
     */
    _createFct = function(verbose, fct) {
        if(verbose){
            return function(mssg){
                fct(mssg);
            };
        }else{
            return function(mssg, fForce){
                if(fForce){
                    fct(mssg);
                }
            };
        }
    };

    GD.NS('Core', 'Dbg', config);

    /**
     * Gibt eine String-Debugmitteilung in die Konsole aus
     * @memberOf GD.Core.Dbg
     * 
     * @param {string} ss Auszugebender Text
     * @param {boolean} fForce Wird die Ausgabe erzwungen?
     */
    GD.Core.Dbg.out = 
    GD.Core.Dbg.dbg = function(ss, fForce) {
        if (!fForce && !GD.Core.Dbg.config.verbose){
            return;
        }
        console.debug(ss);
    };

    /**
     * Gibt eine String-Debugmitteilung als Info in die Konsole aus
     * @memberOf GD.Core.Dbg
     * 
     * @param {string} ss Auszugebender Text
     * @param {boolean} fForce Wird die Ausgabe erzwungen?
     */
    GD.Core.Dbg.info = function(ss, fForce) {
        if (!fForce && !GD.Core.Dbg.config.verbose){
            return;
        }
        GD.Core.Console.info(ss);
    };

    /**
     * Gibt eine String-Debugmitteilung als Warnung in die Konsole aus
     * @memberOf GD.Core.Dbg
     * 
     * @param {string} ss Auszugebender Text
     * @param {boolean} fForce Wird die Ausgabe erzwungen?
     */
    GD.Core.Dbg.warn = function(ss, fForce) {
        if (!fForce && !GD.Core.Dbg.config.verbose){
            return;
        }
        GD.Core.Console.warn(ss);
    };

    /**
     * Gibt eine String-Debugmitteilung und einen Trace aus
     * @memberOf GD.Core.Dbg
     * 
     * @param {string} ss Auszugebender Text
     * @param {boolean} fForce Wird die Ausgabe erzwungen?
     */
    GD.Core.Dbg.trace = function(ss, fForce) {
        if (!fForce && !GD.Core.Dbg.config.verbose){
            return;
        }
        console.info(ss);
        console.trace();
    };

    /**
     * Gibt ein Objekt in die Konsole aus
     * @memberOf GD.Core.Dbg
     * 
     * @param {Objekt} obj Auzugebendes Objekt
     * @param {boolean} fForce Wird die Ausgabe erzwungen?
     */
    GD.Core.Dbg.dir = function(obj, fForce) {
        if (!fForce && !GD.Core.Dbg.config.verbose){
            return;
        }
        GD.Core.Console.dir(obj);
    };

    /**
     * fuegt einem Objekt die Faehigkeit "debuggen" hinzu.
     * Das sind die Methoden: dbg, info, warn, dir, dirArr, trace
     * @memberOf GD.Core.Dbg
     * 
     * @param {Objekt} obj Objekt erhaelt debugging-Faehigkeit
     * @param {boolean} fForce Wird die Ausgabe erzwungen?
     */
    GD.Core.Dbg.mixin = function(obj) {
        obj.dbg = _createFct(obj.config.verbose, GD.Core.Console.dbg);
        obj.info = _createFct(obj.config.verbose, GD.Core.Console.info);
        obj.warn = _createFct(obj.config.verbose, GD.Core.Console.warn);
        obj.dir = _createFct(obj.config.verbose, GD.Core.Console.dir);
        obj.dirArr = _createFct(obj.config.verbose, GD.Core.Console.arr);
        obj.trace = _createFct(obj.config.verbose, function(mssg){
            console.info(mssg);
            console.trace();
        });
    };

    /**
     * Gibt ein Array in die Konsole aus
     * @memberOf GD.Core.Dbg
     * 
     * @param {Array} arr Auzugebendes Array
     * @param {boolean} fForce Wird die Ausgabe erzwungen?
     */
    GD.Core.Dbg.arr = function(arr, fForce) {
        if (!fForce && !GD.Core.Dbg.config.verbose){
            return;
        }
        for ( var i = 0; i < arr.length; i++){
            GD.Core.Console.dir(arr[i]);
        }
    };

    /**
     * Gibt den Stack zurueck
     *
     * @param offset
     * @returns
     */
    GD.Core.Dbg.getStack = function(offset)
    {
        var _createFct = function(){
            var constructor = function() {
//              GD.Core.Console.Stack = stack;
//              .split("\n").slice(1);
//              [undef, undef, this.fileName, this.lineNumber] =
//                  /^(.*?)@(.*?):(.*?)$/.exec( stack[1] );
//              this.stack = stack.join("\n");|
                var err = new Error();
                GD.Core.Dbg.Stack = err.stack.trim().split("\n").map(function(line){
                    var res = line.match(new RegExp("^([^@]*?)(\/<)?@(.+)"+GD.Config.Core.root+"(.+):(.+)$"));
                    if(res){
                        res = {'line' : res[5], 'file' : res[4], 'fct' : res[1]};
                        res.toString = function(){
                            return this.file+"("+this.line+")";
                                    //))+"\">"+this.fct+"("+this.line+")</a>";
                        };
                    }
                    return res;
                });
                if(!GD.Core.Dbg.config.fFullTrace){
                    GD.Core.Dbg.Stack = GD.Core.Dbg.Stack.filter(function(item){
                        return item && !item.file.match(/dbg|error/g);
                    });
                }
                
          };
          constructor.prototype = {
              __proto__: Error.prototype,
              name: 'Stack'
          };
          return constructor;
            
        }
        
        ,
        _stack = _createFct();
        new _stack();
        return GD.Core.Dbg.Stack;
    };

    if(GD.Core.Dbg.config.fStackOutput){
        var base = {
                info: GD.Core.Console.info,
                debug: GD.Core.Console.debug,
                warn: GD.Core.Console.warn,
                log: GD.Core.Console.log
        };
    
        for(var i in base){
            GD.Core.Console[i] = (function(i){
                return function(mssg){
                    var res = GD.Core.Dbg.getStack(), index = 0;
                    if(res[0]){
                        var head = res[0].fct;
                        if(GD.Core.Dbg.config.fFullTrace){
                            while(res[index].file.match(/dbg|error/g)){
                                index++;
                            }
                            head = res[index].fct;
                        }
                        base[i]("%c"+head+"%c:\n"+mssg+"\n%c"+((GD.Core.Dbg.config.fFullTrace) ? res.join("\n") : res[0]),"font-weight:bold", "font-weight:normal", "font-size:10px;font-style:italic");
                    }
                };
            })(i);
        }
    }
})(GD);
