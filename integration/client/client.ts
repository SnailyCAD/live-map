import { Events } from "~/types/events";
import { getWeaponNameFromHash } from "~/utils/getWeaponNameFromHash";
import { getArea } from "~/utils/getArea";
import { getZone } from "~/utils/getZone";

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

  const vehicle = getVehicle();
  const weapon = getWeapon();
  const location = getLocation([playerX, playerY, playerZ]);

  emitNet(Events.PlayerSpawned, {
    playerId: PlayerId(),
    name: GetPlayerName(PlayerId()),
    location,
    pos: { x: playerX, y: playerY, z: playerZ },
    weapon,
    ...vehicle,
  });
}

function getLocation(pos: [number, number, number]) {
  const [lastStreet] = GetStreetNameAtCoord(...pos);
  const streetName = GetStreetNameFromHashKey(lastStreet);
  const zone = getZone(pos);
  const area = getArea(pos);
  const location = `${streetName}, ${zone} (${area})`;

  return location;
}

function getWeapon() {
  const weaponHash = GetSelectedPedWeapon(PlayerPedId());
  const hash = getWeaponNameFromHash(weaponHash);

  return hash;
}

function getVehicle() {
  const vehicle = GetVehiclePedIsIn(PlayerPedId(), false);

  if (vehicle === 0) {
    return {};
  }

  const licensePlate = GetVehicleNumberPlateText(vehicle);
  let vehicleName = GetLabelText(GetDisplayNameFromVehicleModel(GetEntityModel(vehicle)));

  if (vehicleName === "NULL") {
    vehicleName = GetDisplayNameFromVehicleModel(GetEntityModel(vehicle));
  }

  return { licensePlate, vehicle: vehicleName };
}
