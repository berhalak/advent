import { lines, read, Point } from "./lib";
import { Runtime, Env, Canvas } from "./prog";
import { uptime } from "os";
let memory = read().split(',').map(x => x.toNumber());

const d_right = 1;
const d_left = 0;

class State {
	private painting = true;

	handle(a: number, r: Robot) {
		if (this.painting) {
			r.paint(a);
			this.painting = false;
		} else {
			r.turn(a);
			r.move(1);
			this.painting = true;
		}
	}
}

enum DirectionPointer { Up, Right, Down, Left };

class Direction {
	private pointer = DirectionPointer.Up;

	move(position: Point, steps: number): Point {
		switch (this.pointer) {
			case DirectionPointer.Up: return new Point(position.x, position.y + steps);
			case DirectionPointer.Down: return new Point(position.x, position.y - steps);
			case DirectionPointer.Left: return new Point(position.x - steps, position.y);
			case DirectionPointer.Right: return new Point(position.x + steps, position.y);
			default: throw new Error("Wrong direction");
		}
	}

	turn(a: number) {
		if (a == d_right) {
			this.pointer++;
			if (this.pointer == 4) this.pointer = 0;
		} else {
			this.pointer--;
			if (this.pointer == -1) this.pointer = 3;
		}
	}

}


class Robot implements Env {
	move(steps: number) {
		this.position = this.direction.move(this.position, steps);
	}

	turn(a: number) {
		this.direction.turn(a);
	}

	paint(color: number) {
		this.c.paint(this.position, color);
	}

	c = new Canvas<number>();
	state: State = new State();
	position = new Point(0, 0);
	direction = new Direction();

	constructor(private code: number[]) {

	}

	output(a: number): void {
		this.state.handle(a, this);
	}

	input(): number {
		return this.c.at(this.position) || 0;
	}

	run() {
		let runtime = new Runtime(this.code);
		runtime.execute(this);
	}
}

let r = new Robot(memory);
r.run();

console.log(r.c.painted());