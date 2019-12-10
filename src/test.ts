import { lines, read } from "./lib";
import { Runtime, Env } from "./prog";
import { maxHeaderSize } from "http";
import { EOL } from "os";


class Layer {
	draw(img: Image) {
		for (let y = 0; y < this.h; y++) {
			for (let x = 0; x < this.w; x++) {
				img.set(x, y, this.data[y][x]);
			}
		}
	}

	count(digit: number): any {
		let sum = 0;
		for (let row of this.data) {
			for (let n of row) {
				if (n == digit) sum++;
			}
		}
		return sum;
	}

	constructor(public w: number, public h: number) {

	}

	size = 0;

	x = 0;
	y = 0;

	data: Array<Array<number>> = [];

	get full(): boolean {
		return this.size == this.w * this.h;
	}

	push(n: number) {
		this.size++;
		if (!this.data[this.y]) this.data[this.y] = [];
		this.data[this.y][this.x] = n;
		this.x++;
		if (this.x == this.w) {
			this.x = 0;
			this.y++;
		}
	}
}

class Image {
	set(x: number, y: number, pixel: number) {
		this.data[y] = this.data[y] || [];
		if (pixel == 2) {
			return;
		}
		this.data[y][x] = pixel;
	}


	data: Array<Array<number>> = [];

	render(): any {
		let out = "";

		for (let y = 0; y < this.h; y++) {
			for (let x = 0; x < this.w; x++) {
				let pixel = this.data[y][x] || '0';
				if (pixel == '0') pixel = ' ';
				out += pixel.toString();
			}
			out += EOL;
		}

		return out;
	}

	constructor(public w: number, public h: number) {

	}
}

class Canvas {

	render(): any {
		let img = new Image(this.w, this.h);
		for (let layer of this.layers.invert()) {
			layer.draw(img);
		}
		return img.render();
	}

	layers: Layer[] = [];

	constructor(public w: number, public h: number) {

	}

	add(n: number) {
		let current = this.getCurrent();
		if (current.full) {
			this.newLayer();
		}
		current = this.getCurrent();
		current.push(n);
	}

	getCurrent(): Layer {
		if (this.layers.length == 0) {
			return this.newLayer();
		} else {
			return this.layers.last() as Layer;
		}
	}

	newLayer(): Layer {
		let l = new Layer(this.w, this.h);
		this.layers.push(l);
		return l;
	}
}


let input = read();
//input = '123456789012';
let w = 25, h = 6;

// w = 2;
// h = 2;
// input = '0222112222120000';

let arr = input.split('');
let c = new Canvas(w, h);
for (let i = 0; i < arr.length; i++) {
	c.add(arr[i].toNumber());
}
// let f = c.layers.map(x => {
// 	return {
// 		layer: x,
// 		zeros: x.count(0)
// 	}
// }).orderBy(x => x.zeros).first().layer;

// let answer = f.count(1) * f.count(2);

//console.log(answer);

console.log(c.render());