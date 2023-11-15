import { CVector } from "./vector";

export class Plane {
    normal:CVector
    point: CVector

    constructor(normal:CVector,point: CVector) {
        this.normal = normal.normalized();
        this.point = point;
    }

    projectOnto(target:CVector):CVector {
        //target - normal * dot(normal, target - point)
        const projection= target.sub(this.normal.scale(this.normal.dot(target.sub(this.point))));
        return projection;
        
    }

}