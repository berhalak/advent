import { lines, read, Point } from "./lib";
import { Runtime, Env, Canvas, readCode } from "./prog";
import { getHeapStatistics } from "v8";

const wall = 0;
const free = 1;
const oxygen = 2;

const north = 1;
const south = 2;
const west = 3;
const east = 4;

class Plan extends Canvas<string> {
	constructor(def: string) {
		super(def);
	}

	protected paintCell(c: string) {
		return c;
	}
}

class Direction {

	constructor(private cur = north) {

	}

	dir(): number {
		return this.cur;
	}

	toString() {
		if (this.cur == north) {
			return '^'
		}
		if (this.cur == east) {
			return '>';
		}
		if (this.cur == west) {
			return '<';
		}
		return 'v';
	}

	next(pos: Point): Point {
		if (this.cur == north) {
			return pos.up();
		}
		if (this.cur == east) {
			return pos.right();
		}
		if (this.cur == west) {
			return pos.left();
		}
		return pos.down();
	}

	turnLeft() {
		let c = this.cur;

		c = c == north ? west :
			c == east ? north :
				c == south ? east :
					south;

		return new Direction(c);


	}
	turnRight() {
		let next = this.cur;

		next = next == north ? east :
			next == east ? south :
				next == south ? west :
					north;

		return new Direction(next);
	}

}

let board = new Plan(' ');

let count = 10;

function sleep(seconds = 1000) {
	var waitTill = new Date(new Date().getTime() + seconds);
	while (waitTill > new Date()) { }
}

class Remote implements Env {
	pos = new Point(0, 0);
	next = new Point(0, 0);
	hit = false;

	pointer = new Direction();
	prev = new Direction();

	output(a: number): void {
		if (a == free) {

		} else if (a == wall) {


		} else if (a == oxygen) {

		}
	}


	input(): number {
		if (!this.hit) {
			this.next = this.pos.up();
			return north;
		}

		// try left
		this.pointer = this.pointer.turnLeft();
		if (this.test(this.pointer.next(this.pos))) {
			this.next = this.pointer.next(this.pos);
			this.prev = this.pointer.turnRight();
			return this.pointer.dir();
		}

		let size = 5;
		while (size-- > 0) {
			this.pointer = this.pointer.turnRight();
			if (this.test(this.pointer.next(this.pos))) {
				this.next = this.pointer.next(this.pos);;
				return this.pointer.dir();
			}
		}

		throw new Error();
	}

	test(arg0: Point) {
		return board.at(arg0) == ' ' || board.at(arg0) == '.';
	}

	run() {
		let r = new Runtime(readCode());
		try {
			r.execute(this);
		}
		catch (e) {

		}
	}
}

// draw droid on center
board.set(0, 0, '.');

let r = new Remote();
r.run();
