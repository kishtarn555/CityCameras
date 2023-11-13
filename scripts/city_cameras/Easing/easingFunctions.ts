import { EaseFunction } from "./easeFunction";

export const easeLinear:EaseFunction=(x)=>x;
export const easeInQuad:EaseFunction=(x)=>x*x;
export const easeOutQuad:EaseFunction=(x)=>1 - (1 - x) * (1 - x);
export const easeInOutQuad:EaseFunction=(x: number) => 
    x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
    