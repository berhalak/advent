import { lines, read } from "./lib";
import { Runtime, Env } from "./prog";
let memory = read().split(',').map(x => x.toNumber());



//memory = [104, 1125899906842624, 99];

class Boost implements Env {

	final = 0;

	output(a: number): void {
		console.log(a);
		this.final = a;
	}

	input(): number {
		return this.inp;
	}

	constructor(public code: number[], private inp: number = 1) {

	}

	run() {
		let r = new Runtime(this.code);
		r.execute(this);
	}
}

let prog: Boost = new Boost([]);

prog = new Boost([104, 1125899906842624, 99]);
prog.run();
if (prog.final != 1125899906842624) {
	throw new Error("first");
}

prog = new Boost([1102, 34915192, 34915192, 7, 4, 7, 99, 0]);
prog.run();
if (prog.final != 1219070632396864) {
	throw new Error("Second");
}

prog = new Boost([3, 9, 8, 9, 10, 9, 4, 9, 99, -1, 8], 8);
prog.run();
if (prog.final != 1) {
	throw new Error("Print self" + prog.final);
}

prog = new Boost([3, 9, 8, 9, 10, 9, 4, 9, 99, -1, 8], 9);
prog.run();
if (prog.final != 0) {
	throw new Error("Print self" + prog.final);
}

function test2(inp: number) {
	let p = new Boost([3, 21, 1008, 21, 8, 20, 1005, 20, 22, 107, 8, 21, 20, 1006, 20, 31, 1106, 0, 36, 98, 0, 0, 1002, 21, 125, 20, 4, 20, 1105, 1, 46, 104, 999, 1105, 1, 46, 1101, 1000, 1, 20, 4, 20, 1105, 1, 46, 98, 99], inp);
	p.run();
	return p.final;
}

if (test2(7) != 999) throw "Should be 999";
if (test2(8) != 1000) throw "Should be 1000";
if (test2(9) != 1001) throw "Should be 1001";

prog = new Boost(memory, 2);
prog.run();
console.log("Final is " + prog.final);


