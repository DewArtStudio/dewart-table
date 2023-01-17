declare module 'dewart-console-table' {
	/**
	 * Creates a table in the console
	 */
	class Table {
		/**
		 * Table generation settings
		 * @param {String} horisontalAlignment horizontal alignment [ left | center | right ]
		 * @param {String} verticalAlignment vertical alignment [ top | center | bottom ]
		 * @param {Boolean} margins indentation at the edges [ true - on | false - off ]
		 * @param {Boolean} wrap automatic line break [true - on | false - off]
		 * @param {Boolean} orientation table orientation [ true - horizontal | false - vertical ]
		 * @copyright DewArt Studio
		 */
		static settings(horisontalAlignment: String, verticalAlignment: String, margins: Boolean, wrap: Boolean, orientation: Boolean): void;
		/**
		 * Based on data from an array of classes, returns a row containing a table
		 * @param {Array<Object>} objects array of objects
		 * @returns {String} Line containing the table | returns false if the input is invalid
		 * @copyright DewArt Studio
		 */
		static getOfObject(objects: Array<String>): String;
		/**
		 * Based on the data from the class array, displays a table in the console
		 * @param {Array<Object>} objects array of objects
		 * @returns {Boolean} returns false if the input is invalid
		 * @copyright DewArt Studio
		 */
		static showOfObject(objects: Array<String>): Boolean;
		/**
		 * Based on a two-dimensional array, output returns a string containing a table
		 * @param {Array<string>} headers column headings
		 * @param {Array<string>} content table content
		 * @returns {String} line containing the table | returns false if the input is invalid
		 * @copyright DewArt Studio
		 */
		static getOfArray(headers: Array<String>, content: Array<String>): String;

		/**
		 * Based on a two-dimensional array, outputs a table to the console
		 * @param {Array<String>} content table content
		 * @param {Array<String>} headers column headings
		 * @returns {Boolean} returns false if the input is invalid
		 * @copyright DewArt Studio
		 */
		static showOfArray(content: Array<String>, headers: Array<String>): Boolean;
	}
	export default Table;
}
