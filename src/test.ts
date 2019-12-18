import { lines, read, Point, sleep, Pos } from "./lib";
import { Runtime, Env, Canvas, readCode, HALT, CONTINUE, Dot, Pixel } from "./prog";

let code = readCode();

class Intersection {
	constructor(private dot: Pixel) {

	}

	alignment() {
		return this.dot.x * this.dot.y;
	}
}

class Place {
	constructor(private p: Pos, private c: Canvas<string>) {

	}
}

class Camera extends Canvas<string> {
	constructor(private p: Pixel, private c: Canvas<string>) {
		super('.');
	}

	left() {
		let p = this.p;
		let c = this.c;
		return c.at(p.left()) == '#';
	}

	right() {
		let p = this.p;
		return this.c.at(p.right()) == '#';
	}

	up() {
		let p = this.p;
		return this.c.at(p.up()) == '#';
	}

	down() {
		let p = this.p;
		return this.c.at(p.down()) == '#';
	}
}

const up = 1, down = 2, left = 3, right = 4;

class Robot {
	drive() {
		let dir = this.dir;

		let move = () => {
			let c = new Camera(this.pos, this.c);
			if (this.dir == 'L') {
				if (c.left()) {
					this.pos = this.pos.left();
					return true;
				} else {
					return false;
				}
			}
			if (this.dir == 'U') {
				if (c.up()) {
					this.pos = this.pos.up();
					return true;
				} else {
					return false;
				}
			}
			if (this.dir == 'D') {
				if (c.down()) {
					this.pos = this.pos.down();
					return true;
				} else {
					return false;
				}
			}
			if (this.dir == 'R') {
				if (c.right()) {
					this.pos = this.pos.right();
					return true;
				} else {
					return false;
				}
			}
			return false;
		}

		let size = 0;
		while (move()) {
			size++;
		}
		return size;
	}
	willTurn(): string {
		return this.next;
	}
	turn() {
		if (this.dir == 'U') {
			this.dir = this.next;
		} else if (this.dir == 'L') {
			switch (this.next) {
				case 'L': this.dir = 'D'; break;
				case 'R': this.dir = "U"; break;
			}
		} else if (this.dir == 'R') {
			switch (this.next) {
				case 'L': this.dir = 'U'; break;
				case 'R': this.dir = "D"; break;
			}
		}
		else if (this.dir == 'D') {
			switch (this.next) {
				case 'L': this.dir = 'R'; break;
				case 'R': this.dir = "L"; break;
			}
		}
	}
	private pos = new Pixel(0, 0);
	private dir = 'U';
	private next = 'L';

	constructor(private c: Canvas<string>) {
		this.pos = c.find('^');
	}

	locate(): boolean {

		let c = new Camera(this.pos, this.c);


		if (this.dir == 'U') {
			if (c.left()) {
				this.next = 'L';
				return true;
			}
			if (c.right()) {
				this.next = 'R';
				return true;
			}
		}
		if (this.dir == 'L') {
			if (c.up()) {
				this.next = 'R'; return true;
			}
			if (c.down()) {
				this.next = 'L'; return true;
			}
		}
		if (this.dir == 'R') {
			if (c.up()) {
				this.next = 'L'; return true;
			}
			if (c.down()) {
				this.next = 'R'; return true;
			}
		}
		if (this.dir == 'D') {
			if (c.left()) {
				this.next = 'R'; return true;
			}
			if (c.right()) {
				this.next = 'L'; return true;
			}
		}
		return false;
	}
}

class Vacuum implements Env {

	c = new Canvas<string>('.');

	start = new Pixel(0, 0);

	output(a: number): boolean {
		if (a == 10) {
			this.start = this.start.down();
			this.start.x = 0;
		} else {

			this.c.paint(this.start, String.fromCharCode(a));
			this.start = this.start.right();
		}
		//sleep(10);
		//this.c.render();
		return CONTINUE;
	}

	input(): number {
		throw new Error("Method not implemented.");
	}

	snap() {
		var runtime = new Runtime(code);
		runtime.execute(this);
		this.c.render(true);
	}

	path() {
		let robot = new Robot(this.c);

		let p: string[] = [];

		while (robot.locate()) {
			p.push(robot.willTurn());
			robot.turn();
			let size = robot.drive();
			p.push('' + size);
			p.push(',');
		}

		return p.join('');
	}

	*intersections() {
		let c = this.c;
		for (let p of this.c.iter()) {
			if (c.at(p.left()) != '#') continue;
			if (c.at(p.down()) != '#') continue;
			if (c.at(p.up()) != '#') continue;
			if (c.at(p.right()) != '#') continue;
			if (c.at(p) != '#') continue;
			yield new Intersection(p);
		}
	}
}

let v = new Vacuum();
v.snap();
console.log(v.path());


