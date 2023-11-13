import { TargetBlockHitAfterEvent } from "@minecraft/server";
import { CVector } from "../vector";

export class LinearPath {
    start:CVector
    end:CVector

    constructor(start:CVector, end:CVector) {
        this.start = start;
        this.end = end;
    }

    getPosition(t:number):CVector {
        let alpha = this.start.scale(1-t);
        let beta = this.end.scale(t);
        return alpha.add(beta);
    }
}