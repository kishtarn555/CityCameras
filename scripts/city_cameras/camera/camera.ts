import { CameraDefaultOptions, CameraSetFacingOptions, CameraSetLocationOptions, CameraSetPosOptions, CameraSetRotOptions } from "@minecraft/server";
import { CVector } from "../vector";




type CameraTransformations =  CameraDefaultOptions | CameraSetFacingOptions | CameraSetLocationOptions | CameraSetPosOptions | CameraSetRotOptions


interface CityCameraTransform {
    cameraPreset:string,
    transformation:CameraTransformations
    playerLocation?:CVector

}

abstract class CityCamera {
    player:
    /**
     * 
     * @param t represents the time of the camera, it ranges [0, 1]re
     * @
     */
    abstract getState(t:number):CityCameraTransform;
}