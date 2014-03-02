/* global GD */
/**
 * @file Erweitert GD-Core um Error-objekt
 */
(function (GD) {

    "use strict";

    /**
     * Fehlerbehandlung
     *
     * @name Error
     * @class
     * @memberOf GD.Core
     * @author Andreas Dyballa
     */

    /**
     * @memberOf GD.Core.Error
     * @private
     * @member _locale
     * @instance
     * @type {Array}
     */
    var _locale = null,

        /**
         * @memberOf GD.Core.Error
         * @private
         * @member errors
         * @instance
         * @type {Array}
         */
            errors = [],

        /**
         * <p>
         * Konfigurationssetting.
         * </p>
         * @memberOf GD.Core.Error
         *
         * @property {object} config
         * @property {object} config.url
         * @property {string} config.url.error default=../../locale/errors.json path to localized errors
         * @property {string} config.lang default=de
         * @property {number} config.timeout default=1000
         */
            config = {
            url: {
                error: '../../locale/errors.json'
            },
            lang: 'de',
            timeout: 1000
        },

        /**
         * Normale Ausgabe-methode, die gerne in der konkreten Anwendung
         * ueberschrieben werden darf.
         * @memberOf GD.Core.Error
         *
         * @private
         * @function display
         * @param {string} mssg
         */
            display = function (mssg) {
            GD.Core.Console.error(mssg);
        },

        /**
         * Normale Ausgabe-methode, die gerne in der konkreten Anwendung
         * ueberschrieben werden darf.
         * @memberOf GD.Core.Error
         *
         * @private
         * @function display
         * @param {Object} obj
         */
            displayDir = function (obj) {
            GD.Core.Console.dir(obj);
        },

        /**
         * Warning Ausgabe-methode, die gerne in der konkreten Anwendung
         * ueberschrieben werden darf.
         * @memberOf GD.Core.Error
         * @private
         * @function displayWarn
         * @param {string} mssg
         */
            displayWarn = function (mssg) {
            GD.Core.Console.warn(mssg);
        },

        /**
         * Infoing Ausgabe-methode.
         *
         * @memberOf GD.Core.Error
         * @private
         * @function displayInfo
         * @param {string} mssg
         */
            displayInfo = function (mssg) {
            GD.Core.Console.info(mssg);
        },

        /**
         * <p>Gibt eine Nachricht zurueck</p>
         *
         * Gibt es den Key im Locale wird die entsprechende Nachricht aus dem
         * Locale-array zurueckgegeben.
         *
         * TODO: mit Parameter formatArgs kann man Formatierungen als Array angeben.
         *
         * @memberOf GD.Core.Error
         * @private
         * @function _getMessage
         * @param {string} key Coder oder Message
         * @returns {string}
         */
            _getMessage = function (key) {
            if (_locale === null) {
                displayWarn("Locale-Objekt ist noch nicht intialisiert. Bitte JSON auf Korrektheit ueberpruefen!");
                return key;
            }
            if (_locale[GD.Core.Error.config.lang][key]) {
                /*
                 * TODO: Formatierung aus String erweiterung raus und in Namespace
                 * rein if($.isArray(formatArgs) && formatArgs.length>0){ return
                 * messages.german[key].format(formatArgs); }
                 */
                return _locale[GD.Core.Error.config.lang][key];
            }
            return key;
        };

    GD.NS('Core', 'Error', config).register();

    /**
     * Exceptionhandling
     * @memberOf GD.Core.Error
     *
     * @param {Error} error
     * @param {Object=} obj Detailausgabe
     * @returns {Error}
     */
    GD.Core.Error.exception = function (error, obj) {
        errors.push(error);
        error.html = error.message;
        error.message = error.message.replace(/(<([^>]+)>)/ig, "");
        GD.Core.Error.out(error.toString());
        if(obj){
            displayDir(obj);
        }
        return error;
    };

    /**
     * Normale Ausgabe von
     * @memberOf GD.Core.Error
     *
     * @param {string} mssg Code or Message
     * @param {Object=} obj Detailausgabe
     */
    GD.Core.Error.error = GD.Core.Error.out = function (mssg, obj) {
        if (typeof mssg === "string") {
            display(_getMessage(mssg));
            if(obj){
                displayDir(obj);
            }
        } else {
            display("Error can just accept Strings.");
        }
    };

    /**
     * Normale Ausgabe von Warnings
     * @memberOf GD.Core.Error
     *
     * @param {string} mssg
     */
    GD.Core.Error.warn = function (mssg) {
        if (typeof mssg === "string") {
            displayWarn(_getMessage(mssg));
        } else {
            display("Warnings can just accept Strings.");
        }
    };

    /**
     * Normale Ausgabe von Infos
     * @memberOf GD.Core.Error
     *
     * @param {string} mssg
     */
    GD.Core.Error.info = function (mssg) {
        if (typeof mssg === "string") {
            displayInfo(_getMessage(mssg));
        } else {
            display("Warnings can just accept Strings.");
        }
    };

    /**
     * Handler:Init: include locale-error-file
     * @memberOf GD.Core.Error
     * @see {@link http://jsonlint.com/} fuer korrektes JSON in Locales
     */
    GD.Core.Error.init = function () {

        GD.Core.Ajax.getJSON(GD.Core.Error.config.url.error, function (data) {
            _locale = data;
        });
    };

    /**
     * Handler:prepareRun: Rises Error if locale-file ist not loaded yet
     * @memberOf GD.Core.Error
     */
    GD.Core.Error.prepareRun = function () {
        if (_locale === null) {
            _getMessage('no_locale_file');
        }
    };
})(GD);
