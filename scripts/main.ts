import { system } from "@minecraft/server";
import { Addon } from "./connectTogether";
import cityCameras from "./city_cameras/addon";

const addons:Addon[] = [cityCameras]


for (let addon of addons) {
  addon.awake();
}
for (let addon of addons) {
  addon.start();
}


function mainTick() {
  for (let addon of addons) {
    addon.tick();
  }
  system.run(mainTick)
}


system.run(mainTick);