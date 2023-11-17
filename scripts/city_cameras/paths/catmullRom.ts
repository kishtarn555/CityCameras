import { CVector } from "../vector";

export function catmullRom(points: CVector[], alpha:number): CVector {

    const sAlpha = alpha*(points.length-3);
    const idx = Math.floor(sAlpha);
    const t = sAlpha - idx;

    const t2 = t * t;
    const t3 = t2 * t;

    const p0 = points[idx];
    const p1 = points[idx+1];
    const p2 = points[idx+2];
    const p3 = points[idx+3];

    const c0 = p1.scale(2);
    const c1 = p2.sub(p0).scale(0.5);
    const c2 = p0.scale(2).sub(p1.scale(5)).add(p2.scale(4)).sub(p3);
    const c3 = p0.sub(p1.scale(0.5)).add(p2.scale(0.5)).sub(p3.scale(0.5)).add(p3.scale(0.5));

    const x = c0.x + c1.x * t + c2.x * t2 + c3.x * t3;
    const y = c0.y + c1.y * t + c2.y * t2 + c3.y * t3;
    const z = c0.z + c1.z * t + c2.z * t2 + c3.z * t3;

    return new CVector(x, y, z);

}


export function catmullDerivate(points: CVector[], alpha:number): CVector {

    const sAlpha = alpha*(points.length-3);
    const idx = Math.floor(sAlpha);
    const pt = sAlpha - idx;

    const t = 1;
    const t2 = 2*pt;
    const t3 = 3*pt * pt;

    const p0 = points[idx];
    const p1 = points[idx+1];
    const p2 = points[idx+2];
    const p3 = points[idx+3];

    const c0 = p1.scale(2);
    const c1 = p2.sub(p0).scale(0.5);
    const c2 = p0.scale(2).sub(p1.scale(5)).add(p2.scale(4)).sub(p3);
    const c3 = p0.sub(p1.scale(0.5)).add(p2.scale(0.5)).sub(p3.scale(0.5)).add(p3.scale(0.5));

    const x = c0.x + c1.x * t + c2.x * t2 + c3.x * t3;
    const y = c0.y + c1.y * t + c2.y * t2 + c3.y * t3;
    const z = c0.z + c1.z * t + c2.z * t2 + c3.z * t3;

    return new CVector(x, y, z);

}


export function catmullRomLength(points: CVector[], numSegments: number = 100, stoppingPoint:number=1): number {
    if (points.length < 4) {
        throw new Error('Catmull-Rom spline requires at least 4 control points.');
    }

    let length = 0;

    for (let i = 0; i < numSegments; i++) {
        const t = i / (numSegments - 1);
        if (t > stoppingPoint) break;
        const point1 = catmullRom(points, t);
        const point2 = catmullRom(points, t + 1 / (numSegments - 1));
        length += point1.sub(point2).magnitude();
    }

    return length;
}


export function catmullRomNormalized(points:CVector[], alpha:number, integrationStep=100,epsilon=1e-5):CVector {
    const fullLength = catmullRomLength(points,integrationStep);
    let a =0, b=1;
    while (b-a > epsilon) {
        const m = (a+b)/2.0;
        if (catmullRomLength(points, integrationStep, m)/fullLength < alpha) {
            a=m;
        } else {
            b=m;
        }
    }

    return catmullRom(points, (a + b) / 2);
}


export function catmullRomNormalizedDerivate(points:CVector[], alpha:number, integrationStep=100,epsilon=1e-5):CVector {
    const fullLength = catmullRomLength(points,integrationStep);
    let a =0, b=1;
    while (b-a > epsilon) {
        const m = (a+b)/2.0;
        if (catmullRomLength(points, integrationStep, m)/fullLength < alpha) {
            a=m;
        } else {
            b=m;
        }
    }

    return catmullDerivate(points, (a + b) / 2);
}