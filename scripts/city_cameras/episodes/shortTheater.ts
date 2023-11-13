import { CameraDirector } from "../Director";
import { getOrbitCamera, getOrbitYCamera } from "../camera/orbitCamera";
import { StaticCamera } from "../camera/staticCamera";
import { Kishtarn } from "../citycrafter";
import { CVector } from "../vector";
import * as ease from "../Easing/easingFunctions"
import { PathCamera } from "../camera/pathCcamera";
import { LinearPath } from "../paths/linearPath";
import { Orbit, OrbitData } from "../paths/orbitSphere";

const startPosition = new CVector(3903, -15.00, 5908);
const fanOutTime = 3.5*20;
const beforeOrbitPause=4*20;
const orbitCenter =new CVector(3821.0, -15.00, 5908);
const orbitStart = new CVector(3938, 15.00, 5908);
const orbitTime= 7*20;

function fanOutScene(director:CameraDirector) {
    const linearPath = new LinearPath(startPosition, orbitStart);
    director.addCamera({
        duration:fanOutTime,
        camera: new PathCamera(
            Kishtarn(),
            linearPath.getPosition.bind(linearPath),
            (_)=>orbitCenter,
            ease.easeInOutQuad
            
        )
    })
}

function orbitScene (director:CameraDirector) {
    const orbitData={
        center:orbitCenter,
        radius:orbitStart.sub(orbitCenter),
        arcLength:-Math.PI/2*1.5
    };
    director.addCamera({
        duration:orbitTime,
        camera:getOrbitCamera(
            Kishtarn(), 
            orbitData,
            ease.easeInQuad,
        )
    });

    const UpPos = new Orbit(orbitData).getPosition(1);
    const YOrbitData:OrbitData = {
        center:orbitCenter,
        radius: UpPos.sub(orbitCenter),
        arcLength:-Math.PI/3
    };
    director.addCamera({
        duration:20*1,
        camera:"pause"
    });
    director.addCamera({
        duration:3*20,
        camera:getOrbitYCamera(
            Kishtarn(),
            YOrbitData,            
            ease.easeInQuad,
        )
    });
}

export function buildTheaterSHort(director:CameraDirector) {
    fanOutScene(director);
    director.addCamera({
        duration:beforeOrbitPause,
        camera:"pause"
    })
    orbitScene(director);
    
    director.AddClear(Kishtarn())
}