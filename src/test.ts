import { lines, read } from "./lib";
import { run } from "./prog";
let memory = read().split(',').map(x => x.toNumber());


//memory = [3, 15, 3, 16, 1002, 16, 10, 16, 1, 16, 15, 15, 4, 15, 99, 0, 0];

let max = 0;

for (let a = 0; a <= 4; a++) {
	for (let b = 0; b <= 4; b++) {
		for (let c = 0; c <= 4; c++) {
			for (let d = 0; d <= 4; d++) {
				for (let e = 0; e <= 4; e++) {
					let phase = [a, b, c, d, e];


					if (phase.distinct().length != 5) {
						continue;
					}

					let current = 0;
					for (let p of phase) {
						let input = [p, current];
						current = run(input, memory);
					}
					max = Math.max(max, current);
				}
			}
		}
	}
}


console.log(max);

//console.log(memory);