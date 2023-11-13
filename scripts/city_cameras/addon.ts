import { Addon } from "../connectTogether/index";
import { CityCrafter } from "./citycrafter";


class CityCamerasAddon extends Addon {
    awake(): void {
        CityCrafter();
    }
    start(): void {
        
    }
    tick(): void {
        
    }


}
const cityCameras = new CityCamerasAddon("cycms");
export default cityCameras;