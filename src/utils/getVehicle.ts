export function getVehicle(pedId: number) {
  const vehicle = GetVehiclePedIsIn(pedId, false);

  if (vehicle === 0) {
    return {};
  }

  const licensePlate = GetVehicleNumberPlateText(vehicle);
  const hasSirenEnabled = isSirenEnabled(vehicle);
  let vehicleName = GetLabelText(GetDisplayNameFromVehicleModel(GetEntityModel(vehicle)));

  if (vehicleName === "NULL") {
    vehicleName = GetDisplayNameFromVehicleModel(GetEntityModel(vehicle));
  }

  return { licensePlate, vehicle: vehicleName, hasSirenEnabled };
}

function isSirenEnabled(vehicle: number) {
  const sirenEnabledValue =
    IsVehicleSirenOn(vehicle) || IsVehicleSirenAudioOn(vehicle) || IsVehicleSirenSoundOn(vehicle);

  // it can also return a number (1 or 0)
  if (typeof sirenEnabledValue === "number") {
    return sirenEnabledValue === 1;
  }

  return sirenEnabledValue;
}
