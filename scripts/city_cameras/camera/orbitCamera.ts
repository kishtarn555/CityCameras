import { Player } from "@minecraft/server";
import { PathCamera } from "./pathCcamera";
import { Orbit, OrbitData } from "../paths/orbitSphere";
import { EaseFunction } from "../Easing/easeFunction";
import { OrbitY } from "../paths/orbitSphereY";



export function getOrbitCamera(player:Player, orbit:OrbitData,easeFunction?:EaseFunction):PathCamera {
    const path = new Orbit(orbit);
    return new PathCamera(
        player,
        path.getPosition.bind(path),
        (_)=>orbit.center,
        easeFunction
    )
}



export function getOrbitYCamera(player:Player, orbit:OrbitData,easeFunction?:EaseFunction):PathCamera {
    const path = new OrbitY(orbit);
    return new PathCamera(
        player,
        path.getPosition.bind(path),
        (_)=>orbit.center,
        easeFunction
    )
}