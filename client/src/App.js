import { useState } from "react";
import { v4 as uuid4 } from "uuid";
import io from "socket.io-client";
import Home from "./Screens/Home/Home";
import Join from "./Screens/Join/Join";
import Lobby from "./Screens/Lobby/Lobby";
import "./App.css";
import Game from "./Screens/Game/Game";

const socket = io("http://phase-ten.herokuapp", { autoConnect: false });
function App() {
  const [players, setPlayers] = useState([]);
  const [join, setJoin] = useState(window.location.pathname !== "/");
  const [room, setRoom] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showHome, setShowHome] = useState(true);
  const [showLobby, setShowLobby] = useState(false);
  const [showGame, setShowGame] = useState(false);

  // a player has joined the game
  socket.on("roomPlayersChanged", ({ players }) => {
    setPlayers(players);
  });

  // a room has been created
  socket.on("createdRoom", (data) => {
    console.log(data);
    setJoin(false);
    setIsAdmin(true);
  });

  const handleAddPlayer = (player) => {
    console.log("Clicked Create Private Room");

    socket.connect();
    const roomId = uuid4();
    setRoom(roomId);
    socket.emit("createRoom", { room: roomId, playerName: player });
    setShowHome(false);
    setShowLobby(true);
  };

  const handleJoinPlayer = (playerName) => {
    console.log("Clicked Join Game");

    socket.connect();
    socket.emit("joinRoom", {
      room: window.location.pathname,
      playerName: playerName,
    });
    setShowHome(false);
    setJoin(false);
    setShowLobby(true);
  };

  socket.on("startGameServer", ({ players }) => {
    setPlayers(players);
    setShowLobby(false);
    setShowGame(true);
  });

  socket.on("completedRoundServer", ({ players }) => {
    setPlayers(players);
  });

  return (
    <>
      <header className="header">
        <a href="/">
          <img className="logo" src="logo.png" alt="Logo" />
        </a>
      </header>

      {join && <Join handleAddPlayer={handleJoinPlayer} />}
      {showHome && !join && <Home handleAddPlayer={handleAddPlayer} />}
      {showLobby && (
        <Lobby
          players={players}
          room={room}
          isAdmin={isAdmin}
          socket={socket}
        />
      )}
      {showGame && <Game players={players} socket={socket} />}
    </>
  );
}

/*
TODO:
- [x] General Modal component
- [x] Phase list component
  - [x] Completed phases should have a strikethrough
  - [x] Current phase should stand out
- [x] Game player component
  - [x] Should show the Avatar, name, points, and current phase
- [x] Main game screen
  - [x] Should show all players as GamePlayer components
  - [x] Clicking on a player shows the player details modal
  - [x] Should have a button to end the round
  - [x] Clicking on the end round button should show a confirmation modal/dialog
- [x] Player details component
  - [x] Should show the Avatar, name, points, and the player's Phase list component
- [x] Round summary modal component
  - [x] Ask if player completed their phase that round (radio buttons for yes/no)
  - [x] Ask how many points the player scored that round (input)
  - [x] Okay button
[x] End round modal component
[x] Start next round modal component
[x] Game over component
  - [x] Should show game player components
  - [x] Should show something indicating the winning player
[ ] Game logic
  - [x] When the admin clicks on `Start Game`, send selected settings from lobby and players
    - [x] BE should return an array of player objects including the name and their list of phases
    - [x] When FE receives data from BE, it should move all players into the game screen
  - [x] When the admin clicks on `Start New Round`, show the `End Round` button to all players and hide the `Start New Round` button
  - [x] When the admin clicks on `End Round`, send the `Round Summary` modal to all players
  - [x] When a user submits their data on the `Round Summary` modal, send the player object including the form responses
    - [x] BE should update the user's current phase and points
    - [x] When FE receives data from BE, it should have updated the players array and all GamePlayer instaces in the game should show updated phases and scores
  - [ ] When a user completes their final phase, the BE should send a "game over" message with the winning player's data
    - [ ] When FE receives data from BE, it should show the `Game Over` modal with the winning player's data
*/

export default App;
