(/**
     * @param {window|mixed}
     *            global
     * @param {GD}
     *            lib
     */
function(global, lib) {
    "use strict";

    var config = {};

    /**
     * @type {GD.Lib.Parent}
     */
    lib.NS('Lib', 'Parent', {});

    (/**
         * @param {window|mixed}
         *            global
         * @param {GD}
         *            lib
         * @param {GD.Lib.Parent}
         *            clss
         */
    function(global, lib, clss) {
        /**
         * @memberOf GD.Lib.Parent
         */
        clss.constructor = function() {
            var _mssg = function(mssg){
                console.log(mssg);
            };
            
            this._a = 1;
            
            this.messaging = function(mssg){
                _mssg(mssg);
            };
        };

        /**
         * @memberOf GD.Lib.Parent
         */
        clss.staticTest = function() {
            console.log("Parent staticTest");
        };

        GD.Lib.Parent.prototype = {
            asss : function(){
                this._a++;
                this.messaging("_a ist "+this._a);
            },
            
            _aa : function(){
                this.messaging("nicht verfügbar");
            }
        };
    }(global, lib, GD.Lib.Parent));
}(this, GD));

(/**
     * @param {window|mixed}
     *            global
     * @param {GD}
     *            lib
     */
function(global, lib) {
    "use strict";

    var config = {};

    /**
     * @type {GD.Lib.Children}
     */
    lib.NS('Lib', 'Children', {}, GD.Lib.Parent);

    (/**
         * @param {window|mixed}
         *            global
         * @param {GD}
         *            lib
         * @param {GD.Lib.Parent}
         *            clss
         */
    function(global, lib, clss) {
        /**
         * @memberOf GD.Lib.Parent
         */
        clss.constructor = function() {
            this._b = 1;
        };

        /**
         * @memberOf GD.Lib.Parent
         */
        clss.staticTest = function() {
            console.log("Children staticTest");
        };

        GD.Lib.Children.prototype = {
            asss : function(){
                this._b++;
                this.messaging("_b ist "+this._b);
                this.parent.asss();
            },
            
            ass : function(){
                this.messaging("Gibt es nur im Child");  
            },
            
            _aa : function(){
                this.messaging("nicht verfügbar");
            }
        };
    }(global, lib, GD.Lib.Children));
}(this, GD));