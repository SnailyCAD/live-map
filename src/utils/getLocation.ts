import { getArea } from "./getArea";
import { getZone } from "./getZone";

export function getLocation(pos: [number, number, number]) {
  const [lastStreet] = GetStreetNameAtCoord(...pos);
  const streetName = GetStreetNameFromHashKey(lastStreet);
  const zone = getZone(pos);
  const area = getArea(pos);
  const location = `${streetName}, ${zone} (${area})`;

  return location;
}
