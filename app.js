const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { defaultPhases, twistedPhases } = require("./phases.json");

app.use(cors());

// const PORT = process.env.PORT || 3001;
const PORT = 3001;

const server = http.createServer(app);

/*
players.rooms[room] => all players in a room
players.players[socket.id] => specific player object for that socket
players.players[socket.id].room => the room the player is/was in
*/
const players = { rooms: {}, players: {} };

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const shuffleArray = (array) => {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // create a room for the game
  socket.on("createRoom", ({ room, playerName }) => {
    console.log(`User ${socket.id} created room: ${room}`);
    socket.join(room);

    const player = {
      socket: socket.id,
      name: playerName,
      isAdmin: true,
      room: room,
      currentPhase: 1,
      score: 0,
    };

    // the room is initialized with only the current player
    players.rooms[room] = [player];

    // the player's socket is associated with the player object
    players.players[socket.id] = player;

    // tell the FE that a room has been created
    socket.emit("createdRoom", `Created room: ${room}`);

    // update the players in the room
    io.to(room).emit("roomPlayersChanged", {
      user: socket.id,
      room: room,
      players: players.rooms[room],
    });
  });

  // a player wants to join the room
  socket.on("joinRoom", ({ room, playerName }) => {
    room = room.slice(1); // remove leading `/`

    if (room === "") {
      return;
    }

    if (io.sockets.adapter.rooms.has(room)) {
      socket.join(room);

      const newPlayer = {
        socket: socket.id,
        name: playerName,
        isAdmin: false,
        room: room,
        currentPhase: 1,
        score: 0,
      };

      // add the player to the room
      players.rooms[room] = [...players.rooms[room], newPlayer];

      // associated the player's socket to the player object
      players.players[socket.id] = newPlayer;

      io.to(room).emit("roomPlayersChanged", {
        user: socket.id,
        room: room,
        players: players.rooms[room],
      });
    }
  });

  // the admin updated the phase order setting
  socket.on("phaseSettingUpdatedClient", ({ socket, value }) => {
    // get the room the user is in
    const room = players.players[socket].room;

    // broadcast the updated value to the room
    io.to(room).emit("phaseSettingUpdatedServer", value);
  });

  // the admin updated the set of phases to use
  socket.on("phaseSetUpdatedClient", ({ socket, value }) => {
    // get the room the user is in
    const room = players.players[socket].room;

    // broadcast the updated value to the room
    io.to(room).emit("phaseSetUpdatedServer", value);
  });

  // the admin started the game
  socket.on("startGameClient", ({ socket, phaseSet, useSamePhaseOrder }) => {
    // get the room the user is in
    const room = players.players[socket].room;
    let phases;
    if (phaseSet === "Classic") {
      phases = JSON.parse(JSON.stringify(defaultPhases));
    } else if (phaseSet === "Twisted") {
      phases = JSON.parse(JSON.stringify(twistedPhases));
    } else {
      phases = shuffleArray([
        ...JSON.parse(JSON.stringify(defaultPhases)),
        ...JSON.parse(JSON.stringify(twistedPhases)),
      ]).slice(0, 10);
    }

    players.rooms[room].forEach((player) => {
      const playerPhases = useSamePhaseOrder ? phases : shuffleArray(phases);
      player.phases = playerPhases.map((phase) => {
        return { name: phase, completed: false };
      });
      player.phases[0].current = true;

      players.players[player.socket] = player;
    });

    io.to(room).emit("startGameServer", {
      user: socket.id,
      room: room,
      players: players.rooms[room],
    });
  });

  // a user has submitted their end of round summary
  socket.on("completedRoundClient", ({ socket, completedPhase, points }) => {
    // get the player
    const player = players.players[socket];

    player.score += points;
    if (completedPhase) {
      player.phases[player.currentPhase - 1].current = false;
      player.currentPhase += 1;
      player.phases[player.currentPhase - 1].current = true;
    }

    io.to(player.room).emit("completedRoundServer", {
      user: socket.id,
      room: player.room,
      players: players.rooms[player.room],
    });
  });

  // a new round is starting
  socket.on("startNewRoundClient", ({ socket }) => {
    // get the room the user is in
    const room = players.players[socket].room;

    io.to(room).emit("startNewRoundServer");
  });

  // a round is ending
  socket.on("endRoundClient", ({ socket }) => {
    // get the room the user is in
    const room = players.players[socket].room;

    io.to(room).emit("endRoundServer");
  });

  // the game is over
  socket.on("endGameClient", ({ socket }) => {
    // get the room the user is in
    const room = players.players[socket].room;

    // determine the winning player.
    // the winner is the player who has completed all 10 phases
    // if multiple players have completed 10 phases,
    // choose the player with the lowest score
    const potentialWinners = players.rooms[room].sort(
      (a, b) => b.completedPhase - a.completedPhase || a.score - b.score
    );

    const winner = potentialWinners[0];
    console.log(winner);

    io.to(room).emit("endGameServer", {
      player: winner,
    });
  });

  // a user has left the game
  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`);

    // get the player
    const player = players.players[socket.id];

    if (!player) {
      return;
    }

    // get the player's last room
    const lastRoom = player.room;

    // get all players in that room
    const playersInRoom = players.rooms[lastRoom];

    // remove the disconnected player from that room
    if (players.rooms[lastRoom]) {
      players.rooms[lastRoom] = players.rooms[lastRoom].filter(
        (p) => p.socket !== socket.id
      );
    }

    // kick everyone out of that room if the disconnected player was the admin
    if (player.isAdmin) {
      io.in(lastRoom).socketsLeave(lastRoom);

      // remove the now deleted room
      for (let playerInRoom of playersInRoom) {
        playerInRoom.room = "";
      }

      // delete the room
      delete players.rooms[lastRoom];
    } else {
      io.to(lastRoom).emit("roomPlayersChanged", {
        user: socket.id,
        room: lastRoom,
        players: players.rooms[lastRoom],
      });
    }

    // delete the player
    delete players.players[socket.id];
  });
});

console.log(PORT);
server.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON PORT: ${PORT}`);
});
