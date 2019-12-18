import { lines, read, Point } from "./lib";
import { Runtime, Env, Canvas, readCode } from "./prog";

let raw = read().split('').map(x => x.toNumber());
let pattern = [0, 1, 0, -1];
let input: number[] = [];



for (let i = 0; i < 10000; i++) {
	input.push(...raw);
}

let offset = 5976733;


function calcNumber(pos: number, nums: number[]): number {


	let sum = 0;
	for (let i = pos; i < nums.length;) {
		for (let t = i; t <= i + pos && t < nums.length; t++) {
			sum += nums[t];
		}
		let subStart = i + pos + 1 + pos + 1;
		let subEnd = subStart + pos;
		for (let t = subStart; t <= subEnd && t < nums.length; t++) {
			sum -= nums[t];
		}
		i = subEnd + 1 + pos + 1;
	}
	return Math.abs(sum) % 10;
}



function transform(input: number[]): number[] {
	let out: number[] = [];

	for (let i = 5976733; i < input.length; i++) {
		if ((i - 5976733) % 10000 == 0)
			console.log(i - 5976733);
		out.push(calcNumber(i, input));
	}


	for (let i = 5976733; i < input.length; i++) {
		input[i] = out[i];
	}

	return input;
}

let phase = 0;

function sum(start: number, arr: number[]) {
	let r = 0;
	for (let i = start; i < arr.length; i++) {
		r += arr[i];
	}
	return r;
}

while (phase != 100) {
	phase++;

	let out: number[] = [];
	let last = 0;
	for (let i = offset; i < input.length; i++) {
		if (out.length == 0) {
			out.push(sum(i, input));
		} else {
			out.push(out.last() as number - input[i - 1]);
		}

	}
	out = out.map(x => x % 10);
	for (let i = offset; i < input.length; i++) {
		input[i] = out[i - offset];
	}
	console.log(phase);
}

let result = input.skip(offset - 1).take(8).join('');
console.log(result);




// function calcNumber(pos: number, nums: number[]): number {



// 	let patt = prepere(pos) as number[];

// 	let calc: number[] = [];

// 	nums.forEach((a, i) => {
// 		calc[i] = a * patt[i];
// 	});

// 	let sum = calc.sum();

// 	let res = Math.abs(sum) % 10;
// 	return res;
// }


// function transform(input: number[]): number[] {
// 	let out = [];

// 	for (let i = 0; i < input.length; i++) {
// 		out.push(calcNumber(i, input));
// 	}

// 	return out;
// }

// while (phase != 100) {
// 	phase++;
// 	input = transform(input);

// 	let eight = input.take(8).join('');
// 	console.log(`After ${phase} phase: ${eight}`);
// }

