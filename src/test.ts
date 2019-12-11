import { lines, read, Point } from "./lib";
import { Runtime, Env, Canvas } from "./prog";
import { uptime } from "os";
let memory = read().split(',').map(x => x.toNumber());
