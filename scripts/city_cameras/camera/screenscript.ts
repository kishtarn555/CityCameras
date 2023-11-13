import { EasingType, Player } from "@minecraft/server";
import { CityCamera, CityCameraTransform } from "./camera";
interface ScriptElement {
    duration:number,
    camera:CityCamera
}

export class ScreenScript {
    private cameras:ScriptElement[]
    private totalDuration:number

    constructor() {
        this.cameras = []
        this.totalDuration = 0;
    }
    addCamera(element:ScriptElement) {
        this.cameras.push(element);
        this.totalDuration+=element.duration;
    }



    step(tick:number) {
        if (this.cameras.length ===0) {
            
            return;
        }
        let nextElement = 1;
        let camera = this.cameras[0].camera;
        let nextChange = 0;
        let duration =this.cameras[0].duration;
        for (let tick = 0; tick < this.totalDuration; tick++) {
            if (tick=== nextChange) {
                camera = this.cameras[nextElement].camera;
                let duration = this.cameras[nextElement].duration;
                nextElement = tick + duration; 
                nextElement++;

                this.applyState(camera.player,camera.getState(0), false)

                continue;
            }
        }
    }

    private applyState(player:Player,transform:CityCameraTransform, ease:boolean) {
        let cameraTransform = transform.transformation;
        if (ease) {
            cameraTransform.easeOptions = {
                easeTime:0.2,
                easeType: EasingType.Linear
            }
        }
        player.camera.setCamera(transform.cameraPreset, cameraTransform);
    }
}