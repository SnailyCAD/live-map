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

function getSmartSigns() {
  try {
    return exports.SmartSigns["SmartSigns:GetSigns"]?.();
  } catch {
    console.log(
      "[sna-live-map][DEBUG]",
      "Could not load SmartSigns signs. If you're not using SmartSigns, ignore this message.",
    );

    return [];
  }
}

function getSmartMotorwaySigns() {
  try {
    return exports.SmartMotorways["getSigns"]?.();
  } catch {
    console.log(
      "[sna-live-map][DEBUG]",
      "Could not load SmartMotorway signs. If you're not using SmartMotorways, ignore this message.",
    );

    return [];
  }
}

io.on("connection", (socket) => {
  const smartSigns = getSmartSigns();
  io.sockets.emit("sna-live-map:smart-signs", { smartSigns });

  socket.on("sna-live-map:update-smart-sign", (data) => {
    console.log(
      "[sna-live-map]",
      "Request received to update smart sign",
      data.id,
      data.defaultText,
    );

    emit("SmartSigns:apiUpdateSign", data.id, [
      data.defaultText.firstLine,
      data.defaultText.secondLine,
      data.defaultText.thirdLine,
    ]);
  });

  const smartMotorwaySigns = getSmartMotorwaySigns();
  io.sockets.emit("sna-live-map:smart-motorways-signs", { smartMotorwaySigns });

  socket.on("sna-live-map:update-smart-motorway-sign", (data) => {
    console.log("[sna-live-map]", "Request received to update Smart Motorway sign", data.id);

    emit("SmartMotorways:apiUpdateSign", data.id, data.speeds);
  });
});

on("SmartSigns:updateSignExternal", () => {
  const smartSigns = getSmartSigns();
  io.sockets.emit("sna-live-map:smart-signs", { smartSigns });
});

onNet(Events.SyncSmartMotorwaysSigns, () => {
  const smartMotorwaySigns = getSmartMotorwaySigns();
  io.sockets.emit("sna-live-map:smart-motorways-signs", { smartMotorwaySigns });
});

onNet(Events.CFXResourceStarted, (name: string) => {
  const playerCount = GetNumPlayerIndices();

  if (name !== GetCurrentResourceName()) return;
  if (playerCount <= 0) return;

  io.sockets.emit("map-data", {
    type: LegacyMapEvents.UpdatePlayerData,
    payload: Array.from(playerData.values()),
  });

  const smartSigns = getSmartSigns();
  io.sockets.emit("sna-live-map:smart-signs", { smartSigns });

  const smartMotorwaySigns = getSmartMotorwaySigns();
  io.sockets.emit("sna-live-map:smart-motorways-signs", { smartMotorwaySigns });
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

server.listen(port, () => {
  console.log("Socket server listening on %s", port);
});
