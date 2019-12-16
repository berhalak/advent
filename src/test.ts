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

	clone() {
		let cl = new Plan(' ');
		cl.data = JSON.parse(JSON.stringify(this.data));
		return cl;
	}

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


function sleep(seconds = 1000) {

	var waitTill = new Date(new Date().getTime() + 5);
	while (waitTill > new Date()) { }
}


// draw droid on center
plan.set(0, 0, '.');


interface Robot {
	drawMap(): void;
	left(): boolean;
	down(): boolean;
	right(): boolean;
	up(): boolean;
}

const dot_was = '■';


class Remote implements Env, Robot {
	input(): number {
		return this.toSend;
	}

	drawMap(): void {

		sleep(500);
		console.clear();

		let was = plan.at(this.pos);
		plan.paint(this.pos, 'D');
		plan.dump();
		plan.paint(this.pos, was);
	}

	left(): boolean {
		this.next = this.pos.left();
		return this.run(west);
	}
	down(): boolean {
		this.next = this.pos.down();
		return this.run(south);
	}
	right(): boolean {
		this.next = this.pos.right();
		return this.run(east);
	}

	up(): boolean {
		this.next = this.pos.up();
		return this.run(north);
	}

	private run(dir: number) {
		this.toSend = dir;
		this.runtime.execute(this);

		if (this.result == free) {
			this.drawMap();
		}

		return this.result == free;
	}

	private toSend = north;

	pos = new Point(0, 0);
	private next = new Point(0, 0);
	private runtime = new Runtime(readCode());
	private result = free;
	ox: Point | null = null;
	private count = 0;

	output(a: number): boolean {
		this.result = a;
		if (a == free) {
			let was = plan.at(this.next);
			if (was == ' ') {
				this.count++;
				plan.paint(this.pos, dot_was);
				plan.paint(this.next, dot_was);
			} else {
				plan.paint(this.next, '.');
				plan.paint(this.pos, '.');
			}
			this.pos = this.next;
		} else if (a == wall) {
			this.wallAt(this.next);
		} else if (a == oxygen) {
			plan.paint(this.next, "O");
			this.pos = this.next;
			this.ox = this.pos;
			this.result = free;
		}
		return false;
	}

	private wallAt(next: Point) {
		plan.paint(next, '#');
	}
}



class Compas {
	cur = north;
	rob = new Remote();
	shortest = 0;
	drive() {

		if (this.rob.ox && !this.shortest) {
			this.shortest = ([...plan.all()].filter(x => x == dot_was).length);
		}

		switch (this.cur) {
			case north: return this.rob.up();
			case east: return this.rob.right();
			case south: return this.rob.down();
			case west: return this.rob.left();
		}

	}

	left() {
		switch (this.cur) {
			case north: return this.cur = west; break;
			case east: return this.cur = north; break;
			case south: return this.cur = east; break;
			case west: return this.cur = south; break;
		}
	}

	right() {
		switch (this.cur) {
			case north: return this.cur = east; break;
			case east: return this.cur = south; break;
			case south: return this.cur = west; break;
			case west: return this.cur = north; break;
		}
	}
}

let robot = new Compas();


while (robot.drive()) { }

do {
	robot.left();
	if (robot.drive()) continue;
	robot.right();
	if (robot.drive()) continue;
	robot.right();
	if (robot.drive()) continue;
	robot.right();
	if (robot.drive()) continue;

} while (!robot.rob.pos.equals(new Point(0, 0)));



let ox = robot.rob.ox as Point;
plan.paint(ox, 'O');
let time = 0;
while (true) {
	// get all oxygen
	let start = plan.clone();
	let spread = false;
	for (let o of start.iter()) {
		let isOx = start.at(o) == 'O';
		if (isOx) {
			if (start.at(o.up()) == '.') {
				plan.paint(o.up(), 'O');
				spread = true;
			}
			if (start.at(o.down()) == '.') {
				plan.paint(o.down(), 'O');
				spread = true;
			}
			if (start.at(o.left()) == '.') {
				plan.paint(o.left(), 'O');
				spread = true;
			}
			if (start.at(o.right()) == '.') {
				plan.paint(o.right(), 'O');
				spread = true;
			}
		}
	}
	console.clear();
	plan.dump();
	if (!spread) {
		console.log("Time was " + time);
		break;
	}
	sleep();
	time++;
}

console.log("Shortest was " + robot.shortest);