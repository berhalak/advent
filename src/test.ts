import { lines } from "./lib";

console.log(lines().invert());

let start = 138307;
let end = 654504;
let count = 0;


function test(g: number) {
    let f = g.toString();
    let p = f.split('');

    // test same number
    let grouped = p.group(x => x);
    if (!grouped.some(x => x.list.length == 2))
        return false;

    var ok = true;

    for (let i = 0; i < p.length - 1; i++) {
        if (p[i] > p[i + 1]) {
            ok = false;
            break;
        }
    }

    return ok;
}

function test2(g: number) {
    let f = g.toString();

    let p = f.split('');

    // test same number
    let sums: any = {};
    for (let i = 0; i < p.length - 1; i++) {
        if (p[i] == p[i + 1]) {
            sums[p[i]] = sums[p[i]] || 0;
            sums[p[i]]++;
        }
    }

    if (!Object.values(sums).includes(1)) {
        return false;
    }


    let ok = true;

    for (let i = 0; i < p.length - 1; i++) {
        if (p[i] > p[i + 1]) {
            ok = false;
            break;
        }
    }

    return ok;
}

for (let i = start; i <= end; i++) {
    if (test(i)) count++;
}

console.log(count);