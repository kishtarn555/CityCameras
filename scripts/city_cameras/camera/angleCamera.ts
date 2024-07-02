import { Player } from "@minecraft/server";
import { SceneCamera, SceneCameraTransform } from "./sceneCamera";
import { CVector } from "../vector";
import { EaseFunction } from "../Easing/easeFunction";
import { easeLinear } from "../Easing/easingFunctions";

export class AngleCamera extends SceneCamera {
    position:(t:number)=>CVector
    pitch:(t:number)=>number
    yaw:(t:number)=>number
    ease:EaseFunction
    constructor(player:Player, position:(t:number)=>CVector, pitch:(t:number)=>number, yaw:(t:number)=>number, easeFunction?:EaseFunction) {
        super(player);
        this.position = position;
        this.pitch = pitch;
        this.yaw = yaw;
        this.ease = easeFunction ?? easeLinear
    }
    getState(t: number): SceneCameraTransform {
        const x = this.ease(t);
        return {
            cameraPreset:"minecraft:free",
            transformation: {
                facingLocation:this.position(x).add( new CVector(-Math.sin(this.yaw(x)),Math.sin(this.pitch(x)),-Math.cos(this.yaw(x))),),
                location:this.position(x)
            }
        }
    }

}
