import { Player } from "@minecraft/server";
import { CatmullRoomNormalized, catmullDerivate, catmullRom } from "../paths/catmullRom";
import { CVector } from "../vector";
import { PathCamera } from "./pathCcamera";
import { EaseFunction } from "../Easing/easeFunction";

function catmullNormalizedPath(points:CVector[]):[(t:number)=>CVector,(t:number)=>CVector] {
    const catmull = new CatmullRoomNormalized(points);
    return [
        (t:number)=> catmull.getPointDirection(t)[0],
        (t:number)=> catmull.getPointDirection(t)[0].add(catmull.getPointDirection(t)[1].normalized().scale(5)),
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