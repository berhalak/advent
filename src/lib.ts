import fs from "fs";
import path from "path"
import "@berhalak/js"
const { EOL } = require('os');

export function lines() {
    let raw = fs.readFileSync(path.join(__dirname, "./input.txt")).toString().trim();
    let lines = raw.split(EOL);
    return lines;
}
