import { EasingType, Player, system, world } from "@minecraft/server";
import { SceneCamera, SceneCameraTransform } from "./camera/sceneCamera";
interface ScriptElement {
    duration:number,
    camera:SceneCamera
}

export class CameraDirector {
    
    private cameras:ScriptElement[]
    private totalDuration:number
    private players:Player[]
    constructor() {
        this.cameras = []
        this.totalDuration = 0;
        this.players=[]
    }
    addCamera(element:ScriptElement) {
        this.cameras.push(element);
        this.totalDuration+=element.duration;
    }

    AddClear(player: Player) {
        this.players.push(player);
    }

    async runScript() {
        if (this.cameras.length ===0) {
            
            return;
        }        
        this.goToCamera(0);
        await new Promise<void>((resolve,_)=>system.runTimeout(resolve, 50));
        let nextElement = 0;
        let camera = this.cameras[0].camera;
        let nextChange = 0;
        let elementStartTick=0;
        let duration =this.cameras[0].duration;
        for (let tick = 0; tick < this.totalDuration; tick++) {
            await new Promise<void>((resolve,_)=>system.run(resolve));
            if (tick=== nextChange) {
                this.goToCamera(nextElement);
                camera = this.cameras[nextElement].camera;
                let duration = this.cameras[nextElement].duration;
                nextChange = tick + duration; 
                nextElement++;                
                elementStartTick=tick;
                
                continue;
            }
            let t = (tick - elementStartTick)/duration;
            world.sendMessage(t.toFixed(3));
            this.applyState(camera.player,camera.getState(t), true);
        }
        await new Promise<void>((resolve,_)=>system.runTimeout(resolve, 50));
        for (let player of this.players) {
            player.camera.clear();
        }
        
    }

    private goToCamera(idx:number) {
        let camera = this.cameras[idx].camera;
        this.applyState(camera.player,camera.getState(0), false);
    }
    private applyState(player:Player,transform:SceneCameraTransform, ease:boolean) {
        let cameraTransform = transform.transformation;
        if (ease) {
            cameraTransform.easeOptions = {
                easeTime:0.1,
                easeType: EasingType.Linear
            }
        }
        player.camera.setCamera(transform.cameraPreset, cameraTransform);
    }
}