export enum Events {
  PlayerSpawned = "sna-live-map-player-spawned",
  ResourceStarted = "onResourceStart",
  AddPlayerData = "sna-live-map-add-player-data",
  UpdatePlayerData = "sna-live-map-update-player-data",
  RemovePlayer = "sna-live-map-remove-player",
}

export enum LegacyMapEvents {
  UpdatePlayerData = "playerData",
  RemovePlayer = "playerLeft",
}
