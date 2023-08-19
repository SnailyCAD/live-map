import { Events, LegacyMapEvents } from "~/types/events";
import { Server } from "socket.io";
import { createServer } from "node:http";
import { getPlayerIds } from "~/utils/getPlayerIds";

const server = createServer();
const port = GetConvarInt("socket_port", 30121);
const io = new Server(server, {
  maxHttpBufferSize: 1e8,
  cors: { origin: "*" },
});

const playerData = new Map<string, any>();

io.on("connection", (socket) => {
  const smartSigns = exports.SmartSigns["SmartSigns:GetSigns"]?.();
  io.sockets.emit("sna-live-map:smart-signs", { smartSigns });

  socket.on("sna-live-map:update-smart-sign", (data) => {
    console.log(
      "[sna-live-map]",
      "Request received to update smart sign",
      data.id,
      data.defaultText,
    );

    emit("SmartSigns:updateSign", data.id, [
      data.defaultText.firstLine,
      data.defaultText.secondLine,
      data.defaultText.thirdLine,
    ]);
  });
});

on("SmartSigns:updateSignExternal", () => {
  const smartSigns = exports.SmartSigns["SmartSigns:GetSigns"]?.();
  io.sockets.emit("sna-live-map:smart-signs", { smartSigns });
});

onNet(Events.CFXResourceStarted, (name: string) => {
  const playerCount = GetNumPlayerIndices();

  if (name !== GetCurrentResourceName()) return;
  if (playerCount <= 0) return;

  io.sockets.emit("map-data", {
    type: LegacyMapEvents.UpdatePlayerData,
    payload: Array.from(playerData.values()),
  });

  const smartSigns = exports.SmartSigns["SmartSigns:GetSigns"]?.();
  io.sockets.emit("sna-live-map:smart-signs", { smartSigns });
});

onNet(Events.CFXPlayerDropped, () => {
  // @ts-expect-error - this is supported according to the docs.
  const playerName = GetPlayerName(source);
  playerData.delete(playerName);

  io.sockets.emit("map-data", {
    type: LegacyMapEvents.RemovePlayer,
    payload: playerName,
  });
});

onNet(Events.PlayerSpawned, (data: any) => {
  const identifiers = getPlayerIds(source);
  data.identifiers = identifiers;

  playerData.set(data.name, data);
});

setInterval(() => {
  setImmediate(() => {
    io.sockets.emit("map-data", {
      type: LegacyMapEvents.UpdatePlayerData,
      payload: Array.from(playerData.values()),
    });
  });
}, 500);

setInterval(() => {
  const smartSigns = exports.SmartSigns["SmartSigns:GetSigns"]?.();

  setImmediate(() => {
    io.sockets.emit("sna-live-map:smart-signs", { smartSigns });
  });
}, 60_000); // update every minute

server.listen(port, () => {
  console.log("Socket server listening on %s", port);
});
