import { EasingType, Player, system, world } from "@minecraft/server";
import { SceneCamera, SceneCameraTransform } from "./camera/sceneCamera";
interface ScriptElement {
    duration:number,
    camera:SceneCamera|"pause"
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

    Wait(seconds:number, unit:"seconds"|"ticks" = "seconds") {
        this.addCamera({
            camera:"pause",
            duration:seconds*(unit==="seconds"?20:1)
        })
    }

    async runScript() {
        try {
            if (this.cameras.length ===0) {
                
                return;
            }        
            this.goToCamera(0);
            await new Promise<void>((resolve,_)=>system.runTimeout(resolve, 10));
            let nextElement = 0;
            let camera = this.cameras[0].camera;
            let nextChange = 0;
            let elementStartTick=0;
            let duration =this.cameras[0].duration;
            for (let tick = 0; tick < this.totalDuration; tick++) {
                await new Promise<void>((resolve,_)=>system.run(resolve));
                if (tick >= nextChange) {
                    this.goToCamera(nextElement);
                    camera = this.cameras[nextElement].camera;
                    duration = this.cameras[nextElement].duration;
                    elementStartTick=nextChange;
                    nextChange = nextChange + duration; 
                    nextElement++;                
                    
                    continue;
                }
                if (camera==="pause") continue;
                let t = (tick - elementStartTick)/(duration-1);
                t=Math.min(t,1);
                t=Math.max(t,0);
                // world.sendMessage(t.toFixed(3));
                this.applyState(camera.player,camera.getState(t), true);
            }
            await new Promise<void>((resolve,_)=>system.runTimeout(resolve, 10));
            for (let player of this.players) {
                player.camera.clear();
            }
        } catch(error) {
            console.error((error as Error).stack)
        }
        
    }

    private goToCamera(idx:number) {
        let camera = this.cameras[idx].camera;
        if (camera==="pause") return;
        this.applyState(camera.player,camera.getState(0), true);
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