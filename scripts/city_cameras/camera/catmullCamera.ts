import { Player } from "@minecraft/server";
import { catmullRomNormalized, catmullRomNormalizedDerivate } from "../paths/catmullRom";
import { CVector } from "../vector";
import { PathCamera } from "./pathCcamera";
import { EaseFunction } from "../Easing/easeFunction";

function catmullNormalizedPath(points:CVector[]):[(t:number)=>CVector,(t:number)=>CVector] {

    return [
        (t:number)=> catmullRomNormalized(points, t),
        (t:number)=> catmullRomNormalized(points, t).add(catmullRomNormalizedDerivate(points,t).normalized().scale(5)),
    ]

}



export function catmullCamera(player:Player, points:CVector[], easeFunction?:EaseFunction):PathCamera {
    const paths = catmullNormalizedPath(points)
    return new PathCamera(
        player,
        paths[0],
        paths[1],
        easeFunction

    )
} 