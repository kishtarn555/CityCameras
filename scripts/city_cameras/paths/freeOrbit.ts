import { EaseFunction } from "../Easing/easeFunction";
import { Plane } from "../plane";
import { CVector } from "../vector";

export interface FreeOrbitData {
    center:CVector,
    radius:CVector,
    arcLength:number,
    chord:CVector
    radialFunction?:EaseFunction

}

export class OrbitFree {
    readonly center:CVector
    readonly arcLength:number
    readonly radialFunction:EaseFunction
    readonly radius:CVector
    readonly xVector:CVector
    readonly yVector:CVector


    constructor(data:FreeOrbitData) {
        this.center = data.center;
        this.radius = data.radius;
        this.arcLength = data.arcLength
        this.radialFunction = data.radialFunction ?? ((_:number)=>1);

        this.xVector = this.radius.normalized();

        const plane = new Plane(this.xVector, CVector.zero())
        this.yVector = plane.projectOnto(data.chord).normalized();

        
      
    }


    getPosition(t:number):CVector {
        const theta =t*this.arcLength;
        const scale = this.radialFunction(t)
        const r = this.radius.magnitude()*scale;
        const planeX =  r*Math.cos(theta);
        const planeY =  r*Math.sin(theta);
        const result = this.xVector.scale(planeX).add(
            this.yVector.scale(planeY)  // Corrected this line
        ).add(this.center);
        return result;


    }

}