import { CameraDirector } from "../../Director";
import { getOrbitCamera, getOrbitFreeCamera, getOrbitYCamera } from "../../camera/orbitCamera";
import { StaticCamera } from "../../camera/staticCamera";
import { Kishtarn } from "../../citycrafter_const";
import { CVector } from "../../vector";
import * as ease from "../../Easing/easingFunctions"
import { PathCamera } from "../../camera/pathCcamera";
import { LinearPath } from "../../paths/linearPath";
import { Orbit, OrbitData } from "../../paths/orbitSphere";
import { EaseComposer, EaseComposerSegment } from "../../Easing/easeComposer";
import { easeLerp, lerp } from "../../paths/lerp";
import { FreeOrbitData, OrbitFree } from "../../paths/freeOrbit";
import { Player } from "@minecraft/server";


const timeline: [string, number][] = [
    ["panToDoor", 20.5*20],
    ["panToStairs", 21.8*20],
    ["lobbyPan", 22.0*20],
    ["talkAboutLobby", 23.0*20],
    ["goToSide1", 26.4*20],
    ["pan", 30.3*20],
    ["END",38.2*20],
];

type TimelineKey = typeof timeline[number][0];

function getDuration(key: TimelineKey): number  {
    const index = timeline.findIndex(entry => entry[0].toLowerCase() === key.toLowerCase());

    if (index !== -1 && index < timeline.length - 1) {
        const currentTimestamp = timeline[index][1];
        const nextTimestamp = timeline[index + 1][1];

        return nextTimestamp - currentTimestamp;
    }

    throw new Error("Not in timeline");
}

function getDurationFromTo(fromKey:TimelineKey, toKey:TimelineKey):number {
    const start = timeline.findIndex(entry => entry[0].toLowerCase() === fromKey.toLowerCase());
    const end = timeline.findIndex(entry => entry[0].toLowerCase() === toKey.toLowerCase());

    return timeline[end][1]-timeline[start][1];

}

const startPoint = new CVector(3899, -20, 5907);
const doorTarget = new CVector(3886, -21, 5907);
const startLookAt = new CVector(3878, -21.5, 5907);
const startLookAt2 = new CVector(3878, -20, 5910);

const lobbyLookAt=new CVector(3868,-20,5922);
const lobbyGoTo = new CVector(3882, -19.10, 5898);

const sideLookAt1 = new CVector(3883, -23, 5945);

const sideGoTo2 = new CVector(3885, -19.64, 5935);
const sideLookAt2 = new CVector(3854, -22.5, 5939);

const sidePanTarget = new CVector(3832, -19, 5935.5);
const sidePanLookAt = new CVector(3878, -19.64, 5942);

function panToDoor(director:CameraDirector) {
    const path = new LinearPath(startPoint, doorTarget);
    const eyesPath = new LinearPath(startLookAt, startLookAt2);    

    const camera = new PathCamera(
        Kishtarn(),
        path.getPosition.bind(path),
        eyesPath.getPosition.bind(eyesPath),
        ease.easeInOutQuad
        
    );

    director.addCamera({
        duration:getDuration("panToDoor"),
        camera:camera
    });
}

function panInLobby(director:CameraDirector) {
    const path = new LinearPath(doorTarget, lobbyGoTo);
    const eyesPath = new LinearPath(startLookAt2, lobbyLookAt);
    const camera = new PathCamera(
        Kishtarn(),
        path.getPosition.bind(path),
        eyesPath.getPosition.bind(eyesPath),
        ease.easeInCubic
        
    );

    director.addCamera({
        duration:getDuration("lobbyPan"),
        camera:camera
    });
}

function talkAboutLobby(director:CameraDirector) {
    director.addCamera({
        duration:getDuration("talkAboutLobby"),
        camera:"pause"
    })
}

function goToSide(director:CameraDirector) {
    const path = new LinearPath(lobbyGoTo, sideGoTo2);
    const eyesPath = new LinearPath(lobbyLookAt, sideLookAt1);    
    const eyesPath2 = new LinearPath(sideLookAt1, sideLookAt2);

    const camera = new PathCamera(
        Kishtarn(),
        path.getPosition.bind(path),
        (t)=>CVector.lerp(eyesPath.getPosition(t),eyesPath2.getPosition(t),ease.easeInCubic(t)  ),
        ease.easeInOutCubic
        
    );

    director.addCamera({
        duration:getDuration("goToSide1"),
        camera:camera
    });

}

function panSide(director:CameraDirector) {
    
    const delta = sideLookAt2.sub(sideGoTo2);
    
    const delta2 = sidePanLookAt.sub(sideGoTo2);
    const path = new LinearPath(sideGoTo2, sidePanTarget);

    const camera = new PathCamera (
        Kishtarn(),
        path.getPosition.bind(path),
        (t)=>path.getPosition(t).add( CVector.lerp(delta, delta2, Math.pow(t,1/2))   ),
        ease.easeInOutCubic
    )
    director.addCamera({
        duration:getDuration("pan"),
        camera:camera
    })
}

export function buildTheaterShortIndoors(director:CameraDirector) {
    panToDoor(director);
    panInLobby(director);
    talkAboutLobby(director);
    goToSide(director);
    panSide(director);
    director.AddClear(Kishtarn())
}