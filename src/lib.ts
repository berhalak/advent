import fs from "fs";
import path from "path"
import "@berhalak/js"
const { EOL } = require('os');

export function lines() {
    let lines = read().split(EOL);
    return lines;
}
export function read() {
    return fs.readFileSync(path.join(__dirname, "./input.txt")).toString().trim();
}

