const areaHashes: Record<string, string> = {
  "2072609373": "Blaine County",
  "-289320599": "Los Santos",
};

export function getArea(position: [number, number, number]) {
  const areaHash = GetHashOfMapAreaAtCoords(...position);
  return areaHashes[areaHash];
}
