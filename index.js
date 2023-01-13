import process from 'process';

const consoleWidth = process.stdout.columns;
const MODE_FORMAT = {
	EQUAL: 'equal',
	FIXED: 'fixed',
	AUTO: 'auto',
};

function getEqualTable(header, content, info) {}

function tableFormater(headers, data, info, mode = 'auto') {
	switch (mode) {
		case 'auto':
			break;
		case 'fixed':
			break;
		case 'equal':
			break;
	}
}

function tableCore(headers, data, mode) {
	let tableInfo = getInfoTable(headers, data);
	let columnsSize = [];
	let numberColumns = Math.max(tableInfo.headerInfo.columnsWidth.length, tableInfo.contentInfo.columnsWidth.length);
	if (numberColumns === tableInfo.headerInfo.columnsWidth.length) {
		let rows = tableInfo.rows;
		for (let i = 0; i < numberColumns; i++) {
			columnsSize.push(0);
		}
		for (let i = 0; i < rows; i++) {
			columnsSize[i];
		}
	}
}

function getInfoTable(headers, content) {
	let headerInfo = getInfoRow(headers);
	let contentInfo = getInfoContent(content);
	return {
		width: headerInfo.width < contentInfo.width ? contentInfo.width : headerInfo.width,
		header: headerInfo,
		content: contentInfo,
		allRows: [...headerInfo.columnsWidth, ...contentInfo.columnsWidth],
		rows: headers.length + content.length,
	};
}

function getInfoContent(content) {
	let len = content.length,
		rows = [],
		maxWidth = 0,
		columnsWidth = [];
	for (let i = 0; i < len; i++) {
		let row = getInfoRow(content[i]);
		for (let j = row.cellsData.length; j > 0; j--) {
			if (columnsWidth[j] === undefined) columnsWidth[j] = row.cellsData[j].width;
			else if (columnsWidth[j] < row.cellsData[j].width) columnsWidth[j] = row.cellsData[j].width;
		}
		if (maxWidth < row.width) maxWidth = row.width;
		rows.push(row);
	}
	return {
		width: maxWidth,
		rowsData: rows,
		columnsWidth: columnsWidth,
	};
}

function getInfoRow(row) {
	let len = row.length;
	let data = [];
	let maxHeight = 0,
		widthRow = 0;
	for (let i = 0; i < len; i++) {
		let cell = getInfoCell(row[i]);
		data.push(cell);
		widthRow += cell.width;
		if (maxHeight < cell.height) maxHeight = cell.height;
	}
	return {
		width: widthRow,
		height: maxHeight,

		numberColumns: len,
		cellsData: data,
	};
}

function getInfoCell(str) {
	let str = str.split('\n'),
		width = 0,
		height = str.length;
	for (let i = 0; i < height; i++) width = max < str[i].length ? str.length : max;
	return {
		width: width,
		height: height,
	};
}
class Cell {
	content;
	width;
	height;
	constructor(content, width, height) {
		this.content = content;
		this.width = width;
		this.height = height;
	}
}
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
		console.log(Table._generate(array, headers));
	}
	static _arrayToClasses(array, headers) {
		let rows = array.length;
		if (rows === 0) throw Error('empty array');
		let cols = 0;
		for (let i = 0; i < rows; i++) {
			cols = cols < array[i].length ? array[i].length : cols;
		}
		let json = '{"table":[';
		for (let i = 0; i < rows; i++) {
			json += '{';
			for (let j = 0; j < cols; j++) {
				json += `\"${headers[j] !== undefined ? headers[j] : `?${j}?`}\": \"${array[i][j] !== undefined ? array[i][j] : ''}\"${
					j + 1 < cols ? ', ' : ''
				}`;
			}
			json += `}${i + 1 < rows ? ', ' : ''}`;
		}
		json += ']}';
		return JSON.parse(json).table;
	}
	static _generate(headers, data) {
		let data = Table._getPretterData(headers, data);

		return result;
	}
/**
 * ыкдпнгшрфылворапмфыволбрапифыдвлоарифывфывфывфывфычвфывфывф
 */
	static _generateTable(headers, data) {}
	static _generatePS(headers, data) {}
}

const a = '┐ ─ ┬ ┼ ├ ┤ ┘ └ ┴';
