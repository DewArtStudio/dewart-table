import { Console } from 'console';
import { Transform } from 'stream';

export class Table {
	static getOfMatrix(matrix, headers) {
		return Table._generate(Table._matrixToClasses(matrix, headers));
	}

	static getOfClasses(classes) {
		return Table._generate(classes);
	}

	static showOfMatrix(matrix, headers) {
		console.log(Table._generate(Table._matrixToClasses(matrix, headers)));
	}

	static showOfClasses(classes) {
		console.log(Table._generate(classes));
	}

	static _matrixToClasses(matrix, headers){
		let rows = matrix.length
		if (rows === 0) throw Error('empty matrix')
		let cols = 0
		for (let i = 0; i < rows; i++){
			cols = (cols < matrix[i].length ? matrix[i].length : cols)
		}
		console.log(cols);
		let json = '{"table":['
		for (let i = 0 ; i < rows; i++){
			json+='{'
			for (let j = 0; j < cols; j++){
				json+=`\"${headers[j] !== undefined ? headers[j]: `?${j}?`}\": \"${matrix[i][j] !== undefined ? matrix[i][j] : ''}\"${(j+1<cols)?', ':''}`;
			}
			json+=`}${(i+1<rows)?', ':''}`
		}
		json += ']}'
		console.log(json);
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

//npm install semver