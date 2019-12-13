import { lines, read, Point } from "./lib";
import { Runtime, Env, Canvas, readCode } from "./prog";

let code = readCode();

class Board extends Canvas<Tile> {

	constructor(private g: Game) {
		super(new Empty());
	}

	paintCell(color: Tile) {
		return color.paint();
	}

	set(x: number, y: number, t: Tile) {
		if (t.constructor == Ball) {
			g.ballAt(x, y);
		}
		if (t.constructor == Paddle) {
			g.padAt(x, y);
		}
		super.set(x, y, t);
	}
}

abstract class Tile {
	static handle(x: number, y: number, type: number, c: Board): void {
		return;
	}
	abstract paint(): string;
}




class Empty extends Tile {
	paint(): string {
		return " "
	}
	static handle(x: number, y: number, type: number, c: Board): void {
		if (type != 0) return;
		c.set(x, y, new Empty());
	}
}
class Wall extends Tile {
	paint(): string {
		return "█"
	}
	static handle(x: number, y: number, type: number, c: Board): void {
		if (type != 1) return;

		c.set(x, y, new Wall());
	}
}
class Block extends Tile {
	paint(): string {
		return "#"
	}
	static handle(x: number, y: number, type: number, c: Board): void {
		if (type != 2) return;

		c.set(x, y, new Block());
	}
}
class Paddle extends Tile {
	paint(): string {
		return "▄";
	}
	static handle(x: number, y: number, type: number, c: Board): void {
		if (type != 3) return;

		c.set(x, y, new Paddle());
	}
}
class Ball extends Tile {
	paint(): string {
		return "◌";
	}
	static handle(x: number, y: number, type: number, c: Board): void {
		if (type != 4) return;

		c.set(x, y, new Ball());
	}
}

class Instruction {

	constructor(private c: Board, private g: Game) {

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

		if (x == -1) {
			this.g.current(type);
			return;
		}

		let tiles = [Empty, Block, Wall, Paddle, Ball];



		tiles.forEach(t => t.handle(x, y, type, this.c));
	}
}

class Game implements Env {
	ball: Point = new Point(0, 0);
	pad: Point = new Point(0, 0);

	ballAt(x: number, y: number) {
		this.ball = new Point(x, y);
	}

	padAt(x: number, y: number) {
		this.pad = new Point(x, y);
	}

	current(type: number) {
		this.score = type;
	}

	score = 0;

	c = new Board(this);

	i = new Instruction(this.c, this);

	output(a: number): void {
		this.i.push(a);
	}

	input(): number {
		const left = -1;
		const right = 1;
		const stay = 0;

		// is right
		if (this.ball.x > this.pad.x) {
			return right;
		} else if (this.ball.x < this.pad.x) {
			return left;
		}
		return stay;
	}

	constructor(private code: number[]) {

	}

	run() {
		let r = new Runtime(this.code);
		r.execute(this);
	}

	turnOn() {
		this.code[0] = 2;
	}
}



let g = new Game(code);
g.turnOn();
g.run();


console.log(g.score);
