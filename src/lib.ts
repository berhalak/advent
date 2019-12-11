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

declare global {
	interface Math {
		angle(y: number, x: number): number;
		clock(angle: number): number;
	}
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

