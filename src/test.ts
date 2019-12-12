import { lines, read, Point } from "./lib";
import { Runtime, Env, Canvas } from "./prog";
import { uptime } from "os";


class Cords {
	constructor(public x: number, public y: number, public z: number) {

	}

	zero() {
		return this.x == 0 && this.y == 0 && this.z == 0;
	}

	power(): number {
		return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
	}

	toString() {
		return `<x=${this.x}, y=${this.y}, z=${this.z}>`;
	}

	equals(pos: Cords) {
		return this.x == pos.x && this.y == pos.y && this.z == pos.z;
	}
}

class Position extends Cords {
	clone(): Position {
		return new Position(this.x, this.y, this.z);
	}

	move(vel: Velocity) {
		this.x += vel.x;
		this.y += vel.y;
		this.z += vel.z;
	}
}

class Velocity extends Cords {
	clone(): Velocity {
		return new Velocity(this.x, this.y, this.z);
	}

	adjust(other: Position, mine: Position) {
		let x = other.x > mine.x ? this.x + 1 :
			other.x < mine.x ? this.x - 1 : this.x;

		let y = other.y > mine.y ? this.y + 1 :
			other.y < mine.y ? this.y - 1 : this.y;

		let z = other.z > mine.z ? this.z + 1 :
			other.z < mine.z ? this.z - 1 : this.z;

		this.x = x;
		this.y = y;
		this.z = z;
	}
}

class Orbit {
	constructor(private points: number[]) {

	}

	int() {
		let velocity = this.points.map(x => 0);
		let position = this.points.slice();
		let step = 0;
		do {
			step++;
			for (let i = 0; i < velocity.length; i++) {
				let my = position[i];
				let after = position.filter(x => x > my).length - position.filter(x => x < my).length;
				velocity[i] += after;
			}
			velocity.forEach((v, i) => position[i] += v);
		} while (position.equals(this.points) == false);
		return step;
	}
}


class Moon {

	pool(moons: Moon[]) {
		for (let b = 0; b < moons.length; b++) {
			let second = moons[b];
			if (second == this) continue;
			this.adjustVelocity(second.pos);
		}
	}

	samez() {
		return this.vel.z == 0 && this.start.z == this.pos.z;
	}

	samey() {
		return this.vel.y == 0 && this.start.y == this.pos.y;
	}

	samex() {
		return this.vel.x == 0 && this.start.x == this.pos.x;
	}

	start!: Position;

	equals(arg0: Moon) {
		return this.vel.zero() && this.pos.equals(arg0.pos);
	}

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

	history: Position[] = [];
	index = 0;

	move() {
		this.pos.move(this.vel);
	}

	adjustVelocity(other: Position) {
		this.vel.adjust(other, this.pos);
	}

	pos!: Position;
	vel!: Velocity;

	constructor(raw: string) {
		raw = raw.replace("<", "").replace(">", "");
		let parts = raw.split(',').map(x => x.trim()).map(x => x.substr(2).toNumber());

		let x = parts[0];
		let y = parts[1];
		let z = parts[2];
		this.pos = new Position(x, y, z);
		this.vel = new Velocity(0, 0, 0);

		this.start = new Position(x, y, z);
		this.history = [this.start];
	}
}

let moons = lines().map(x => new Moon(x));


let xorbit = new Orbit(moons.map(x => x.pos.x));
let yorbit = new Orbit(moons.map(x => x.pos.y));
let zorbit = new Orbit(moons.map(x => x.pos.z));

let orbits = [zorbit, yorbit, xorbit];

let values = orbits.map(x => x.int());

console.log(Math.lcm(...values));
