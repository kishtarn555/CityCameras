import { Camera, Player, system, world } from "@minecraft/server";
import { CameraDirector } from "./Director";
import { StaticCamera } from "./camera/staticCamera";
import { CVector } from "./vector";
import { FpsCamera } from "./camera/fpsCamera";
import { getOrbitCamera } from "./camera/orbitCamera";
import * as ease from "./Easing/easingFunctions";
import { buildTheaterSHort } from "./episodes/shortTheater";


const director:CameraDirector = new CameraDirector();
const GamertagKishtan="kishtarn";

export function Kishtarn():Player {
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



export function CityCrafter() {
    RegisterRunCommand();
    buildTheaterSHort(director);


}