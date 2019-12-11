import { lines, read } from "./lib";
import { Runtime, Env } from "./prog";
let memory = read().split(',').map(x => x.toNumber());
