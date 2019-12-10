import { IncomingMessage } from "http";

class Add {
    constructor(private pos: string) {

    }
    invoke(run: Runtime, env: Env) {
        let index = run.index;
        let memory = run.memory;

        let a = memory[index + 1];
        let b = memory[index + 2];
        let c = memory[index + 3];
        let amode = this.pos[2];
        let bmode = this.pos[1];

        if (amode == '0') {
            a = memory[a];
        }
        if (bmode == '0') {
            let t = memory[b];
            b = t;
        }

        memory[c] = a + b;
        run.index += 4;
    }
}

class Mul {
    constructor(private pos: string) {

    }

    invoke(run: Runtime, env: Env) {
        let index = run.index;
        let memory = run.memory;

        let a = memory[index + 1];
        let b = memory[index + 2];
        let c = memory[index + 3];
        let amode = this.pos[2];
        let bmode = this.pos[1];

        if (amode == '0') {
            a = memory[a];
        }
        if (bmode == '0') {
            b = memory[b];
        }
        memory[c] = a * b;
        run.index += 4;

    }
}

class Store {
    constructor(private pos: string) {

    }

    invoke(run: Runtime, env: Env) {
        let index = run.index;
        let memory = run.memory;

        let a = memory[index + 1];

        memory[a] = env.input();
        run.index += 2;
    }
}

class Out {
    constructor(private pos: string) {

    }
    invoke(run: Runtime, env: Env) {
        let index = run.index;
        let memory = run.memory;

        let a = memory[index + 1];
        let amode = this.pos[2];

        if (amode == '0') {
            a = memory[a];
        }
        //console.log(a);
        run.index += 2;

        env.output(a);
    }
}

class JumpFalse {
    constructor(private pos: string) {

    }

    invoke(run: Runtime, env: Env) {
        let index = run.index;
        let memory = run.memory;

        let a = memory[index + 1];
        let b = memory[index + 2];
        let c = memory[index + 3];
        let amode = this.pos[2];
        let bmode = this.pos[1];

        if (amode == '0') {
            a = memory[a];
        }
        if (bmode == '0') {
            b = memory[b];
        }
        if (a == 0) {
            run.index = b;
        } else {
            run.index += 4;
        }
    }
}


class Equal {
    constructor(private pos: string) {

    }

    invoke(run: Runtime, env: Env) {
        let index = run.index;
        let memory = run.memory;
        let a = memory[index + 1];
        let b = memory[index + 2];
        let c = memory[index + 3];
        let amode = this.pos[2];
        let bmode = this.pos[1];

        if (amode == '0') {
            a = memory[a];
        }
        if (bmode == '0') {
            b = memory[b];
        }
        memory[c] = a == b ? 1 : 0;
        run.index += 4;
    }
}

class LessThen {
    constructor(private pos: string) {

    }

    invoke(run: Runtime, env: Env) {
        let index = run.index;
        let memory = run.memory;

        let a = memory[index + 1];
        let b = memory[index + 2];
        let c = memory[index + 3];
        let amode = this.pos[2];
        let bmode = this.pos[1];

        if (amode == '0') {
            a = memory[a];
        }
        if (bmode == '0') {
            b = memory[b];
        }
        memory[c] = a < b ? 1 : 0;
        run.index += 4;

    }
}

class JumpTrue {
    constructor(private pos: string) {

    }

    invoke(run: Runtime, env: Env) {
        let index = run.index;
        let memory = run.memory;
        let a = memory[index + 1];
        let b = memory[index + 2];
        let c = memory[index + 3];
        let amode = this.pos[2];
        let bmode = this.pos[1];

        if (amode == '0') {
            a = memory[a];
        }
        if (bmode == '0') {
            b = memory[b];
        }
        if (a != 0) {
            run.index = b;
        } else {
            run.index += 3;
        }
    }
}

function instruction(op: number) {
    let str = op.toString().padStart(5, '0');
    let code = str.split('').skip(3).take(2).join('').toNumber();
    let pos = str.split('').take(3).join('');
    if (code == 1) {
        return new Add(pos);
    }
    if (code == 2) {
        return new Mul(pos);
    }
    if (code == 3) {
        return new Store(pos);
    }
    if (code == 4) {
        return new Out(pos);
    }
    if (code == 5) {
        return new JumpTrue(pos);
    }
    if (code == 6) {
        return new JumpFalse(pos);
    }
    if (code == 7) {
        return new LessThen(pos);
    }
    if (code == 8) {
        return new Equal(pos);
    }
    if (code == 99) {
        return null;
    }
}


export interface Env {
    output(a: number): void;
    input(): number;
}

export class Runtime {
    index = 0;

    constructor(public memory: number[]) {

    }

    execute(env: Env) {
        let memory = this.memory;
        while (this.index < memory.length) {
            let opcode = memory[this.index];

            let ins = instruction(opcode);
            if (ins == null) {
                break;
            }

            ins.invoke(this, env);
        }
    }
}



//let memory = read().split(',').map(x => x.toNumber());

//console.log(memory);