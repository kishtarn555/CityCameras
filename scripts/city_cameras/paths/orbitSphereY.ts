import { EaseFunction } from "../Easing/easeFunction";
import { CVector } from "../vector";

export interface OrbitData {
    center:CVector,
    radius:CVector,
    arcLength:number
    radialFunction?:EaseFunction

}

export class OrbitY {
    center:CVector
    radius:CVector
    arcLength:number
    radialFunction:EaseFunction


    constructor(data:OrbitData) {
        this.center = data.center;
        this.radius = data.radius;
        this.arcLength = data.arcLength
        this.radialFunction = data.radialFunction ?? ((x:number)=>1);
        
      
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
        const scale = this.radialFunction(t)
        const x = scale * r * Math.sin(phi+offset) * Math.cos(theta);
        const z = scale * r * Math.sin(phi+offset) * Math.sin(theta);
        const y = scale * r * Math.cos(phi+offset);
        return new CVector(x, y, z).add(this.center);

    }

}