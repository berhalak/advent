import { lines, read, Point } from "./lib";
import { Runtime, Env, Canvas, readCode } from "./prog";

let raw = read().split('').map(x => x.toNumber());
let pattern = [0, 1, 0, -1];
let input = [...raw];
for (let i = 0; i < 10000; i++) {
	input.push(...raw);
}




function calcNumber(pos: number, nums: number[]): number {
	let sum = 0;
	for (let i = pos; i < nums.length;) {
		for (let t = i; t <= i + pos && t < nums.length; t++) {
			sum += nums[t];
		}
		let subStart = i + pos + 1 + pos;
		let subEnd = subStart + pos;
		for (let t = subStart; t <= subEnd && t < nums.length; t++) {
			sum -= nums[t];
		}
		i += 4 * (pos + 1);
	}
	return Math.abs(sum) % 10;
}

console.log(input.length);

function transform(input: number[]): number[] {
	let out: number[] = [];

	for (let i = 1746510; i <= 1746510 + 8; i++) {
		out.push(calcNumber(i, input));
	}


	for (let i = 1746510; i <= 1746510 + 8; i++) {
		input[i] = out[i - 1746510];
	}

	return input;
}

let phase = 0;
while (phase != 100) {
	phase++;
	input = transform(input);
}

let out = input.skip(1746510).take(8).join('').toNumber();
console.log(out);



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

