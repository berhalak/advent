import { lines, read, Point } from "./lib";
import { Runtime, Env, Canvas, readCode } from "./prog";

let code = readCode();

class Board extends Canvas<Tile> {

}

class Tile {
	static handle(x: number, y: number, type: number, c: Board): void {
		c.set(x, y, new Tile());
	}
}

class Empty extends Tile {
	static handle(x: number, y: number, type: number, c: Board): void {
		if (type != 0) return;
		c.set(x, y, new Empty());
	}
}
class Wall extends Tile {
	static handle(x: number, y: number, type: number, c: Board): void {
		if (type != 1) return;

		c.set(x, y, new Wall());
	}
}
class Block extends Tile {
	static handle(x: number, y: number, type: number, c: Board): void {
		if (type != 2) return;

		c.set(x, y, new Block());
	}
}
class Paddle extends Tile {
	static handle(x: number, y: number, type: number, c: Board): void {
		if (type != 3) return;

		c.set(x, y, new Paddle());
	}
}
class Ball extends Tile {
	static handle(x: number, y: number, type: number, c: Board): void {
		if (type != 4) return;

		c.set(x, y, new Ball());
	}
}

class Instruction {

	constructor(private c: Board) {

	}

	stack: number[] = [];
	push(n: number) {
		this.stack.push(n);
		if (this.stack.length == 3) {
			this.handle(this.stack);
			this.stack = [];
		}
	}
	handle(stack: number[]) {
		let type = stack.last() as number;
		let x = stack[0];
		let y = stack[1];

		let tiles = [Empty, Block, Wall, Paddle, Ball];

		tiles.forEach(t => t.handle(x, y, type, this.c));
	}
}

class Game implements Env {

	c = new Board(new Empty());

	i = new Instruction(this.c);

	output(a: number): void {
		this.i.push(a);
	}

	input(): number {
		throw new Error("Method not implemented.");
	}

	constructor(private code: number[]) {

	}

	run() {
		let r = new Runtime(this.code);
		r.execute(this);
	}
}

let g = new Game(code);
g.run();

let answer = [...g.c.all()].filter(x => x.constructor == Block).length
console.log(answer);
