import { CVector } from "../vector";

export function catmullRom(points: CVector[], alpha: number): CVector {

    const sAlpha = alpha * (points.length - 3);
    const idxF = Math.floor(sAlpha);
    let idx = idxF;
    if (idxF === points.length - 3) {
        idx--;
    }
    const t = sAlpha - idx;

    const t2 = t * t;
    const t3 = t * t * t;

    const p0 = points[idx];
    const p1 = points[idx + 1];
    const p2 = points[idx + 2];
    const p3 = points[idx + 3];

    const c0 = p1.scale(2).scale(0.5);
    const c1 = p0.scale(-1).add(p2).scale(0.5);
    const c2 = p0.scale(2).add(p1.scale(-5)).add(p2.scale(4)).add(p3.scale(-1)).scale(0.5);
    const c3 = p0.scale(-1).add(p1.scale(3)).add(p2.scale(-3)).add(p3.scale(1)).scale(0.5);

    const x = c0.x + c1.x * t + c2.x * t2 + c3.x * t3;
    const y = c0.y + c1.y * t + c2.y * t2 + c3.y * t3;
    const z = c0.z + c1.z * t + c2.z * t2 + c3.z * t3;

    return new CVector(x, y, z);

}


export function catmullDerivate(points: CVector[], alpha: number): CVector {

    const sAlpha = alpha * (points.length - 3);
    const idxF = Math.floor(sAlpha);
    let idx = idxF;
    if (idxF === points.length - 3) {
        idx--;
    }
    const pt = sAlpha - idx;



    const t = 1;
    const t2 = 2 * pt;
    const t3 = 3 * pt * pt;

    const p0 = points[idx];
    const p1 = points[idx + 1];
    const p2 = points[idx + 2];
    const p3 = points[idx + 3];


    const c1 = p0.scale(-1).add(p2).scale(0.5);
    const c2 = p0.scale(2).add(p1.scale(-5)).add(p2.scale(4)).add(p3.scale(-1)).scale(0.5);
    const c3 = p0.scale(-1).add(p1.scale(3)).add(p2.scale(-3)).add(p3.scale(1)).scale(0.5);

    const x = c1.x * t + c2.x * t2 + c3.x * t3;
    const y = c1.y * t + c2.y * t2 + c3.y * t3;
    const z = c1.z * t + c2.z * t2 + c3.z * t3;

    return new CVector(x, y, z);

}

function catmullRomLength(points:CVector[], numSegments: number = 100): [number, number][] {
    if (points.length < 4) {
        throw new Error('Catmull-Rom spline requires at least 4 control points.');
    }

    const result:[number, number][] = []

    let length = 0;

    for (let i = 0; i < numSegments * points.length; i++) {
        const t = i / (numSegments - 1);
        if (t + 1 / (numSegments - 1) > 1) break;
        const point1 = catmullRom(points, t);
        const point2 = catmullRom(points, t + 1 / (numSegments - 1));
        length += point1.sub(point2).magnitude();
        result.push([t, length]);
    }

    return result;
}

export class CatmullRoomNormalized {
    points: CVector[]
    data


    constructor(points: CVector[], integrationSteps=2000) {
        this.points = points;
        this.data = catmullRomLength(this.points,integrationSteps);
    }

    



    getPointDirection(alpha: number): [CVector,CVector] {
        const fullLength = this.data[this.data.length-1][1];
        let a = 0, b = this.data.length-1;
        while (b != a) {
            const m = Math.floor((a + b) / 2.0);

            if (this.data[m][1] / fullLength < alpha) {
                a = m+1;
            } else {
                b = m;
            }
        }

        return [
            catmullRom(this.points, this.data[a][0]),
            catmullDerivate(this.points, this.data[a][0])
         ];
    }
}

