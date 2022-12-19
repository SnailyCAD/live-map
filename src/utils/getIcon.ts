export function getIcon(pedId: number) {
  if (!IsPedInAnyVehicle(pedId, false)) return 6;
  const vehicle = GetVehiclePedIsIn(pedId, false);
  if (vehicle === 0) {
    return 6;
  }

  const vehicleModel = GetEntityModel(vehicle);
  if (isPoliceVehicle(vehicle)) return 56;
  if (isTowTruck(vehicleModel)) return 68;
  if (IsThisModelAHeli(vehicleModel)) return 64;
  return 225;
}

function isPoliceVehicle(vehicle: number) {
  const vehicleClass = GetVehicleClass(vehicle);
  return vehicleClass === 18;
}

function isTowTruck(vehicleModel: number) {
  const hashes = [GetHashKey("towtruck"), GetHashKey("towtruck2")];
  return hashes.includes(vehicleModel);
}
