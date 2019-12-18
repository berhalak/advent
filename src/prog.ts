import { IncomingMessage } from "http";
import { createWriteStream } from "fs";
import { Point, read, Pos } from "./lib";


export class Pixel extends Pos {

	up() {
		return new Pixel(this.x, this.y - 1);
	}

	down() {
		return new Pixel(this.x, this.y + 1);
	}

	left() {
		return new Pixel(this.x - 1, this.y);
	}

	right() {
		return new Pixel(this.x + 1, this.y);
	}
}

export class Dot<T> extends Pixel {
	value!: T;
	constructor(p: Pos, private c: Canvas<T>) {
		super(p.x, p.y);
		this.value = c.at(this);
	}
}

export class Canvas<T> {
	height(): number {
		return Object.keys(this.data).map(x=> x.toNumber()).max() as number;
	}

	list() {
		return [...this.iter()];
	}

	find(value: T): Pixel {
		for (let x of this.iter()) {
			if (this.at(x) == value) {
				return x;
			}
		}
		return new Pixel(-1, -1);
	}

	*all() {
		for (let row of Object.values(this.data)) {
			if (typeof row == 'object') {
				for (let cell of Object.values(row as any)) {
					yield cell as T;
				}
			}
		}
	}

	*iter() {
		for (let row of Object.keys(this.data)) {
			for (let col of Object.keys(this.data[row])) {
				yield new Pixel(col.toNumber(), row.toNumber());
			}
		}
	}

	render(up = false) {
		console.clear();
		this.dump(up);
	}

	dump(up = false) {

		let rowNumbers = Object.keys(this.data).map(x => x.toNumber());
		let firstRow = rowNumbers.min(0) as number;
		let lastRow = rowNumbers.max(0) as number;

		let firstCol = 0;
		let lastCol = 0;

		for (let row of Object.values(this.data)) {
			let colNumbers = Object.keys(row as any).map(x => x.toNumber());
			firstCol = Math.min(firstCol, colNumbers.min() as number);
			lastCol = Math.max(lastCol, colNumbers.max() as number);
		}

		if (up) {
			for (let y = firstRow; y <= lastRow; y++) {
				let s = "";
				for (let x = firstCol; x <= lastCol; x++) {
					let color = this.get(x, y);
					s += this.paintCell(color);
				}
				console.log(s);
			}
			return;
		}

		for (let y = lastRow; y >= firstRow; y--) {
			let s = "";
			for (let x = firstCol; x <= lastCol; x++) {
				let color = this.get(x, y);
				s += this.paintCell(color);
			}
			console.log(s);
		}
	}

	protected paintCell(color: T): string {
		return `${color}`;
	}

	constructor(private def: T) {

	}

	sumOfPainted(): any {
		let sum = 0;
		for (let key in this.data) {
			sum += Object.keys(this.data[key]).length;
		}
		return sum;
	}

	set(x: number, y: number, value: T) {
		this.data[y] = this.data[y] || {};
		this.data[y][x] = value;
	}

	get(x: number, y: number): T {
		let val = this.def;
		if (this.data[y]) {
			let row = this.data[y];
			if (x.toString() in row) {
				return row[x];
			}
		}
		return val;
	}

	paint(p: Pos, color: T) {
		this.set(p.x, p.y, color);
	}

	at(p: Pos) {
		return this.get(p.x, p.y);
	}


	protected data: any = {};
}

class Base {
	constructor(private pos: string) {

	}

	invoke(run: Runtime, env: Env) {
		let index = run.index;
		let memory = run.memory;

		let a = memory[index + 1];
		let amode = this.pos[2];

		if (amode == relatvie) {
			a = memory[run.relative + a] || 0;
		}
		if (amode == position) {
			a = memory[a] || 0;
		}

		run.relative += a;
		run.index += 2;
	}
}


export function readCode() {
	let code = read().trim().split(',').map(x => x.toNumber());
	return code;
}


class Add {
	constructor(private pos: string) {

	}
	invoke(run: Runtime, env: Env) {
		let index = run.index;
		let memory = run.memory;

		let a = memory[index + 1];
		let b = memory[index + 2];
		let c = memory[index + 3];
		let amode = this.pos[2];
		let bmode = this.pos[1];
		let cmode = this.pos[0];

		if (amode == position) {
			a = memory[a] || 0;
		}
		if (amode == relatvie) {
			a = memory[run.relative + a] || 0;
		}
		if (bmode == position) {
			let t = memory[b] || 0;
			b = t;
		}
		if (bmode == relatvie) {
			b = memory[run.relative + b] || 0;
		}

		if (cmode == relatvie) {
			c = run.relative + c;
		}



		run.set(c, a + b);

		run.index += 4;
	}
}

class Mul {
	constructor(private pos: string) {

	}

	invoke(run: Runtime, env: Env) {
		let index = run.index;
		let memory = run.memory;

		let a = memory[index + 1];
		let b = memory[index + 2];
		let c = memory[index + 3];
		let amode = this.pos[2];
		let bmode = this.pos[1];
		let cmode = this.pos[0];


		if (amode == '0') {
			a = memory[a] || 0;
		}
		if (amode == '2') {
			a = memory[run.relative + a] || 0;
		}
		if (bmode == '0') {
			b = memory[b] || 0;
		}
		if (bmode == '2') {
			b = memory[run.relative + b] || 0;
		}

		if (cmode == relatvie) {
			c = run.relative + c;
		}
		run.set(c, a * b);

		run.index += 4;

	}
}

class Store {
	constructor(private pos: string) {

	}

