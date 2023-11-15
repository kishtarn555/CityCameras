import { CameraDirector } from "../../Director";
import { getOrbitCamera, getOrbitFreeCamera, getOrbitYCamera } from "../../camera/orbitCamera";
import { StaticCamera } from "../../camera/staticCamera";
import { Kishtarn } from "../../citycrafter";
import { CVector } from "../../vector";
import * as ease from "../../Easing/easingFunctions"
import { PathCamera } from "../../camera/pathCcamera";
import { LinearPath } from "../../paths/linearPath";
import { Orbit, OrbitData } from "../../paths/orbitSphere";
import { EaseComposer, EaseComposerSegment } from "../../Easing/easeComposer";
import { easeLerp } from "../../paths/lerp";
import { FreeOrbitData, OrbitFree } from "../../paths/freeOrbit";


const timeline: [string, number][] = [
    ["fan1",0],
    ["fan2",2.5*20],
    ["phaseToGarden",7.6*20],
    ["talkAboutGarden",8.8*20],
    ["goToEntrances",9.5*20],
    ["talkAccessibility",9.9*20],
    ["goToGarage",11.7*20],
    ["talkAboutGarage",12.0*20],
    ["goToBack",13.3*20],
    ["talkAboutBack",14.0*20],
    ["goUp",15.7*20],
    ["talkAboutAngel",18*20],
    ["goDown",20.7*20],
    ["END",25*20]
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

//Start fanout
const startPosition = new CVector(3903, -15.00, 5908);
const fanOutTime = getDuration("fan1");
const beforeOrbitPause=getDuration("fan2");

//Horizontal orbit
const orbitCenter =new CVector(3821.0, -15.00, 5908);
const orbitStart = new CVector(3938, 15.00, 5908);
const orbitTime= getDurationFromTo("phaseToGarden","talkAboutBack") ;
const orbitArc = -Math.PI/2*1.9;
const orbitSegments: EaseComposerSegment[] = [
    // [0.6, 2.4, ease.easeInQuad], // Go to garden
    [getDuration("phaseToGarden"),      30, ease.easeInCubic], // Speak about garden p1
    [getDuration("talkAboutGarden"),    9, ease.easeLinear], // Speak about garden stop
    [getDuration("goToEntrances"),      28, ease.easeInCubic], // Go to lateral doors
    [getDuration("talkAccessibility"),  5, ease.easeLinear], // Speak about lateral doors
    [getDuration("goToGarage"),         18, ease.easeInCubic], // GO to garage
    [getDuration("talkAboutGarage"),    5, ease.easeLinear], // Talk about garage
    [getDuration("goToBack"),           25, ease.easeInCubic] // Talk about back
];
const orbitChangePause=getDuration("talkAboutBack");
//Vertical Orbit
const FreeOrbitDuration=getDuration("goUp");
const FreeOrbitDirection = new CVector(3821, 36, 5844);
const FreeOrbitArc = Math.PI*0.385;

const UpDownPause = getDuration("talkAboutAngel");
//Oribt wait
const DownOrbitDuration = getDuration("goDown");
const DownOrbitArc = Math.PI*0.5;

function fanOutScene(director:CameraDirector) {
    const linearPath = new LinearPath(startPosition, orbitStart.sub([0,5,0]));
    director.addCamera({
        duration:fanOutTime,
        camera: new PathCamera(
            Kishtarn(),
            linearPath.getPosition.bind(linearPath),
            (_)=>orbitCenter,
            ease.easeInQuad
            
        )
    });
    const secondLinearPath=new LinearPath( orbitStart.sub([0,5,0]), orbitStart);
    director.addCamera({
        duration:beforeOrbitPause,
        camera: new PathCamera(
            Kishtarn(),
            secondLinearPath.getPosition.bind(secondLinearPath),
            (_)=>orbitCenter,
            ease.easeOutQuad
            
        )
    })
}

function orbitScene (director:CameraDirector) {
    const orbitData={
        center:orbitCenter,
        radius:orbitStart.sub(orbitCenter),
        arcLength:orbitArc
    };
    const composer = new EaseComposer(orbitSegments);
    director.addCamera({
        duration:orbitTime,
        camera:getOrbitCamera(
            Kishtarn(), 
            orbitData,
            composer.get.bind(composer),
        )
    });

    
    director.addCamera({
        duration:orbitChangePause,
        camera:"pause"
    });
    freeOrbit(director, orbitData);
}



function freeOrbit(director:CameraDirector, orbitData:OrbitData) {
    const UpPos = new Orbit(orbitData).getPosition(1);
    const radius = UpPos.sub(orbitCenter);
    const freeOrbitTarget = FreeOrbitDirection.sub(orbitCenter).normalized().scale(radius.magnitude()).add(orbitCenter);
    const chord = freeOrbitTarget.sub(UpPos);
    const freeOrbitData:FreeOrbitData = {
        center:orbitCenter,
        radius: radius,
        arcLength:FreeOrbitArc,
        radialFunction:easeLerp(1, 0.8,  ease.easeLinear),
        chord:chord
    };
    const upCamera = getOrbitFreeCamera(
        Kishtarn(),
        freeOrbitData,
        ease.easeInOutCubic
        
    )
    director.addCamera({
        duration:FreeOrbitDuration,
        camera:upCamera
    });

    const endPos = new OrbitFree(freeOrbitData).getPosition(1);
    const secondRadius = endPos.sub(orbitCenter);
    const downTarget = startPosition.sub(orbitCenter).normalized().scale(secondRadius.magnitude()).add(orbitCenter);
    const downChord = downTarget.sub(endPos);
    const downOrbitData:FreeOrbitData = {
        center:orbitCenter,
        radius: secondRadius,
        arcLength:DownOrbitArc,
        chord:downChord
    };
    const downCamera = getOrbitFreeCamera(
        Kishtarn(),
        downOrbitData,
        ease.easeInOutCubic
        
    )
    director.addCamera({
        duration:UpDownPause,
        camera:"pause"
    });
    director.addCamera({
        duration:DownOrbitDuration,
        camera:downCamera
    });

}

export function buildTheaterSHort(director:CameraDirector) {
    fanOutScene(director);
    
    orbitScene(director);
    
    director.AddClear(Kishtarn())
}