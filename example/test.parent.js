(
/**
 * @param {GD}
 *            lib
 * @param {GD.Lib.Test.Parent}
 *            clss
 */
function(lib, clss) {
    "use strict";

    /**
     * @memberOf GD.Lib.Test.Parent
     */
    clss.constructor = function() {
        var _mssg = function(mssg) {
            console.log(mssg);
        };

        /**
         * Private Properties.
         * Private Properties werden am Besten als Objekt
         * gebaut, da so beim Vererben zwischen den Vererbungen geteilt wird 
         * 
         * @memberOf GD.Lib.Test.Parent
         * @private
         * 
         * @property {Object} _
         * @property {Number} _.sharedProperties
         */
        this._ = {
                sharedProperties : 1
        };
        
        /**
         * @memberOf GD.Lib.Test.Parent
         */
        this._privateProperty = 1;

        /**
         * @memberOf GD.Lib.Test.Parent
         */
        this.messaging = function(mssg) {
            if (this.config.verbose) {
                _mssg(mssg);
            }
        };

        if (this.config.myTest) {
            this.messaging("My Test ist an und wir fragen es im Konstruktor ab.");
        }

        this.eventDispatch('load');
    };

    /**
     * @memberOf GD.Lib.Test.Parent
     */
    clss.prototype.overwriteTest = function() {
        this._.sharedProperties++;
        this._privateProperty++;
        this.messaging("GD.Lib.Test.Parent:overwriteTest _privateProperty ist "+ this._privateProperty +" _.sharedProperties:" + this._.sharedProperties);
    };

    /**
     * @memberOf GD.Lib.Test.Parent
     */
    clss.prototype.methodFromParent = function() {
        this._.sharedProperties++;
        this._privateProperty++;
        this.messaging("GD.Lib.Test.Parent:methodFromParent _privateProperty ist "+ this._privateProperty +" _.sharedProperties:" + this._.sharedProperties);
    };

    /**
     * @memberOf GD.Lib.Test.Parent
     */
    clss.prototype._privateMethode = function() {
        this.messaging("nicht verfügbar");
    };
}(GD, GD.Ns));
