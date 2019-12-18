import fs from "fs";
import path from "path"
import "@berhalak/js"
const { EOL } = require('os');

export function sleep(ms = 100) {
	var waitTill = new Date(new Date().getTime() + ms);
	while (waitTill > new Date()) { }
}

export function lines() {
	let lines = read().split(EOL);
	return lines;
}
export function read() {
	return fs.readFileSync(path.join(__dirname, "./input.txt")).toString().trim();
}


export class Pos {
	equals(pos: Pos) {
		return this == pos || (this.x == pos.x && this.y == pos.y);
	}

	constructor(public x: number, public y: number) {

	}
}

export class Point extends Pos {
	equals(pos: Point) {
		return this == pos || (this.x == pos.x && this.y == pos.y);
	}

	up() {
		return new Point(this.x, this.y + 1);
	}

	down() {
		return new Point(this.x, this.y - 1);
	}

	left() {
		return new Point(this.x - 1, this.y);
	}

	right() {
		return new Point(this.x + 1, this.y);
	}
}