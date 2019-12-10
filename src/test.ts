import { lines, read } from "./lib";

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

let max = 0;


class Point {

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

function generate(f: Point, s: Point) {

	if (f.x == s.x) {
		return function (x: Point) {
			return x.x == f.x;
		}
	}

	if (f.y == s.y) {
		return function (x: Point) {
			return x.y == f.y;
		}
	}
	return function (p: Point): boolean {

		let x = p.x;

		let a = (f.y - s.y) / (f.x - s.x);
		let b = f.y - (f.y - s.y) * f.x / (f.x - s.x);
		let y = (f.y - s.y) * x / (f.x - s.x) + b;

		if (p.y != y && Math.abs(p.y - y) < 0.1) {
			debugger;
		}

		return Math.abs(p.y - y) < 0.0001;
	}
}

type Detector = (a: Point) => boolean;

function detect(det: Detector): Point[] {
	let res: Point[] = [];
	for (let y = 0; y < map.length; y++) {
		for (let x = 0; x < map[y].length; x++) {
			if (!map[y][x]) {
				continue;
			}
			let other = new Point(x, y);



			if (det(other)) {
				res.push(other);
			}
		}
	}
	return res;
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

function find(px: number, py: number): number {
	let my = new Point(px, py);
	let sum = 0;

	if (my.x == 2 && my.y == 2) {
		debugger;
	}

	for (let other of aster()) {
		if (my.equals(other)) {
			continue;
		}
		let fun = generate(my, other);
		let asteroidsOnLine: Point[] = detect(fun);
		let blocking = asteroidsOnLine.except([my, other]);

		blocking.removeBy(x => {
			return x.outside(my, other);
		})

		if (blocking.length) {
			continue;
		}
		sum++;
	}
	//console.log(`${my} can ${sum}`);
	map[py][px] = sum;
	return sum;
}

let best: Point = null;

for (let y = 0; y < map.length; y++) {
	for (let x = 0; x < map[y].length; x++) {
		if (!map[y][x]) {
			continue;
		}
		let can = find(x, y);
		if (can > max) {
			best = new Point(x, y);
		}
		max = Math.max(max, can);
	}
}

console.log(max);
console.log(best);

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
