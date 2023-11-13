import { CameraDefaultOptions, CameraSetFacingOptions, CameraSetLocationOptions, CameraSetPosOptions, CameraSetRotOptions, Player } from "@minecraft/server";
import { CVector } from "../vector";




type CameraTransformations =  CameraDefaultOptions | CameraSetFacingOptions | CameraSetLocationOptions | CameraSetPosOptions | CameraSetRotOptions


export interface CityCameraTransform {
    cameraPreset:string,
    transformation:CameraTransformations
    playerLocation?:CVector

}

export abstract class CityCamera {
    player:Player;

    constructor(player:Player) {
        this.player = player;
    }
    /**
     * 
     * @param t represents the time of the camera, it ranges [0, 1]re
     * @
     */
    abstract getState(t:number):CityCameraTransform;
}