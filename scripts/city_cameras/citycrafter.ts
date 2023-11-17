import { Camera, system } from "@minecraft/server";
import { StaticCamera } from "./camera/staticCamera";
import { CVector } from "./vector";
import { FpsCamera } from "./camera/fpsCamera";
import { getOrbitCamera } from "./camera/orbitCamera";
import * as ease from "./Easing/easingFunctions";
import { buildTheaterSHort } from "./episodes/shortTheater/shortTheater";
import { buildTheaterShortIndoors } from "./episodes/shortTheater/shortTheater2";
import { buildTheaterShortTheaterRoom } from "./episodes/shortTheater/shortTheater3";
import { director } from "./citycrafter_const";


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
    buildTheaterShortTheaterRoom(director);


}