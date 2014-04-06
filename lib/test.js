/* jshint evil : true */
/* global GD */
/**
 * @file Browsertests
 */
(
/**
 * @param {GD} lib
 * @param {GD.Lib.Point} clss
 */
function(GD, clss) {

    "use strict";

    /**
     * <p>
     * Konfigurationssetting.
     * </p>
     * Test kann z.B. im Cookie zwischengespeichert werden.
     * 
     * @memberOf GD.Lib.Test
     * 
     * @example GD.Fabric('Lib', 'Test'). create({cookie:{fUse:true, expires: 60 *
     *          60 * 1000}})
     * 
     * @property {object} config
     * @property {number} config.frameRateMs default=100
     * @property {number} config.intMaxIteration default=10
     * @property {boolean} config.verbose default=false
     * @property {object} config.cookie
     * @property {boolean} config.cookie.fUse default = true
     * @property {number} config.cookie.expires default = 1 Tag
     *           Cookie-expire-time in milliseconds
     * @property {object} config.mobilResolution
     * @property {number} config.mobilResolution.checkH default = 600px
     * @property {object} config.browserFastEnough
     * @property {number} config.browserFastEnough.iteration default = 5 how
     *           often iterate
     * @property {number} config.browserFastEnough.frameRateMs default = 40 how
     *           long u wait
     * @property {number} config.browserFastEnough.offset default = 100 how
     *           tolerant u are
     */
    var config = {
        frameRateMs : 100,
        intMaxIteration : 10,
        verbose : false,
        cookie : {
            fUse : true,
            expires : 60 * 60 * 24 * 1000
        },
        mobilResolution : {
            checkH : 600
        },
        browserFastEnough : {
            iteration : 5,
            frameRateMs : 40,
            offset : 100
        }
    };

    GD.NS('Lib', 'Test', config);

    /**
     * <h3>Tests fuer Browser-entscheidungen</h3>
     * <p>
     * Tests werden als Testroutinen hier gesammelt und werden mit
     * is&lt;Test&gt; ausgefuehrt.<br />
     * Alle Tests können kombiniert werden.<br />
     * Dazu gibt es ein passendes Konfigurationsobjekt config.&lt;Test&gt;.
     * </p>
     * <p>
     * Der Test wird mit der Test-routine abgeschlossen und erhaelt 2 Callbacks
     * fuer den Erfolgsfall und fuer den Fehlerfall
     * </P>
     * 
     * @example GD.Fabric('Lib', 'Test'). create({mobilResolution:400}).
     *   isTouchDevice().
     *   isMobilResolution(false).
     *   test({
     *     success:function(){ 
     *       alert('Ist ein Touchdevice, aber nicht mobil'); 
     *     }, 
     *     error : function(errorMssg){ 
     *       alert('Pruefung negativ, weil'+errorMssg); 
     *     } 
     *   });
     * 
     * @constructs Test
     * @memberOf GD.Lib
     * @author Generation Digitale
     * @tutorial ../examples/lib/test/basic.php
     * 
     * @returns {GD.Lib.Test} instance
     */
    GD.Lib.Test.constructor = function() {
        var _ = {
            /**
             * Ist Test erfolgreich?, noch nicht beendet?<br />
             * _.fCan => if null => check is running
             * 
             * @private
             * @type {boolean=}
             */
            fCan : null
        };
        /**
         * Speicher fuer den aktuellen Durchlauf beim Test. Im Zusammenhang mit
         * config.intMaxIteration soll so eine Endlosschleife verhindert werden.
         * 
         * @privileged
         * @protected
         * @type {number}
         */
        this.iteration = 0;

        /**
         * Fehlernachricht
         * 
         * @privileged
         * @protected
         * @type {string}
         */
        this.errorMssg = "";

        /**
         * konvertiert fPositive richtig Ist kein Wert angegeben, wird eine
         * positive Pruefung angenommen.
         * 
         * @memberOf GD.Lib.Test
         * @function getFPositive
         * @instance
         * @privileged
         * @protected
         * 
         * @param {boolean=} fPositive 
         * @returns {boolean}
         */
        this.getFPositive = function(fPositive) {
            return (fPositive === false) ? false : true;
        };

        /**
         * <p>
         * Prueft, ob geprueft werden soll.:)
         * </p>
         * Einmal negative, kann ein Test nicht mehr positiv werden.<br />
         * Ermoeglicht Verknuepfungen ueber Und.
         * 
         * @memberOf GD.Lib.Test
         * @function check
         * @instance
         * @privileged
         * @protected
         * 
         * @returns {boolean}
         */
        this.check = function() {
            if (_.fCan === false) {
                return false;
            }
            if (this.config.cookie.fUse && String(document.cookie).match(/fCanParallax=([^=;]+)/g)) {
                this.log.notice("Read Value from COOKIE " + RegExp.$1);
                _.fCan = eval(RegExp.$1);
                return false;
            }
            _.fCan = null;
            return true;
        };

        /**
         * Setzt Pruefvariabel, Fehlermeldung und Pruefung wird eventuell im
         * Cookie zwioschengespeichert.
         * 
         * @memberOf GD.Lib.Test
         * @function setFCan
         * @instance
         * @privileged
         * @protected
         * 
         * @param {?boolean} fCan null bedeutet Pruefung noch nicht bekannt
         * @param {string} mssg
         */
        this.setFCan = function(fCan, mssg) {
            _.fCan = fCan;
            if (this.config.cookie.fUse && _.fCan !== null) {
                this.log.notice("WRITE Value to COOKIE " + ((_.fCan) ? "true" : "false"));
                var now = new Date();
                var time = now.getTime() + this.config.cookie.expires;
                now.setTime(time);
                document.cookie = "fCanParallax=" + ((_.fCan) ? "true" : "false") + "; expires=" + now.toGMTString() +
                        "; path=/";
            }
            if (!fCan) {
                this.errorMssg = mssg;
            }
        };

        /**
         * Gibt Pruefergebnis zurueck
         * 
         * @memberOf GD.Lib.Test
         * @function getFCan
         * @instance
         * @privileged
         * @protected
         * 
         * @returns {?boolean}
         */
        this.getFCan = function() {
            return _.fCan;
        };

        /**
         * Hauptroutine Nimmt Callback-objekt entgegen und fuehrt Test aus.
         * Callbacks werden in folgenden Phasen ausgefuehrt:
         * 
         * @memberOf GD.Lib.Test
         * @function test
         * @instance
         * @privileged
         * 
         * @param {Object} callbacks Callbacks werden nach Testabschluss aufgerufen
         * @param {testCallback} callbacks.before davor
         * @param {testCallback} callbacks.success bei Erfolg
         * @param {errorCallback} callbacks.error bei Fehler oder Nichterfolg
         * @param {testCallback} callbacks.after danach
         */
        this.test = function(callbacks) {
            if (_.fCan === null) {
                if (this.iteration < this.config.intMaxIteration) {
                    var ctx = this;
                    this.iteration++;
                    window.setTimeout(function() {
                        ctx.test(callbacks);
                    }, this.config.frameRateMs);
                } else {
                    callbacks.error("Test abgebrochen. Timeout");
                }
            } else {
                if ('before' in callbacks) {
                    callbacks.before();
                }
                if (_.fCan === true) {
                    if ('success' in callbacks) {
                        callbacks.success();
                    }
                } else {
                    if ('error' in callbacks) {
                        callbacks.error("Test nicht erfolgreich: " + this.errorMssg);
                    }
                }
                if ('after' in callbacks) {
                    callbacks.after();
                }
            }
        };
        
        /**
         * Callback nach Testabschluss
         * @callback testCallback
         * @memberOf GD.Lib.Test
         */
        
        /**
         * Callback nach Testabschluss, wenn ein Fehler auftratt oder 
         * bei Nichterfolg
         * @callback errorCallback
         * @memberOf GD.Lib.Test
         *
         * @param {string} Fehlernachricht
         */

        return _;
    };

    /***************************************************************************
     * PRUEFROUTINEN *******************************************************
     **************************************************************************/
    /**
     * ist es ein Touchdevice Pruefung: Versucht Touch-Event zu bauen
     * @prototype
     * 
     * @param {boolean} fPositive
     * @returns {GD.Lib.Test}
     */
    GD.Lib.Test.prototype.isTouchDevice = function(fPositive) {
        if (this.check()) {
            try {
                document.createEvent("TouchEvent");
                this.setFCan(this.getFPositive(fPositive), "Ist ein Touchdevice");
            } catch (e) {
                this.setFCan(!this.getFPositive(fPositive), "Ist kein Touchdevice");
            }
        }
        return this;
    };

    /**
     * Eigene Pruefung. Relevant im Zusammenhang mit den anderen Pruefungen.
     * <strong>!Callback ist Funktions-body und muss Boolean zurueckliefern!</strong>
     * 
     * @prototype
     * @example testObj.isMyTest(true, 'return
     *          (document.getElementById('necessaryElement'));')
     * 
     * @param {boolean} fPositive
     * @param {string} callback
     * @parm {string} mssg optional
     * @returns {GD.Lib.Test}
     */
    GD.Lib.Test.prototype.isMyTest = function(fPositive, callback, mssg) {
        if (this.check()) {
            fPositive = this.getFPositive(fPositive);
            mssg = (mssg) ? mssg : '';
            callback = new Function(callback);
            this.setFCan(fPositive === callback(), (fPositive) ? "ist nicht" + mssg : "ist" + mssg);
        }
        return this;
    };

    /**
     * Pruefung, ob UserAgent mit dem uebergebenen RegExp (case-insensitive)
     * uebereinstimmt
     * @prototype
     * 
     * @param {boolean} fPositive
     * @param {string} regexp
     * @returns {GD.Lib.Test}
     */
    GD.Lib.Test.prototype.isUA = function(fPositive, regexp) {
        if (this.check()) {
            fPositive = this.getFPositive(fPositive);
            var res = new RegExp(regexp, 'i');
            this.setFCan(fPositive === res.test(navigator.userAgent || navigator.vendor || window.opera),
                    (fPositive) ? "ist keiner der Browser" : "ist einer der Browser");
        }
        return this;
    };

    /**
     * Pruefung nach Mobil-device durch Test der Reslutions-Hoehe
     * @prototype
     * 
     * @param {boolean}
     *            fPositive
     * @returns {GD.Lib.Test}
     */
    GD.Lib.Test.prototype.isMobilResolution = function(fPositive) {
        if (this.check()) {
            fPositive = this.getFPositive(fPositive);
            this.setFCan(fPositive === (screen.height < this.config.mobilResolution.checkH),
                    (fPositive) ? "Kein mobiler Screen" : "mobiler Screen");
        }
        return this;
    };

    /**
     * <h5>Stresstest</h5>
     * Pruefung nach Browser-geschwindigkeit.
     * @prototype
     * 
     * @param {boolean}
     *            fPositive
     * @returns {GD.Lib.Test}
     */
    GD.Lib.Test.prototype.isBrowserFastEnough = function(fPositive) {
        var ctx = this, zeit = new Date(), ms1 = zeit.getTime(), _i = 1, fDPositive = false, dMs = 0;

        function _run() {
            if (_i <= ctx.config.browserFastEnough.iteration) {
                _i++;
                window.setTimeout(function() {
                    _run();
                }, ctx.config.browserFastEnough.frameRateMs);
            } else {
                zeit = new Date();
                dMs = zeit.getTime() - ms1;
                fDPositive = ctx.getFPositive(fPositive);
                if (dMs > ctx.config.browserFastEnough.frameRateMs * ctx.config.browserFastEnough.iteration +
                        ctx.config.browserFastEnough.offset) {
                    ctx.setFCan(!fDPositive, 'Ihr Browser haelt unseren Geschwindigkeitskriterien nicht stand');
                } else {
                    ctx.setFCan(fDPositive, 'Ihr Browser ist ausreichend langsam');
                }
            }
        }

        if (this.check()) {
            window.setTimeout(function() {
                _run();
            }, this.config.browserFastEnough.frameRateMs);
        }

        return this;
    };
})(GD);