import { Player } from "@minecraft/server";
import { SceneCamera, SceneCameraTransform } from "./sceneCamera";
import { CVector } from "../vector";

export class StaticCamera extends SceneCamera {
    position:CVector
    lookAt:CVector
    constructor(player:Player, position:CVector, lookAt:CVector) {
        super(player);
        this.position = position;
        this.lookAt = lookAt;
    }
    getState(t: number): SceneCameraTransform {
        return {
            cameraPreset:"minecraft:free",
            transformation: {
                facingLocation:this.lookAt,
                location:this.position
            }
        }
    }

}
