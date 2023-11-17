import { Player, world } from "@minecraft/server";
import { CameraDirector } from "./Director";

export const director: CameraDirector = new CameraDirector();
const GamertagKishtan = "kishtarn";

export function Kishtarn(): Player {
    return world.getPlayers({
        name: GamertagKishtan
    })[0];
}
