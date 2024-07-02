import { CameraDefaultOptions, CameraSetFacingOptions, CameraSetLocationOptions, CameraSetPosOptions, CameraSetRotOptions, Player } from "@minecraft/server";
import { CVector } from "../vector";




type CameraTransformations =  CameraDefaultOptions | CameraSetFacingOptions | CameraSetLocationOptions | CameraSetPosOptions | CameraSetRotOptions


export interface SceneCameraTransform {
    cameraPreset:string,
    transformation:CameraTransformations
    playerLocation?:CVector

}

export abstract class SceneCamera {
    player:Player;

    constructor(player:Player) {
        this.player = player;
    }
    /**
     * 
     * @param t represents the time of the camera, it ranges [0, 1]re
     * @
     */
    abstract getState(t:number):SceneCameraTransform;



    getFreezeFrame(t:number):SceneCamera {
        return new class extends SceneCamera {
            player:Player;
            state: SceneCameraTransform;
            constructor(self:SceneCamera, t:number) {
                super(self.player);
                this.player = self.player;
                this.state = self.getState(t)
            }
            getState(t:number) {
                return this.state;
            }
        }(this,t);
    }
}