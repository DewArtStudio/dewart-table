/** 
 * @fileOverview Creates adaprive a tables. Visit our {@link https://dewart.ru website}
 * @author DewArt Studio
 * @copyright DewArt Studio
 * @version 1.3.0
 */
declare module "dewart-table" {
    /**
     * @fileoverview @author DewArt studio
     *
     */

    /**
     * @class Creates adaprive a tables
     */
    class Table {
        /**
         * @constructor Creates a table generator
         *
         * Accepts table generation settings:
         * @param {Object} settings Object of generation settings
         * @param {String} settings.horisontalAlignment [settings.horisontalAlignment = 'left'] horizontal alignment ( left | center | right )
         * @param {String} settings.verticalAlignment  [settings.verticalAlignment = 'top'] vertical alignment [ top | center | bottom ]
         * @param {Boolean} settings.margin [settings.margin = true] indentation at the edges ( true - on | false - off )
         * @param {Boolean} settings.wrap [settings.wrap = true] automatic line break ( true - on | false - off )
         * @param {Boolean} settings.orientation [settings.orientation = 'vertical']  table orientation ( true - horizontal | false - vertical )
         * @param {Number} settings.maxWidth [settings.maxWidth = undefined] Sets the maximum width of the table, specify undefined if you want the tables to be adaptive to the size of the console
         */
        constructor(settings: Object): void;

        /**
         * Generates a table from the source data
         * @param {Array<Object> | Object} data - Object or array of objects
         * @returns {String}
         * @throws Internal errors in data processing
         */
        get(data: Array<Object> | Object): String;

        /**
         * Outputs a table from the source data to the console
         * @param {Array<Object> | Object} data - Object or array of objects
         * @throws Internal errors in data processing
         */
        log(data: Array<Object> | Object): void;
    }
    export default Table;
}
