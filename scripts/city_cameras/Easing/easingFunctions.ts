import { EaseFunction } from "./easeFunction";

export const easeLinear:EaseFunction=(x)=>x;
export const easeInQuad:EaseFunction=(x)=>x*x;
export const easeOutQuad:EaseFunction=(x)=>1 - (1 - x) * (1 - x);
export const easeInOutQuad:EaseFunction=(x: number) => 
    x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
export const easeInCubic:EaseFunction=(x: number) => x*x*x;
export const easeOutCubic:EaseFunction=(x: number) => 1 - Math.pow(1 - x, 3);
export const easeInOutCubic:EaseFunction=(x: number) => 
    x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;;
