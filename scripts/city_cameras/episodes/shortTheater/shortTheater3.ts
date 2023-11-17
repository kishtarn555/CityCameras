import { CameraDirector } from "../../Director";
import { catmullCamera } from "../../camera/catmullCamera";
import { Kishtarn } from "../../citycrafter_const";
import { CVector } from "../../vector";
import * as ease from "../../Easing/easingFunctions"
import { CameraSetPosOptions } from "@minecraft/server";
import { LinearPath } from "../../paths/linearPath";
import { PathCamera } from "../../camera/pathCcamera";
import { OrbitFree } from "../../paths/freeOrbit";


const timeline: [string, number][] = [
    ["goToRoom", 37.9*20],
    ["watchScenario", 45.4*20],
    ["lookDown", 45.8*20],
    ["talkOrchestra", 47.7*20],
    ["turnBack", 48.0*20],
    ["explain", 51.5*20],
    ["END",60*20],
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


const PathPoints:CVector[]=[
    new CVector(3882.92, -10.00+1.6, 5900),
    new CVector(3876.86, -12.00+1.6, 5902),
    new CVector(3863.78, -7.30+1.6, 5906.5),
    new CVector(3840.30, -7.30+1.6, 5906.5),
    new CVector(3825.31, -10.65+1.6, 5906.5),
    // new CVector(3814.39, -16.86+1.6, 5898.93),
    new CVector(3793.25, -20.16+1.6, 5906.36),
]

const goToRoomCamera = catmullCamera(Kishtarn(), PathPoints, ease.easeInOutQuad);

const orchestra = new CVector(3810.00, -18.65+1.6, 5906.60);
const orchestraLookAt = new CVector(3799.68, -24.85, 5906.60);

const turnBackTarget = new CVector(3799.08, -23.99+1.6, 5906.60);
const turnBackHelperPoint = new CVector(3808.98, -21.75, 5920.55);

function goToRoom(director:CameraDirector) {
    
    director.addCamera({
        duration:getDuration("goToRoom"),
        camera:goToRoomCamera
    });
    
    director.addCamera({
        duration:getDuration("watchScenario"),
        camera:"pause"
    });
}

function lookAtOrchestra(director:CameraDirector) {
    const startState = goToRoomCamera.getState(1).transformation as CameraSetPosOptions
    const startFacing = CVector.zero().add(startState.facingLocation);
    const startLocation = CVector.zero().add(startState.location!);
    
    const eyesPath = new LinearPath(startFacing, orchestraLookAt);
    const path = new LinearPath(startLocation, orchestra);

    const camera = new PathCamera(
        Kishtarn(),
        path.getPosition.bind(path),
        eyesPath.getPosition.bind(eyesPath),
        ease.easeInOutCubic
    );
    director.addCamera({
        duration:getDuration("lookDown"),
        camera:camera
    });
    director.addCamera({
        duration:getDuration("talkOrchestra"),
        camera:"pause"
    });
}


function lookBack(director:CameraDirector) {
    const eyePath = new OrbitFree({
        arcLength:Math.PI,
        center:orchestra,
        radius:orchestraLookAt.sub(orchestra),
        chord:turnBackHelperPoint.sub(orchestraLookAt)
    });

    const path = new LinearPath(orchestra, turnBackTarget);
    const camera = new PathCamera(
        Kishtarn(),
        path.getPosition.bind(path),
        eyePath.getPosition.bind(eyePath),
        ease.easeInOutQuad
    )

    director.addCamera({
        duration:getDuration("turnBack"),
        camera:camera
    });

    director.addCamera({
        duration:getDuration("explain"),
        camera:"pause"
    });
}

export function buildTheaterShortTheaterRoom(director:CameraDirector) {
    goToRoom(director);
    lookAtOrchestra(director);
    lookBack(director);
    director.AddClear(Kishtarn())
}