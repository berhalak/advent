import { lines, input } from "./lib";


var raw = lines();

let map: any = {};

for (let l of raw) {
	let parts = l.split(')');

	let inner = parts[0];
	let outer = parts[1];

	map[inner] = map[inner] || { name: inner };
	map[outer] = map[outer] || { name: outer };

	map[inner].right = map[inner].right || [];
	map[outer].left = map[inner];
	map[inner].right.push(map[outer]);
}

let count = 0;


let my = map['YOU'];

let santa = map['SAN'];

function test(point: any, was: any) {
	if (point.name == 'SAN') {
		return true;
	} else {
		if (point.right) {
			for (let r of point.right) {
				if (r != was) {
					let rightOk = test(r, point);
					if (rightOk) {
						count++;
						return true;
					}
				}
			}

		}
		if (point.left && point.left != was) {
			let leftOk = test(point.left, point);
			if (leftOk) {
				count++;
				return true;
			}
		}
		return false;
	}
}

test(my, null);


console.log(count - 2);