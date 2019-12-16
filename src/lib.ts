import fs from "fs";
import path from "path"
import "@berhalak/js"
const { EOL } = require('os');

export function lines() {
	let lines = read().split(EOL);
	return lines;
}
export function read() {
	return fs.readFileSync(path.join(__dirname, "./input.txt")).toString().trim();
}

export class Point {
	constructor(public x: number, public y: number) {

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