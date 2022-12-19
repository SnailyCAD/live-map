export function getVehicle(pedId: number) {
  const vehicle = GetVehiclePedIsIn(pedId, false);

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
