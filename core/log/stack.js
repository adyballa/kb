/* global GD */
/* jshint devel: true */
/**
 * @file GD-Standalone debugger
 */
(function(GD) {

    "use strict";

    /**
     * <p>
     * Konfigurationssetting.
     * </p>
     * @memberOf GD.Core.Log.Stack#
     * 
     * @property {object} config
     * @property {boolean} config.fStackOutput default=true 
     * @property {boolean} config.fFullTrace default=false 
     */
    var config = {
        fStackOutput : true,
        fFullTrace : false
    },

    /**
     * @memberOf GD.Core.Log.Stack#
     * @member {RegExp} regExp
     * @private
     */
    regExp = (function(){
        if(/webkit/i.test(GD.global.navigator.userAgent)){
            return new RegExp(" at ([^@]*?)(\/<)?[(](.+)"+GD.Config.Core.root+"([^:]+):(.+)[)]$");
        }
        if(/firefox/i.test(GD.global.navigator.userAgent)){
            return new RegExp("^([^@]*?)(\/<)?@(.+)"+GD.Config.Core.root+"([^:]+):(.+)$");
        }
    }());

    GD.NS('Core', 'Log', 'Stack', config);
    
    /**
     * Gibt den Stack zurueck
     *
     * @returns {Error|bool} Stack
     */
    GD.Core.Log.Stack.getStack = function(){
        return false;
    };

    if(GD.Core.Log.Stack.config.fStackOutput){
        GD.Core.Log.Stack.getStack = function(){
            var stack = {}, index = 0,
            _createFct = function(){
                var constructor = function() {
//                  GD.Core.Console.Stack = stack;
//                  .split("\n").slice(1);
//                  [undef, undef, this.fileName, this.lineNumber] =
//                      /^(.*?)@(.*?):(.*?)$/.exec( stack[1] );
//                  this.stack = stack.join("\n");|
                    var err = new Error();
                    
                    stack.stack = err.stack.trim().split("\n").map(function(line){
                        var res = line.match(regExp);
                        if(res){
                            res = {'line' : res[5], 'file' : res[4], 'fct' : res[1]};
                            res.toString = function(){
                                return this.file+"("+this.line+")";
                                        //))+"\">"+this.fct+"("+this.line+")</a>";
                            };
                        }
                        return res;
                    });
                    if(!GD.Core.Log.Stack.config.fFullTrace){
                        stack.stack = stack.stack.filter(function(item){
                            return item && !item.file.match(/core\/log/g);
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
            
            if(stack.stack[0]){
                stack.head = stack.stack[0].fct;
                if(GD.Core.Log.Stack.config.fFullTrace){
                    while(stack.stack[index].file.match(/core\/log/g)){
                        index++;
                    }
                    stack.head = stack.stack[index].fct;
                }
                stack.trace = ((GD.Core.Log.Stack.config.fFullTrace) ? res.join("\n") : stack.stack[index]);
            }
            
            return stack;
        };
    }
})(GD);
