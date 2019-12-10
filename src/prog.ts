import { IncomingMessage } from "http";
import { createWriteStream } from "fs";

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


		if (a == 294) {
			debugger;
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

		env.output(a);
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


export interface Env {
	output(a: number): void;
	input(): number;
}

export class Runtime {
	set(c: number, arg1: number) {
		if (arg1 == 227) {
			debugger;
		}
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



			ins.invoke(this, env);
		}
	}
}



//let memory = read().split(',').map(x => x.toNumber());

//console.log(memory);