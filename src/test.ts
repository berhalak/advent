import { lines, read, Point } from "./lib";
import { Runtime, Env, Canvas, readCode } from "./prog";

let input = lines();

class Chemical {
	with(made: number): Chemical {
		let w = new Chemical('');
		w.size = made;
		w.name = this.name;
		return w;
	}
	sub(have: number): Chemical {
		let w = new Chemical('');
		w.size = this.size - have;
		w.name = this.name;
		return w;
	}
	mul(want: number) {
		let w = new Chemical('');
		w.size = this.size * want;
		w.name = this.name;
		return w;
	}

	toString() {
		return `${this.size} ${this.name}`;
	}

	size: number;
	name: string;

	constructor(txt: string) {
		if (txt) {
			let p = txt.split(' ');
			this.size = p[0].toNumber();
			this.name = p[1];
		} else {
			this.size = 0;
			this.name = '';
		}
	}
}


interface IReaction {
	parts(): Chemical[];
	size: number;
	name: string;
}


class Recipe {

	make(toDo: Chemical, c: Store) {
		let fun = this.get(toDo.name);

		let can = toDo.size;

		if (can < fun.size) {
			can = fun.size;
		} else if (can > fun.size) {
			can = Math.ceil(can / fun.size) * fun.size;
		}

		let size = can / fun.size;


		for (let p of fun.parts()) {
			c.youNeed(p.mul(size), toDo.with(fun.size).toString());
		}

		c.youMade(toDo.with(can));
	}

	constructor(private list: Reaction[]) {

	}

	get(name: string): IReaction {
		if (name == "ORE") {
			return new Ore();
		}
		return this.list.find(x => x.name == name) as IReaction;
	}
}



class Reaction {
	parts() {
		return this.from;
	}
	get name() {
		return this.out.name;
	}
	get size() {
		return this.out.size;
	}

	private from: Chemical[];
	private out: Chemical;

	constructor(line: string) {
		let p = line.split('=>').map(x => x.trim());
		let from = p[0];
		let to = p[1];

		let ing = from.split(', ');

		let chemicals = ing.map(x => new Chemical(x));
		let out = new Chemical(to);

		this.from = chemicals;
		this.out = out;
	}
}


class Ore implements IReaction {
	name = 'ORE';
	parts() {
		return [];
	}
	get size() {
		return 1;
	}
}


function log(s: any) {
	//console.log(s);
}

let recipe = new Recipe(input.map(x => new Reaction(x)));

class Store {
	fuel(): any {
		return this.data["FUEL"];
	}
	youMade(p: Chemical) {
		this.data[p.name] = this.data[p.name] || 0;
		this.data[p.name] += p.size;
		log(`you made ${p}`);
	}

	data: any = {};

	youNeed(p: Chemical, forr: string) {
		if (p.name == "ORE") {
			this.data["ORE"] = this.data["ORE"] || 0;

			if (this.data["ORE"] + p.size >= 1000000000000) {
				//console.log("About to add " + p.size);
				throw new Error();
			}
			this.data["ORE"] += p.size;


			log(`spending ${p.size} for ${forr}`);
			return;
		}


		this.data[p.name] = this.data[p.name] || 0;
		let have = this.data[p.name];
		log(`you need ${p} and you have ${have}`);

		if (have >= p.size) {
			this.data[p.name] -= p.size;
			return;
		}
		let todo = p.sub(have);
		this.data[todo.name] = 0;
		recipe.make(todo, this);
		this.data[todo.name] -= todo.size;

	}

}

let m = 3 * 1000 * 1000;

m = 4070011;

console.log("Start " + m)

while (true) {
	m--;

	let c = new Store();
	let f = new Chemical(`${m} FUEL`);
	try {
		recipe.make(f, c);
	} catch (e) {
		continue;
	}

	console.log(m);
	console.log(c.data["ORE"]);
	break;
}


