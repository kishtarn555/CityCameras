import { CVector } from "../vector";

interface OrbitData {
    center:CVector,
    radius:CVector,
    angleSpeed:number

}

class Orbit {
    center:CVector
    radius:CVector
    angleSpeed:number


    constructor(data:OrbitData) {
        this.center = data.center;
        this.radius = data.radius;
        this.angleSpeed = data.angleSpeed
        
      
    }

    getPolar() {
        const r = this.radius.magnitude();
        const theta = Math.atan2(this.radius.y, this.radius.x);
        const phi = Math.acos(this.radius.z / r);
        return { r, theta, phi }
    }

    position(t:number):CVector {
        const {r, theta, phi} = this.getPolar();
        const offset =t*this.angleSpeed;
        const x = r * Math.sin(phi) * Math.cos(theta+offset);
        const y = r * Math.sin(phi) * Math.sin(theta+offset);
        const z = r * Math.cos(phi);
        return new CVector(x, y, z);

    }

}