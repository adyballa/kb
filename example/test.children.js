(
/**
 * @param {GD} lib
 * @param {GD.Lib.Test.Children} clss
 */
function(lib, clss) {
    "use strict";

    /**
     * @memberOf GD.Lib.Test.Children
     */
    clss.staticTest = function() {
        console.log("thats a static test from GD.Lib.Test.Children without verbose check");
    };

    /**
     * @memberOf GD.Lib.Test.Children#
     */
    clss.prototype.overwriteTest = function(){
        this._.sharedProperties += 2;
        this._privateProperty += 2;
        this.parent._privateProperty += 3;
        this.messaging("GD.Lib.Test.Children:overwriteTest _privateProperty ist "+ this._privateProperty +" parent._privateProperty ist "+ this.parent._privateProperty +" _.sharedProperties:" + this._.sharedProperties);
    };

    /**
     * @memberOf GD.Lib.Test.Children#
     */
    clss.prototype.parentOverwriteTest = function(){
        this.parent.overwriteTest();
    };
}(GD, GD.Ns));