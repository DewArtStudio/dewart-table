declare module 'dewart-console-table' {
	/**
	 * Creates a table in the console
	 */
	declare class Table {
		/**
		 * Based on data from an array of classes, returns a row containing a table
		 * @param {Array<string>} classes Class array
		 * @returns {String} Line containing the table
		 */
		static getOfClasses(array: Array<string>): string;
		/**
		 * Based on the data from the class array, displays a table in the console
		 * @param {Array<string>} classes Class array
		 */
		static showOfClasses(array: Array<string>): void;
		/**
		 * Based on a two-dimensional array, output returns a string containing a table
		 * @param {Array<string>} array Table content
		 * @param {Array<string>} headers Column headings
		 * @returns {String} Line containing the table
		 */
		static getOfArray(array: Array<string>, headers: Array<string>): string;

		/**
		 * Based on a two-dimensional array, outputs a table to the console
		 * @param {Array<string>} array Table content
		 * @param {Array<string>} headers Column headings
		 */
		static showOfArray(array: Array<string>, headers: Array<string>): void;
	}
	export default Table;
}
