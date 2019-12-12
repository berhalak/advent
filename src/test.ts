import { lines, read, Point } from "./lib";
import { Runtime, Env, Canvas } from "./prog";
import { uptime } from "os";

class Cords {
	constructor(public x: number, public y: number, public z: number) {

	}
	power(): number {
		return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
	}

	toString() {
		return `<x=${this.x}, y=${this.y}, z=${this.z}>`;
	}
}

class Position extends Cords {
	move(vel: Velocity) {
		this.x += vel.x;
		this.y += vel.y;
		this.z += vel.z;
	}
}

class Velocity extends Cords {
	adjust(other: Position, mine: Position): Velocity {
		let x = other.x > mine.x ? this.x + 1 :
			other.x < mine.x ? this.x - 1 : this.x;

		let y = other.y > mine.y ? this.y + 1 :
			other.y < mine.y ? this.y - 1 : this.y;

		let z = other.z > mine.z ? this.z + 1 :
			other.z < mine.z ? this.z - 1 : this.z;

		return new Velocity(x, y, z);
	}
}

function gravity(a: Moon, b: Moon) {
	a.vel = a.vel.adjust(b.pos, a.pos);
	b.vel = b.vel.adjust(a.pos, b.pos);
}

class Moon {

	toString() {
		return `pos=${this.pos}, vel=${this.vel}`
	}

	get pot() {
		return this.pos.power();
	}
	get kin() {
		return this.vel.power();
	}
	total(): any {
		let z = this.pot * this.kin;
		return z;
	}
	applyVelocity() {
		this.pos.move(this.vel);
	}
	applyGravity(other: Moon) {
		gravity(this, other);
	}
	pos: Position;
	vel: Velocity;

	constructor(raw: string) {
		raw = raw.replace("<", "").replace(">", "");
		let parts = raw.split(',').map(x => x.trim()).map(x => x.substr(2).toNumber());

		let x = parts[0];
		let y = parts[1];
		let z = parts[2];
		this.pos = new Position(x, y, z);
		this.vel = new Velocity(0, 0, 0);
	}
}

let moons = lines().map(x => new Moon(x));

let steps = 1000;

for (let step = 1; step <= steps; step++) {
	console.log("After " + step);
	for (let a = 0; a < moons.length - 1; a++) {
		let first = moons[a];
		for (let b = a + 1; b < moons.length; b++) {
			let second = moons[b];
			first.applyGravity(second);
		}
	}

	moons.forEach(x => x.applyVelocity());
	moons.forEach(x => console.log(x.toString()));

}

let power = moons.map(x => x.total()).sum();

console.log(power);