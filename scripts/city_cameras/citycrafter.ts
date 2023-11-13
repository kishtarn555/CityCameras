import { Player, system, world } from "@minecraft/server";
import { CameraDirector } from "./Director";
import { StaticCamera } from "./camera/staticCamera";
import { CVector } from "./vector";
import { FpsCamera } from "./camera/fpsCamera";


const director:CameraDirector = new CameraDirector();
const GamertagKishtan="kishtarn";

function Kishtarn():Player {
    return world.getPlayers({
        name:GamertagKishtan
    })[0]
}

function RegisterRunCommand() {
    system.afterEvents.scriptEventReceive.subscribe(arg=> {
        if (arg.id !== "cycm:run") return;
        director.runScript();
        
        
    },
    {
        namespaces:[
            "cycm"
        ]
    }
    )
}


//This is a function I'll be changing for City Crafter YT Channel
function BuildScript() {
    director.addCamera({ 
        camera:new StaticCamera(Kishtarn(), new CVector(3930,11,5905), new CVector(3889, 0, 5905)),
        duration:10        
    });
    director.AddClear(Kishtarn())
}


export function CityCrafter() {
    RegisterRunCommand();
    BuildScript();


}