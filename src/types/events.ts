export enum Events {
  CFXResourceStarted = "onResourceStart",
  CFXPlayerDropped = "playerDropped",
  CFXPlayerSpawned = "playerSpawned",

  PlayerSpawned = "sna-live-map-player-spawned",
  AddPlayerData = "sna-live-map-add-player-data",
  UpdatePlayerData = "sna-live-map-update-player-data",
  RemovePlayer = "sna-live-map-remove-player",
}

export enum LegacyMapEvents {
  UpdatePlayerData = "playerData",
  RemovePlayer = "playerLeft",
}
