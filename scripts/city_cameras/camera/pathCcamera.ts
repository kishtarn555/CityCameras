import { Player } from "@minecraft/server";
import { SceneCamera, SceneCameraTransform } from "./sceneCamera";
import { CVector } from "../vector";

export class PathCamera extends SceneCamera {
    position:(t:number)=>CVector
    lookAt:(t:number)=>CVector
    constructor(player:Player, position:(t:number)=>CVector, lookAt:(t:number)=>CVector) {
        super(player);
        this.position = position;
        this.lookAt = lookAt;
    }
    getState(t: number): SceneCameraTransform {
        return {
            cameraPreset:"minecraft:free",
            transformation: {
                facingLocation:this.lookAt(t),
                location:this.position(t)
            }
        }
    }

}
