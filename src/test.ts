import { lines, input } from "./lib";



let memory = input().split(',').map(x => x.toNumber());

//memory = [1002, 4, 3, 4, 33];

class Add {
    constructor(private pos: string) {

    }
    invoke(index: number) {
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
            if (t == undefined) {
                debugger;
            }
            b = t;
        }

        memory[c] = a + b;
        return index + 3;
    }
}

class Mul {
    constructor(private pos: string) {

    }

    invoke(index: number) {
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
        return index + 3;
    }
}

class Store {
    constructor(private pos: string) {

    }

    invoke(index: number) {
        let a = memory[index + 1];
        memory[a] = 5;
        return index + 1;
    }
}

class Out {
    constructor(private pos: string) {

    }
    invoke(index: number) {
        let a = memory[index + 1];
        let amode = this.pos[2];

        if (amode == '0') {
            a = memory[a];
        }
        console.log(a);
        return index + 1;
    }
}

class JumpFalse {
    constructor(private pos: string) {

    }

    invoke(index: number) {
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
            return b - 1;
        }
        return index + 3;
    }
}


class Equal {
    constructor(private pos: string) {

    }

    invoke(index: number) {
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
        return index + 3;
    }
}

class LessThen {
    constructor(private pos: string) {

    }

    invoke(index: number) {
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
        return index + 3;
    }
}

class JumpTrue {
    constructor(private pos: string) {

    }

    invoke(index: number) {
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
            return b - 1;
        }
        return index + 3;
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

for (let i = 0; i < memory.length; i++) {
    let opcode = memory[i];

    let ins = instruction(opcode);
    if (ins == null) {
        break;
    }
    let delta = ins.invoke(i);
    i = delta;
}

//console.log(memory);