	invoke(run: Runtime, env: Env) {
		let index = run.index;
		let memory = run.memory;

		let a = memory[index + 1] || 0;
		let amode = this.pos[2];

		// if (amode == position) {
		// 	a = memory[a];
		// }

		// if (amode == relatvie) {
		// 	a = memory[run.relative + a] || 0;
		// }

		if (amode == relatvie) {
			a = run.relative + a;
		}
		run.set(a, env.input());
		run.index += 2;
	}
}

const position = '0';
const imidiate = '1';
const relatvie = '2';

class Out {
	constructor(private pos: string) {

	}
	invoke(run: Runtime, env: Env) {
		let index = run.index;
		let memory = run.memory;

		let a = memory[index + 1] || 0;
		let amode = this.pos[2];

		if (amode == position) {
			a = memory[a];
		}
		if (amode == relatvie) {
			a = memory[run.relative + a] || 0;
		}
		if (amode == imidiate) {
			a = a;
		}

		run.index += 2;

		return env.output(a);
	}
}

class JumpFalse {
	constructor(private pos: string) {

	}

	invoke(run: Runtime, env: Env) {
		let index = run.index;
		let memory = run.memory;

		let a = memory[index + 1] || 0;
		let b = memory[index + 2] || 0;
		let c = memory[index + 3] || 0;
		let amode = this.pos[2];
		let bmode = this.pos[1];
		let cmode = this.pos[0];

		if (amode == position) {
			a = memory[a] || 0;
		}
		if (amode == relatvie) {
			a = memory[run.relative + a] || 0;
		}

		if (bmode == position) {
			b = memory[b] || 0;
		}

		if (bmode == relatvie) {
			b = memory[run.relative + b] || 0
		}

		if (a == 0) {
			run.index = b;
		} else {
			run.index += 3;
		}
	}
}


class Equal {
	constructor(private pos: string) {

	}

	invoke(run: Runtime, env: Env) {
		let index = run.index;
		let memory = run.memory;
		let a = memory[index + 1] || 0;
		let b = memory[index + 2] || 0;
		let c = memory[index + 3] || 0;
		let amode = this.pos[2];
		let bmode = this.pos[1];
		let cmode = this.pos[0];

		if (amode == '0') {
			a = memory[a] || 0;
		}
		if (amode == '2') {
			a = memory[run.relative + a] || 0;
		}
		if (bmode == '0') {
			b = memory[b] || 0;
		}
		if (bmode == '2') {
			b = memory[run.relative + b] || 0;
		}
		if (cmode == relatvie) {
			c = run.relative + c;
		}
		run.set(c, a == b ? 1 : 0);
		run.index += 4;
	}
}

class LessThen {
	constructor(private pos: string) {

	}

	invoke(run: Runtime, env: Env) {
		let index = run.index;
		let memory = run.memory;

		let a = memory[index + 1] || 0;
		let b = memory[index + 2] || 0;
		let c = memory[index + 3] || 0;
		let amode = this.pos[2];
		let bmode = this.pos[1];
		let cmode = this.pos[0];

		if (amode == '0') {
			a = memory[a] || 0;
		}
		if (amode == '2') {
			a = memory[run.relative + a] || 0;
		}
		if (bmode == '0') {
			b = memory[b] || 0;
		}
		if (bmode == '2') {
			b = memory[run.relative + b] || 0;
		}
		if (cmode == relatvie) {
			c = run.relative + c;
		}
		run.set(c, a < b ? 1 : 0);
		run.index += 4;

	}
}

class JumpTrue {
	constructor(private pos: string) {

	}

	invoke(run: Runtime, env: Env) {
		let index = run.index;
		let memory = run.memory;
		let a = memory[index + 1];
		let b = memory[index + 2];
		let c = memory[index + 3];
		let amode = this.pos[2];
		let bmode = this.pos[1];
		let cmode = this.pos[0];

		if (amode == '0') {
			a = memory[a] || 0;
		}
		if (amode == '2') {
			a = memory[run.relative + a] || 0;
		}
		if (bmode == position) {
			b = memory[b] || 0;
		}

		if (bmode == relatvie) {
			b = memory[run.relative + b] || 0
		}

		if (a != 0) {
			run.index = b;
		} else {
			run.index += 3;
		}
	}
}

function instruction(op: number) {
	let str = op.toString().padStart(5, '0');
	let code = str.split('').skip(3).take(2).join('').toNumber();
	let pos = str.split('').take(3).join('');
	if (code == 1) {
		return new Add(pos);
	}
	if (code == 2) {
		return new Mul(pos);
	}
	if (code == 3) {
		return new Store(pos);
	}
	if (code == 4) {
		return new Out(pos);
	}
	if (code == 5) {
		return new JumpTrue(pos);
	}
	if (code == 6) {
		return new JumpFalse(pos);
	}
	if (code == 7) {
		return new LessThen(pos);
	}
	if (code == 8) {
		return new Equal(pos);
	}
	if (code == 9) {
		return new Base(pos);
	}
	if (code == 99) {
		return null;
	}
}


export const HALT = false;
export const CONTINUE = true;

export interface Env {
	output(a: number): boolean;
	input(): number;
}

export class Runtime {
	set(c: number, arg1: number) {

		this.memory[c] = arg1;
	}
	index = 0;
	relative: number = 0;

	constructor(public memory: number[]) {

	}

	execute(env: Env) {
		let memory = this.memory;
		while (this.index < memory.length) {
			let opcode = memory[this.index] || 0;

			let ins = instruction(opcode);
			if (ins === undefined) {
				throw new Error(this.index + " No instruction " + opcode)
			}
			if (ins == null) {
				break;
			}



			if (ins.invoke(this, env) === HALT) {
				return;
			}
		}
	}
}



//let memory = read().split(',').map(x => x.toNumber());

//console.log(memory);