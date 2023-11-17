import { Vector3 } from "@minecraft/server";

function instanceOfV3(object: any): object is Vector3 {
    return 'x' in object &&'y' in object &&'z' in object ;
}
export class CVector implements Vector3 {
    x: number
    y: number
    z: number

    constructor(x: number, y: number, z: number) {
        this.x=x;
        this.y=y;
        this.z=z;
    }

    magnitude(): number {
        return Math.sqrt(
            this.x * this.x +
            this.y * this.y +
            this.z * this.z
        );
    }

    add(target: Vector3 | [number,number,number]) {
        if (instanceOfV3(target)) {

            return new CVector(
                this.x + target.x,
                this.y + target.y,
                this.z + target.z,
            )
        } else {
            return new CVector(
                this.x + target[0],
                this.y + target[1],
                this.z + target[2],
            )
        }
    }



    sub(target: Vector3 | [number,number,number]) {
        if (instanceOfV3(target)) {

            return new CVector(
                this.x - target.x,
                this.y - target.y,
                this.z - target.z,
            )
        } else {
            return new CVector(
                this.x - target[0],
                this.y - target[1],
                this.z - target[2],
            )
        }
    }

    scale(scalar:number) {
        return new CVector(
            this.x*scalar,
            this.y*scalar,
            this.z*scalar
        )
    }

    dot(target: Vector3 | [number,number,number]):number {
        if (instanceOfV3(target)) {
            return (
                this.x * target.x +
                this.y * target.y +
                this.z * target.z
            )
            
        } else {
            return (
                this.x * target[0]+
                this.y * target[1]+
                this.z * target[2]
            );
        }
    }

    normalized() {
        const factor = this.magnitude();
        return new CVector(
            this.x/factor,
            this.y/factor,
            this.z/factor
        )
    }

    toString() {
        return `<${this.x}, ${this.y}, ${this.z}>`;
    }

    static zero():CVector {
        return new CVector(0,0,0);
    }

    static lerp(a:CVector, b:CVector, alpha:number) : CVector {
        return a.scale(1-alpha).add(b.scale(alpha) );

    }
    

}