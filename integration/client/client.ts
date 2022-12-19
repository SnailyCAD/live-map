import { Events } from "~/types/events";
import { getWeapon } from "~/utils/getWeapon";
import { getLocation } from "~/utils/getLocation";
import { getVehicle } from "~/utils/getVehicle";
import { getIcon } from "~/utils/getIcon";
import { randomUUID } from "node:crypto";

let firstSpawn = true;

onNet("playerSpawned", () => {
  if (firstSpawn) {
    emitPlayerData();
    firstSpawn = false;
  }
});

setInterval(() => {
  emitPlayerData();
}, 500);

function emitPlayerData() {
  const [playerX, playerY, playerZ] = GetEntityCoords(PlayerPedId(), false) as [
    number,
    number,
    number,
  ];

  const vehicle = getVehicle(PlayerPedId());
  const weapon = getWeapon(PlayerPedId());
  const location = getLocation([playerX, playerY, playerZ]);
  const icon = getIcon(PlayerPedId());

  emitNet(Events.PlayerSpawned, {
    playerId: randomUUID(),
    name: GetPlayerName(PlayerId()),
    location,
    pos: { x: playerX, y: playerY, z: playerZ },
    weapon,
    icon,
    ...vehicle,
  });
}
