import { CVector } from "../vector";

export interface OrbitData {
    center:CVector,
    radius:CVector,
    arcLength:number

}

export class OrbitY {
    center:CVector
    radius:CVector
    arcLength:number


    constructor(data:OrbitData) {
        this.center = data.center;
        this.radius = data.radius;
        this.arcLength = data.arcLength
        
      
    }

    private getPolar() {
        const r = this.radius.magnitude();
        const theta = Math.atan2(this.radius.z, this.radius.x);
        const phi = Math.acos(this.radius.y / r);
        return { r, theta, phi }
    }

    getPosition(t:number):CVector {
        const {r, theta, phi} = this.getPolar();
        const offset =t*this.arcLength;
        const x = r * Math.sin(phi+offset) * Math.cos(theta);
        const z = r * Math.sin(phi+offset) * Math.sin(theta);
        const y = r * Math.cos(phi+offset);
        return new CVector(x, y, z).add(this.center);

    }

}