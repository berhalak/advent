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
}

declare global {
	interface Math {
		angle(y: number, x: number): number;
		clock(angle: number): number;
		lcm(...x: number[]): number;
		gcd(...x: number[]): number;
	}

	interface Array<T> {
		equals(other: Array<T>): boolean;
	}
}

if (!Array.prototype.equals) {
	Array.prototype.equals = function (this: Array<any>, other: any) {
		if (other.length == 0 && this.length == 0) return true;
		return this.every((v, i) => {
			let a = v;
			let b = other[i];
			if (typeof a == 'object') {
				if (a == null && b == null) return true;
				if (a !== null || b !== null) return false;

				if (a.equals) {
					return a.equals(b);
				}
				return a.valueOf() == b.valueOf();
			} else {
				return a == b;
			}
		})
	}
}

function gcd(a: number, b: number): number {
	return a ? gcd(b % a, a) : b;
}

function lcm(a: number, b: number): number {
	return a * b / gcd(a, b);
}

Math.lcm = function (...a: number[]): number {
	return a.reduce(lcm);
}

Math.gcd = function (...a: number[]): number {
	return a.reduce(gcd);
}

Math.angle = function (y: number, x: number) {
	return Math.atan2(y, x) * 180 / Math.PI;
}

Math.clock = function (angle: number) {
	if (angle == 90) {
		angle = 0;
	} else if (angle > 90) {
		angle = 360 - (angle - 90);
	} else {
		angle = - (angle - 90);
	}
	if (Math.abs(angle) == 0) {
		angle = 0;
	}
	return angle;
}

