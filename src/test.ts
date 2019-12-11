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

	clock(point: Point, fix = true) {

		if (this.x == 11 && this.y == 12) {
			debugger;
		}

		let x = this.x - point.x;
		let y = point.y - this.y;

		return Math.clock(Math.angle(y, x));
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

function ast() {
	return [...aster()];
}


let destroyed: Point[] = [];
let point = new Point(27, 19);
while (true) {
	// order by angle
	let grouped = ast().except([point]).orderBy(x => x.distance(point)).group(x => x.clock(point));
	for (let g of grouped.orderBy(x => x.key)) {
		let first = g.list.first();
		destroyed.push(first);

		console.log(`${destroyed.length} = ${first}`);

		if (destroyed.length == 200) {
			break;
		}
	}
	if (destroyed.length == 200) {
		let last = destroyed.last();
		console.log(last);
		break;
	}
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