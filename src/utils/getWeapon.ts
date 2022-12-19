import { getWeaponNameFromHash } from "./getWeaponNameFromHash";

export function getWeapon(pedId: number) {
  const weaponHash = GetSelectedPedWeapon(pedId);
  const hash = getWeaponNameFromHash(weaponHash);

  return hash;
}
