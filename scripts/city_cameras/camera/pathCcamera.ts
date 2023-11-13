import { Player } from "@minecraft/server";
import { SceneCamera, SceneCameraTransform } from "./sceneCamera";
import { CVector } from "../vector";
import { EaseFunction } from "../Easing/easeFunction";
import { easeLinear } from "../Easing/easingFunctions";

export class PathCamera extends SceneCamera {
    position:(t:number)=>CVector
    lookAt:(t:number)=>CVector
    ease:EaseFunction
    constructor(player:Player, position:(t:number)=>CVector, lookAt:(t:number)=>CVector, easeFunction?:EaseFunction) {
        super(player);
        this.position = position;
        this.lookAt = lookAt;
        this.ease = easeFunction ?? easeLinear
    }
    getState(t: number): SceneCameraTransform {
        const x = this.ease(t);
        return {
            cameraPreset:"minecraft:free",
            transformation: {
                facingLocation:this.lookAt(x),
                location:this.position(x)
            }
        }
    }

}
