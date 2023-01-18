'use strict';
function getTerminalSize() {
	function t() {
		const { env, stdout, stderr } = process;
		if (stdout && stdout.columns) return stdout.columns;
		if (stderr && stderr.columns) return stderr.columns;
		if (env.COLUMNS) return env.LINES;
	}
	return Number.parseInt(t(), 10);
}
let cw = getTerminalSize();
class BaseTable {
	constructor(headers, content) {
		this.dataHeader = headers;
		this.dataTable = content;
		for (let i = 0; i < content.length; i++) {
			if (!Array.isArray(content[i])) content[i] = [content[i]];
		}
	}
	width = 0;
	height = 0;
	maxCellWidth = 0;
	get(horisontalAlignment = 'left', verticalAlignment = 'top', compressed = false, wrap = true, orientation = true) {
		this._fill(orientation);
		cw = getTerminalSize();
		for (let i = 0; i < this.rows; i++) this.table[i].supplement(this.columns);
		return this._generate(horisontalAlignment, verticalAlignment, compressed, wrap);
	}
	_fill(orientation) {
		this.rows = 0;
		this.columns = 0;
		this.columnsWidth = [];
		let table = this.dataHeader !== undefined ? [this.dataHeader, ...this.dataTable] : this.dataTable;
		this.table = [];
		if (orientation) {
			let tmp = [];
			for (let i = 0; i < table.length; i++) {
				for (let j = 0; j < table[i].length; j++) {
					if (tmp[j] == undefined) tmp[j] = [];
					tmp[j][i] = table[i][j];
				}
			}
			table = tmp;
		}
		let len = table.length;
		for (let i = 0; i < len; i++) {
			let row = new Row(table[i]);
			this.rows++;
			this.columns = Math.max(row.length, this.columns);
			this.width = Math.max(this.width, row.width);
			this.maxCellWidth = Math.max(this.maxCellWidth, row.maxCellWidth);
			this.table.push(row);
		}
	}
	_generate(hA, vA, c, w) {
		switch (hA) {
			case 'left':
				hA = 0;
				break;
			case 'center':
				hA = 1;
				break;
			case 'right':
				hA = 2;
				break;
			default:
				hA = 0;
				break;
		}
		switch (vA) {
			case 'top':
				vA = 0;
				break;
			case 'center':
				vA = 1;
				break;
			case 'bottom':
				vA = 2;
				break;
			default:
				vA = 0;
				break;
		}
		let slices = this._formatData(hA, vA, c, w);
		return this._build(slices);
	}
	_formatData(hA, vA, c, w) {
		this.columnsData = this._getSizes(w, c);
		for (let i = 0; i < this.rows; i++) this.table[i].update(this.columnsData, hA, vA, c);
		return this.columnsData.slices;
	}
	_getSizes(w, c) {
		let width = [],
			margin = [],
			slices = [];
		let data = this._getColumnInfo(c ? 0 : 2);
		let m = c ? 0 : 2,
			fm = c ? 1 : 3;
		if (cw > data.width + this.columns * fm) {
			for (let i = 0; i < this.columns; i++) {
				width.push(data.width * data.ratio[i]);
				margin.push(m);
			}
			slices.push([0, this.columns]);
		} else {
			if (w) {
				let start = 0,
					current = Math.floor(data.width * data.ratio[0]),
					next,
					marginI = 2;
				if (current > cw) current = cw-5*fm;
				let sum = current;
				for (let i = 0; i < this.columns; i++) {
					next = Math.floor(data.width * data.ratio[i + 1]);
					width[i] = current;
					margin[i] = m;
					if (next > cw) next = current = cw-5*fm;
					let size = sum + marginI * fm + 1;
					if (size > cw) {
						slices.push([start, i]);
						start = i;
						marginI = 2;
						sum = current;
					}
					current = next;
					sum += current;
					marginI++;
				}
				
				slices.push([start, this.columns]);
			} else {
				let available = cw - this.columns * fm - 1;
				if (this.columns < available) {
					let sum = 0;
					for (let i = 0; i < this.columns; i++) {
						let tmp = available * data.ratio[i];
						let tMin = Math.floor(tmp);
						let tMax = Math.ceil(tmp);
						if (tMin < 1) {
							width.push(tMax);
							margin.push(m);
							sum += tMax;
						} else {
							width.push(tMin + 1);
							margin.push(m);
							sum += tmp + 1;
						}
					}
					while (sum > available) {
						let max = -1,
							maxI = 0,
							maxLast = -1;
						for (let i = 0; i < this.columns; i++)
							if (max <= width[i]) {
								maxLast = max;
								max = width[i];
								maxI = i;
							}
						let d = 1 + max - maxLast;
						if (d > sum - available) d = sum - available;
						width[maxI] -= d;
						sum -= d;
						if (width[maxI] < 1) {
							width[maxI] = 1;
							margin[maxI] = 1;
						}
					}
					slices.push([0, this.columns]);
				} else throw Error('The table cannot be displayed, enable wrapping or resize the console');
			}
		}
		return {
			width: width,
			margin: margin,
			slices: slices,
		};
	}
	_getColumnInfo(margin) {
		let res = [0],
			sum = 0;
		for (let i = 0; i < this.columns; res[++i] = 0) {
			for (let j = 0; j < this.rows; j++) res[i] = Math.max(res[i], this.table[j].cells[i].width);
			sum += res[i];
		}
		for (let i = 0; i < this.columns; i++) {
			res[i] = res[i] / sum;
			if (res[i] === 0) res[i] = 1 / sum;
		}
		return {
			width: sum,
			ratio: res,
			allWidth: sum + this.columns * (margin + 1) + 1,
		};
	}
	_build(slices) {
		let tables = '',
			r = this.rows - 1,
			slicesCount = slices.length;
		for (let s = 0; s < slicesCount; s++) {
			let borderLines = this._getBorders(slices[s][0], slices[s][1]);
			tables += borderLines.top;
			for (let i = 0; i < r; i++) tables += this.table[i].build(true, slices[s]);
			tables += this.table[r].build(false, slices[s]);
			tables += borderLines.bottom;
		}
		return tables;
	}
	_getBorders(start, finish) {
		let rT = '┌',
			rB = '└',
			l = finish - 1;
		for (let i = start; i < l; i++) {
			rT += '─'.repeat(this.columnsData.width[i] + this.columnsData.margin[i]) + '┬';
			rB += '─'.repeat(this.columnsData.width[i] + this.columnsData.margin[i]) + '┴';
		}
		return {
			top: rT + '─'.repeat(this.columnsData.width[l] + this.columnsData.margin[l]) + '┐\n',
			bottom: rB + '─'.repeat(this.columnsData.width[l] + this.columnsData.margin[l]) + '┘\n',
		};
	}
}
class Row {
	cells = [];
	constructor(row) {
		let len = row.length;
		for (let i = 0; i < len; i++) {
			let cell = new Cell(row[i]);
			let width = cell.width;
			this.width += width;
			this.maxCellWidth = Math.max(this.maxCellWidth, width);
			this.cells.push(cell);
			this.height = Math.max(this.height, cell.height);
		}
		this.length = this.cells.length;
	}
	supplement(columns) {
		if (this.length < columns) {
			let difference = columns - this.length;
			do {
				this.cells.push(new Cell(''));
			} while (difference--);
			this.length = columns;
		}
	}
	update(data, hA, vA, c) {
		this.width = 0;
		this.height = 0;
		for (let i = 0; i < this.length; i++) {
			let tmp = this.cells[i].compressOn(c).setWidth(data.width[i], hA);
			this.width += tmp.width;
			this.height = Math.max(this.height, tmp.height);
		}
		for (let i = 0; i < this.length; i++) this.cells[i].setHeight(this.height, vA);
	}
	build(isNoLast = true, slice) {
		let start = slice[0],
			finish = slice[1];
		let d = finish - start;
		let separator = this._getSeparator(start, finish);
		let lines = [],
			result = '';
		for (let i = start; i < finish; i++) lines.push(this.cells[i].content);
		for (let i = 0; i < this.height; i++) {
			for (let j = 0; j < d; j++) {
				result += `│${lines[j][i]}`;
			}
			result += '│\n';
		}
		return isNoLast ? (result += separator) : result;
	}
	_getSeparator(start, finish) {
		let res = '├';
		let len = finish - 1;
		for (let i = start; i < len; i++) res += '─'.repeat(this.cells[i].width) + '┼';
		res += '─'.repeat(this.cells[len].width) + '┤';
		return res + '\n';
	}
}
class Cell {
	width = 0;
	height = 0;
	compress = false;
	constructor(content) {
		this.content = ('' + content).split('\n');
		for (let i = 0; i < this.content.length; i++) this.content[i] = this.content[i].trim();
		this.height = this.content.length;
		for (let i = 0; i < this.height; i++) this.width = Math.max(this.width, this.content[i].length);
	}
	compressOn(compress) {
		this.compress = compress;
		return this;
	}
	setWidth(width, hA) {
		if (width <= 1) {
			width = 1;
		}
		this.width = width;

		let r = this.compress ? '' : ' ',
			_r = this.compress ? '' : '-';
		let content = [];
		for (let i = 0; i < this.content.length; i++) {
			let tmpContent = [];
			let currentCell = this.content[i];
			do {
				if (currentCell.length > this.width) {
					tmpContent.push(r + currentCell.slice(0, width) + _r);
					currentCell = currentCell.slice(width);
				} else {
					let margin = this.width - currentCell.length;
					switch (hA) {
						case 0:
							currentCell = r + currentCell + ' '.repeat(margin) + r;
							break;
						case 1:
							let leftMargin = Math.ceil(margin / 2),
								rightMargin = Math.ceil(margin / 2);
							if (leftMargin + rightMargin > margin) leftMargin = margin - rightMargin;
							currentCell = r + ' '.repeat(leftMargin) + currentCell + ' '.repeat(rightMargin) + r;
							break;
						case 2:
							currentCell = r + ' '.repeat(margin) + currentCell + r;
							break;
					}
					if (tmpContent.length > 0) content.push(...tmpContent, currentCell);
					else content.push(currentCell);
					break;
				}
			} while (true);
		}
		this.width += this.compress ? 0 : 2;
		this.content = content;
		this.height = this.content.length;
		return {
			width: this.width,
			height: this.content.length,
		};
	}
	setHeight(number, vA) {
		let d = number - this.height;
		this.height = number;
		for (let i = 1; i <= d; i++) {
			switch (vA) {
				case 0:
					this.content.push(' '.repeat(this.width));
					break;
				case 1:
					i % 2 == 0 ? this.content.unshift(' '.repeat(this.width)) : this.content.push(' '.repeat(this.width));
					break;
				case 2:
					this.content.unshift(' '.repeat(this.width));
					break;
			}
		}
	}
}
class TablePrototype {
	static _settings = {
		horisontalAlignment: 'left',
		verticalAlignment: 'top',
		margins: false,
		wrap: true,
		orientation: false,
	};
	static _convertClassesToArrays(classes) {
		let columns = new Map(),
			counter = 0,
			headers = [],
			content = [],
			len = classes.length;
		for (let i = 0; i < len; i++) {
			let obj = Object.keys(classes[i]);
			if (obj.length === 0) {
				classes[i] = {
					$: classes[i],
				};
				obj = Object.keys(classes[i]);
			}
			content[i] = [];
			for (let k = 0; k < counter; k++) content[i][k] = '';
			for (let j = 0; j < obj.length; j++) {
				let key = obj[j];
				let cell = classes[i][key];
				if (typeof cell === 'function') {
					cell = cell();
					if (cell === undefined) cell = 'void()';
				}
				if (cell === undefined) cell = '';
				let column = columns.get(key);
				if (column === undefined) {
					columns.set(key, counter);
					column = counter;
					counter++;
				}
				headers[column] = key;
				content[i][column] = cell;
			}
		}
		return {
			headers: headers,
			content: content,
		};
	}
	static _generate(headers, content) {
		return new BaseTable(headers, content).get(
			Table._settings.horisontalAlignment,
			Table._settings.verticalAlignment,
			Table._settings.margins,
			Table._settings.wrap,
			Table._settings.orientation
		);
	}
}
export default class Table extends TablePrototype {
	/**
	 * Table generation settings
	 * @param {String} horisontalAlignment horizontal alignment [ left | center | right ]
	 * @param {String} verticalAlignment vertical alignment [ top | center | bottom ]
	 * @param {Boolean} margins indentation at the edges [ true - on | false - off ]
	 * @param {Boolean} wrap automatic line break [true - on | false - off]
	 * @param {Boolean} orientation table orientation [ true - horizontal | false - vertical ]
	 * @copyright DewArt Studio
	 */
	static settings(horisontalAlignment = 'left', verticalAlignment = 'top', margins = true, wrap = true, orientation = false) {
		if (horisontalAlignment === 'left' || horisontalAlignment === 'right' || horisontalAlignment === 'center')
			Table._settings.horisontalAlignment = horisontalAlignment;
		if (verticalAlignment === 'top' || verticalAlignment === 'bottom' || verticalAlignment === 'center')
			Table._settings.verticalAlignment = verticalAlignment;
		Table._settings.margins = !margins;
		Table._settings.wrap = !!wrap;
		Table._settings.orientation = !!orientation;
	}
	/**
	 * Based on data from an array of classes, returns a row containing a table
	 * @param {Array<Object>} objects array of objects
	 * @returns {String} Line containing the table | returns false if the input is invalid
	 * @copyright DewArt Studio
	 */
	static getOfObject(objects) {
		if (!Array.isArray(objects)) objects = [objects];
		if (objects.length > 0) {
			try {
				let arrays = Table._convertClassesToArrays(objects);
				return Table._generate(arrays.headers, arrays.content);
			} catch {
				return false;
			}
		}
		return false;
	}
	/**
	 * Based on the data from the class array, displays a table in the console
	 * @param {Array<Object>} objects array of objects
	 * @returns {Boolean} returns false if the input is invalid
	 * @copyright DewArt Studio
	 */
	static showOfObject(objects) {
		if (!Array.isArray(objects)) objects = [objects];
		if (objects.length > 0) {
			try {
				let arrays = Table._convertClassesToArrays(objects);
				console.log(Table._generate(arrays.headers, arrays.content));
				return true;
			} catch {
				return false;
			}
		}
		return false;
	}
	/**
	 * Based on a two-dimensional array, output returns a string containing a table
	 * @param {Array<string>} headers column headings
	 * @param {Array<string>} content table content
	 * @returns {String} line containing the table | returns false if the input is invalid
	 * @copyright DewArt Studio
	 */
	static getOfArray(content, headers) {
		if (content === undefined) content = 'undefined';
		if (!Array.isArray(content)) content = [content];
		if (content.length < 1) content = ['$anonimous$'];
		let res;
		try {
			res = Table._generate(headers, content);
		} catch {
			res = false;
		}
		return res;
	}
	/**
	 * Based on a two-dimensional array, outputs a table to the console
	 * @param {Array<String>} content table content
	 * @param {Array<String>} headers column headings
	 * @returns {Boolean} returns false if the input is invalid
	 * @copyright DewArt Studio
	 */
	static showOfArray(content, headers) {
		if (content === undefined) content = '';
		if (content === '' && (headers === '' || headers === undefined)) return false;
		if (!Array.isArray(content)) content = [[content]];
		if (!Array.isArray(headers) && headers !== undefined) headers = [headers];

		if (content.length < 1) content = ['$anonimous$'];
		let res;
		Table._generate(headers, content);
		try {
			res = Table._generate(headers, content);
		} catch {
			return false;
		}
		console.log(res);
		return true;
	}
}