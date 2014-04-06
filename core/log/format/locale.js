/* global GD */
/**
 * @file GD-Standalone Log-Format Locale
 */
(function(GD) {

    "use strict";

    /**
     * <p>
     * Konfigurationssetting.
     * </p>
     * 
     * @memberOf GD.Core.Log.Format.Locale
     * 
     * @property {object} config
     * @property {object} config.url
     * @property {string} config.url.path default=../../locale/ path to
     *           localized errors
     * @property {string} config.url.file default=errors.json
     * @property {string} config.lang default=de
     */
    var config = {
        url : {
            path : '../locale/',
            file : 'errors.json'
        },
        lang : 'de'
    };

    GD.NS('Core', 'Log', 'Format', 'Locale', config, GD.Core.Log.Format);

    /**
     * @memberOf GD.Core.Log.Format
     * @constructs Locale
     * @abstract
     * @author Andreas Dyballa
     * 
     * <h5>GD-Standalone LOG-Formater Locale</h5>
     * Es wird sich an Zend orientiert. Dieser Formatter erzeugt
     * Sprachabhaengige Fehlerevents
     * 
     * @see {@link http://framework.zend.com/manual/2.3/en/modules/zend.log.overview.html|Zend-log}
     * 
     */
    GD.Core.Log.Format.Locale.constructor = function() {
        this._ = {
            locale : {},
            lang : this.config.lang
        };
        
        this.load();
    };

    /**
     * Formatiert ein Fehlerevent
     * 
     * @memberOf GD.Core.Log.Format.Locale#
     * @prototype
     * 
     * @param {GD.Core.Log.Event}
     *            event
     */
    GD.Core.Log.Format.Locale.prototype.run = function(event) {
        event.message = (event.message in this._.locale) ? this._.locale[event.message] : event.message;
    };

    /**
     * laedt das locale-file
     * 
     * @memberOf GD.Core.Log.Format.Locale#
     * @prototype
     * 
     * @param {?string}
     *            lang
     */
    GD.Core.Log.Format.Locale.prototype.load = function(lang) {
        var url = "", ctx = this;

        if (lang) {
            this._.lang = lang;
        }

        url = this.config.url.path + ((this._.lang) ? this._.lang + "/" : "") + this.config.url.file;
        GD.Core.Ajax.getJSON(url).then(function(data) {
            ctx._.locale = data;
        });
    };
})(GD);
