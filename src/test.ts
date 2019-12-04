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
    if (!grouped.some(x => x.list.length >= 2))
        return false;

    if (f != p.orderBy(x => x).join('')) {
        return false;
    }

    return true;
}

function test2(g: number) {
    let f = g.toString();

    let p = f.split('');

    // test same number
    let grouped = p.group(x => x);
    if (!grouped.some(x => x.list.length == 2))
        return false;


    if (f != p.orderBy(x => x).join('')) {
        return false;
    }


    return true;
}

for (let i = start; i <= end; i++) {
    if (test2(i)) count++;
}

console.log(count);