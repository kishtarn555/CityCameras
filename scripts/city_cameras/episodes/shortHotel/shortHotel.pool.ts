import { CameraDirector } from "../../Director";
import { catmullCamera } from "../../camera/catmullCamera";
import { Kishtarn } from "../../citycrafter_const";
import { CVector } from "../../vector";
import * as ease from "../../Easing/easingFunctions"
import { CameraSetPosOptions } from "@minecraft/server";
import { LinearPath } from "../../paths/linearPath";
import { PathCamera } from "../../camera/pathCcamera";
import { OrbitFree } from "../../paths/freeOrbit";
import { Timeline, getDuration } from "../../timeline";
import { lerp } from "../../paths/lerp";
import { AngleCamera } from "../../camera/angleCamera";

function ts(s:number, f:number) {
    return s + f/60
}

const timeline: Timeline = [
    ["wait", ts(19,25)*20],
    ["totobo", ts(20,0)*20],
    ["gaze", ts(23,10)*20],
    ["down", ts(25,9)*20],
    ["look", ts(26,32)*20],
    ["END",ts(27,44)*20],
];

const rotate = new AngleCamera(
    Kishtarn(),
    (t)=>new CVector(4386.42, 94.81, 4569.09),
    (t)=>-30*Math.PI/180,
    (t)=>t*90*Math.PI/180,
    ease.easeInOutCubic
)


const down = new AngleCamera(
    Kishtarn(),
    (t)=>new CVector(4386.42-t*2, 94.81-t, 4569.09),
    (t)=>-(30+50*t)*Math.PI/180,
    (t)=>90*Math.PI/180,
    ease.easeInOutCubic
)

function gazePool(director:CameraDirector) {
    // director.Wait(0.5);
    director.addCamera({
        duration: getDuration(timeline, "wait"),
        camera:rotate.getFreezeFrame(0)
    })
    director.addCamera({
        duration:getDuration(timeline, "totobo"),
        camera:rotate,
        
    });
    
    director.Wait(getDuration(timeline,"gaze"), "ticks");
    director.addCamera({
        duration:getDuration(timeline, "down"),
        camera:down,
        
    });
    director.Wait(getDuration(timeline,"look"), "ticks");
}

export function buildHotelScene2(director:CameraDirector) {
    gazePool(director);
    director.Wait(1);
    director.AddClear(Kishtarn())
}