import { Vector3 } from "@minecraft/server";


export class CVector {
    value: Vector3

    constructor(x: number, y: number, z: number) {
        this.value = { x: x, y: y, z: z };
    }

    magnitude(): number {
        return Math.sqrt(
            this.value.x * this.value.x +
            this.value.y * this.value.y +
            this.value.z * this.value.z
        );
    }

    add(target: CVector | Vector3) {
        if (target instanceof CVector) {
            return new CVector(
                this.value.x + target.value.x,
                this.value.y + target.value.y,
                this.value.z + target.value.z,
            );
        } else {

            return new CVector(
                this.value.x + target.x,
                this.value.y + target.y,
                this.value.z + target.z,
            )
        }
    }



    sub(target: CVector | Vector3) {
        if (target instanceof CVector) {
            return new CVector(
                this.value.x - target.value.x,
                this.value.y - target.value.y,
                this.value.z - target.value.z,
            );
        } else {

            return new CVector(
                this.value.x - target.x,
                this.value.y - target.y,
                this.value.z - target.z,
            )
        }
    }

    v3():Vector3 {
        return {
            x:this.value.x,
            y:this.value.y,
            z:this.value.z,
        }
    }

}