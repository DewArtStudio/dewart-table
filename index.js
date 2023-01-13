import { Console } from 'console';
import { Transform } from 'stream';
export default class Table {
	/**
	 * Based on data from an array of classes, returns a row containing a table
	 * @param {Array<string>} classes Class array
	 * @returns {String} Line containing the table
	 */
	static getOfClasses(classes) {
		return Table._generate(classes);
	}
	/**
	 * Based on the data from the class array, displays a table in the console
	 * @param {Array<string>} classes Class array
	 */
	static showOfClasses(classes) {
		console.log(Table._generate(classes));
	}
	/**
	 * Based on a two-dimensional array, output returns a string containing a table
	 * @param {Array<string>} array Table content
	 * @param {Array<string>} headers Column headings
	 * @returns {String} Line containing the table
	 */
	static getOfArray(array, headers) {
		return Table._generate(Table._arrayToClasses(array, headers));
	}
	/**
	 * Based on a two-dimensional array, outputs a table to the console
	 * @param {Array<string>} array Table content
	 * @param {Array<string>} headers Column headings
	 */
	static showOfArray(array, headers) {
		console.log(Table._generate(Table._arrayToClasses(array, headers)));
	}
	static _arrayToClasses(array, headers){
		let rows = array.length
		if (rows === 0) throw Error('empty array')
		let cols = 0
		for (let i = 0; i < rows; i++){
			cols = (cols < array[i].length ? array[i].length : cols)
		}
		let json = '{"table":['
		for (let i = 0 ; i < rows; i++){
			json+='{'
			for (let j = 0; j < cols; j++){
				json+=`\"${headers[j] !== undefined ? headers[j]: `?${j}?`}\": \"${array[i][j] !== undefined ? array[i][j] : ''}\"${(j+1<cols)?', ':''}`;
			}
			json+=`}${(i+1<rows)?', ':''}`
		}
		json += ']}'
		return JSON.parse(json).table
	}
	static _generate(data) {
		const ts = new Transform({
			transform(chunk, enc, cb) {
				cb(null, chunk);
			},
		});
		const logger = new Console({ stdout: ts });
		logger.table(data);
		const table = (ts.read() || '').toString();
		let result = '';
		for (let row of table.split(/[\r\n]+/)) {
			let r = row.replace(/[^┬]*┬/, '┌');
			r = r.replace(/^├─*┼/, '├');
			r = r.replace(/│[^│]*/, '');
			r = r.replace(/^└─*┴/, '└');
			r = r.replace(/'/g, ' ');
			result += `${r}\n`;
		}
		return result;
	}
}