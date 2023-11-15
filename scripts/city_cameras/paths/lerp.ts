import { EaseFunction } from "../Easing/easeFunction";

export function lerp (a:number, b:number, t:number) {
    return a*(1-t)+b*t;
}

export function easeLerp(a:number, b:number, ease:EaseFunction):EaseFunction {
    return (x:number)=>lerp(a,b,ease(x));
}