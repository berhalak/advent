import { lines, read } from "./lib";
import { hostname } from "os";

let input = lines();

let map: number[][] = [];

for (let i = 0; i < input.length; i++) {
	const line = input[i];

	map[i] = [];
	let x = i, y = 0;
	for (let c of line.split('')) {
		if (c == '#') {
			map[i][y++] = 1;
		} else {
			map[i][y++] = 0;
		}
	}
}


function rad(degree: number) {
	return degree * Math.PI / 180;
}

function deg(radian: number) {
	return radian * 180 / Math.PI;
}


class Point {

	angle(point: Point, fix = true) {
		if (this.x == 12 && this.y == 1) {
			//debugger;
		}
		let x = this.x - point.x;
		let y = this.y - point.y;
		let r = Math.atan2(y, x);
		let out = deg(r);
		if (fix) {
			out = Math.floor(out);
		}
		while (out < 0) {
			out += 360;
		}
		while (out > 360) {
			out -= 360;
		}
		return out;
	}

	outside(my: Point, other: Point): boolean {
		if (my.x == other.x) {
			if (my.y > other.y) {
				return this.y > my.y || this.y < other.y;
			} else {
				return this.y < my.y || this.y > other.y;
			}
		}
		if (my.x < other.x) return this.x < my.x || this.x > other.x;
		if (other.x < my.x) return this.x < other.x || this.x > my.x;

		return false;
	}


	constructor(public x: number, public y: number) {

	}

	toString() {
		return `[${this.x},${this.y}]`;
	}

	equals(p: Point) {
		return p.x == this.x && p.y == this.y;
	}

	distance(p: Point) {
		let a2 = Math.pow((Math.abs(this.x - p.x)), 2);
		let b2 = Math.pow((Math.abs(this.y - p.y)), 2);

		let dist = Math.sqrt(a2 + b2);

		return dist;
	}
}


function* aster() {
	for (let y = 0; y < map.length; y++) {
		for (let x = 0; x < map[y].length; x++) {
			if (!map[y][x]) {
				continue;
			}
			let other = new Point(x, y);
			yield other;
		}
	}
}


let destroyed: Point[] = [];


function eq(a: number, b: number) {
	return Math.abs(a - b) < 0.0001;
}

let point = new Point(8, 3);
let degree = 270;



while (true) {


	// find points on the same line
	let onLine = [...aster()].filter(x => !x.equals(point) && x.angle(point) == degree).orderBy(x => x.distance(point));

	let first = onLine.first();
	if (first) {
		console.log(`Destroying ${first} ${destroyed.length} ${first.angle(point, false)}`);

		destroyed.push(first);
		map[first.y][first.x] = 0;
	}

	if (destroyed.length == 200) {
		console.log(first);
		console.log(first.x * 100 + first.y);
		break;
	}


	degree += 1;
	if (degree == 360) degree = 0;
}


function print() {
	for (let y = 0; y < map.length; y++) {
		let s = y.toString().padStart(3) + " ";
		for (let x = 0; x < map[y].length; x++) {
			let w = x.toString().padStart(3) + " ";
			s += w;
		}
		if (y == 0)
			console.log(s);
		s = y.toString().padStart(3) + " ";

		for (let x = 0; x < map[y].length; x++) {
			let w = map[y][x].toString().padStart(3) + " ";
			s += w;
		}
		console.log(s);
	}

}