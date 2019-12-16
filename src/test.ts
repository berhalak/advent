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

let plan = new Plan(' ');

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

	count = 0;

	output(a: number): void {
		if (a == free) {
			count++;
			this.pos = this.next;
		} else if (a == wall) {
			this.wallAt(this.next);
		} else if (a == oxygen) {

		}
	}


	wallAt(next: Point) {
		plan.paint(next, '#');
		if (!this.hit) {
			this.hit = true;
			this.right();
		}
	}

	right() {
		throw new Error("Method not implemented.");
	}

	input(): number {
		if (!this.hit) {
			return this.drive();
		}

		if (this.knowLeft()) {
			if (this.leftWall()) {

			}
		} else {
			this.turnLeft();
			return this.drive();
		}
	}


	drive(): number {
		this.next = this.pos.up();
		return north;
	}

	test(arg0: Point) {
		return plan.at(arg0) == ' ' || plan.at(arg0) == '.';
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
plan.set(0, 0, '.');

let r = new Remote();
r.run();
