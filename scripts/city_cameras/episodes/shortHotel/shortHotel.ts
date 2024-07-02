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


const timeline: Timeline = [
    ["wait", 0*20],
    ["gaze", 1*20],
    ["ring", 3.9*20],
    ["END",4.2*20],
];

const lookUpLooby = new PathCamera(
    Kishtarn(),
    (_)=> new CVector(4369, -28+1.6, 4591),
    (t)=> new CVector(4369, -28+1.6, 4591).add(new CVector(0, Math.sin(Math.PI/180*lerp(20, 50, t) ), -1)) ,
    ease.easeInCubic
 )
 
const startCamera = new PathCamera(
    Kishtarn(),
    (_)=> lookUpLooby.position(0),   
    (_)=> lookUpLooby.lookAt(0),   
)
 const lookAtBell = new PathCamera(
     Kishtarn(),
     (t)=>  new CVector(4369, -28+1.6, 4591),
     (t)=> new CVector(4369, -28+1.6, 4591).add(new CVector(Math.sin(t*Math.PI/180*60), Math.sin((1-t)*Math.PI/180*50), -Math.cos(t*Math.PI/180*60))),
 
  )

function gazeLobby(director:CameraDirector) {
    // director.Wait(0.5);
    director.addCamera({
        duration: getDuration(timeline, "wait"),
        camera:startCamera
    })
    director.addCamera({
        duration:getDuration(timeline, "gaze"),
        camera:lookUpLooby,
        
    });
    director.addCamera({
        duration:getDuration(timeline, "ring"),
        camera:lookAtBell,
        
    });
    director.Wait(0.1);
}

export function buildHotelScene1(director:CameraDirector) {
    gazeLobby(director);
    director.Wait(1);
    director.AddClear(Kishtarn())
}