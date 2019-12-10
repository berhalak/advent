import { lines, read } from "./lib";
import { Runtime, Env } from "./prog";
let memory = read().split(',').map(x => x.toNumber());


//memory = [3, 26, 1001, 26, -4, 26, 3, 27, 1002, 27, 2, 27, 1, 27, 26, 27, 4, 27, 1001, 28, -1, 28, 1005, 28, 6, 99, 0, 0, 5];

let max = 0;

let low = 5, high = 9;

class Amp implements Env {
	run: Runtime | null = null;
	last = 0;
	output(a: number): void {
		if (this.next) {

			//console.log(`Amp ${this.phase} output ${a}`);

			if (a == 129) {
				debugger;
			}

			this.last = a;
			this.next.signal(a);
		}
	}

	input(): number {
		if (this.init) {
			//console.log(`Amp ${this.phase} init`);
			this.init = false;
			return this.phase;
		}
		if (this.prev !== null) {

			let v = this.prev;
			//console.log(`Amp ${this.phase} got signal ${v}`);

			this.prev = null;
			return v;
		}
		throw new Error("No signal")
	}

	next: Amp | null = null;

	memo: number[];
	constructor(private phase: number) {
		this.memo = [...memory];
	}

	prev: any = null;
	init = true;

	signal(signal: number) {
		if (this.run) {
			this.prev = signal;
			this.run.execute(this);
			return;
		}
		this.run = new Runtime(this.memo);
		this.prev = signal;
		this.run.execute(this);
	}
}


for (let a = low; a <= high; a++) {
	for (let b = low; b <= high; b++) {
		for (let c = low; c <= high; c++) {
			for (let d = low; d <= high; d++) {
				for (let e = low; e <= high; e++) {
					let phase = [a, b, c, d, e];

					//phase = [9, 8, 7, 6, 5];

					if (phase.distinct().length != 5) {
						continue;
					}

					let amps = phase.map(x => new Amp(x));

					amps[0].next = amps[1];
					amps[1].next = amps[2];
					amps[2].next = amps[3];
					amps[3].next = amps[4];
					amps[4].next = amps[0];

					amps[0].signal(0);

					max = Math.max(max, amps[4].last);
					//console.log(max);
					//throw new Error("end")
				}
			}
		}
	}
}


console.log(max);

//console.log(memory);