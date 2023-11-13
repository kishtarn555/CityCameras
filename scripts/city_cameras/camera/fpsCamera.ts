import { Player } from "@minecraft/server";
import { SceneCamera, SceneCameraTransform } from "./sceneCamera";
import { CVector } from "../vector";

export class FpsCamera extends SceneCamera {
    constructor(player:Player) {
        super(player);
    }
    getState(t: number): SceneCameraTransform {
        return {
            cameraPreset:"minecraft:first_person",
            transformation: {easeOptions:{
                
            }}
        }
    }

}
