import React, { useState } from "react";
import EndRoundModal from "../../Components/EndRoundModal/EndRoundModal";
import NextRoundModal from "../../Components/NextRoundModal/NextRoundModal";
import GamePlayer from "../../Components/GamePlayer/GamePlayer";
import PlayerDetailsModal from "../../Components/PlayerDetailsModal/PlayerDetailsModal";
import Button from "../../Components/Button/Button";
import RoundSummaryModal from "../../Components/RoundSummaryModal/RoundSummaryModal";
import styles from "./Game.module.css";
import GameOverModal from "../../Components/GameOverModal/GameOverModal";

const Game = (props) => {
  const [shouldShowEndRoundBtn, setShouldShowEndRoundBtn] = useState(false);
  const [shouldShowEndRoundModal, setShouldShowEndRoundModal] = useState(false);

  const [shouldShowNextRoundBtn, setShouldShowNextRoundBtn] = useState(true);
  const [shouldShowNextRoundModal, setShouldShowNextRoundModal] =
    useState(false);

  const [shouldShowRoundSummaryModal, setShouldShowRoundSumaryModal] =
    useState(false);

  const [shouldShowGameOverBtn, setShouldShowGameOverBtn] = useState(true);
  const [shouldShowGameOverModal, setShouldShowGameOverModal] = useState(false);

  const [shouldShowPlayerDetails, setShouldShowPlayerDetails] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState();

  const [winner, setWinner] = useState();

  const showEndRound = () => {
    setShouldShowEndRoundModal(true);
  };

  const hideEndRound = () => {
    setShouldShowEndRoundModal(false);
  };

  const showNextRound = () => {
    setShouldShowNextRoundModal(true);
  };

  const hideNextRound = () => {
    setShouldShowNextRoundModal(false);
  };

  const hideGameOver = () => {
    setShouldShowGameOverModal(false);
  };

  const showPlayerDetails = (player) => {
    setSelectedPlayer(player);
    console.log(player);
    setShouldShowPlayerDetails(true);
  };

  const hidePlayerDetails = () => {
    setShouldShowPlayerDetails(false);
  };

  const handleStartNewRound = () => {
    hideNextRound();
    setShouldShowNextRoundBtn(false);
    setShouldShowEndRoundBtn(true);
    setShouldShowGameOverBtn(false);

    props.socket.emit("startNewRoundClient", { socket: props.socket.id });
  };

  props.socket.on("startNewRoundServer", () => {
    hideNextRound();
    setShouldShowNextRoundBtn(false);
    setShouldShowEndRoundBtn(true);
    setShouldShowGameOverBtn(false);
  });

  const handleEndRound = () => {
    hideEndRound();
    setShouldShowEndRoundBtn(false);
    setShouldShowNextRoundBtn(true);
    setShouldShowRoundSumaryModal(true);
    setShouldShowGameOverBtn(true);

    props.socket.emit("endRoundClient", { socket: props.socket.id });
  };

  props.socket.on("endRoundServer", () => {
    hideEndRound();
    setShouldShowEndRoundBtn(false);
    setShouldShowNextRoundBtn(true);
    setShouldShowRoundSumaryModal(true);
    setShouldShowGameOverBtn(true);
  });

  const handleCompletedRoundSummary = () => {
    setShouldShowRoundSumaryModal(false);
  };

  const handleEndGame = () => {
    props.socket.emit("endGameClient", { socket: props.socket.id });

    setShouldShowEndRoundBtn(false);
    setShouldShowNextRoundBtn(false);
    setShouldShowRoundSumaryModal(false);
    setShouldShowGameOverBtn(false);
  };

  props.socket.on("endGameServer", ({ player }) => {
    setWinner(player);
    setShouldShowEndRoundBtn(false);
    setShouldShowNextRoundBtn(false);
    setShouldShowRoundSumaryModal(false);
    setShouldShowGameOverModal(true);
  });

  return (
    <div className={styles.game}>
      <div className={styles.players}>
        {props.players.map((player) => (
          <GamePlayer
            key={player.name}
            name={player.name}
            currentPhase={player.currentPhase}
            score={player.score}
            onClick={() => showPlayerDetails(player)}
          />
        ))}
        {shouldShowPlayerDetails && (
          <PlayerDetailsModal
            player={selectedPlayer}
            onClose={hidePlayerDetails}
          />
        )}
      </div>
      <div className={styles.actions}>
        {/* END ROUND */}
        {shouldShowEndRoundBtn && (
          <Button className={styles["end-round-btn"]} onClick={showEndRound}>
            End Round
          </Button>
        )}
        {shouldShowEndRoundModal && (
          <EndRoundModal onOk={handleEndRound} onClose={hideEndRound} />
        )}

        {/* NEXT ROUND */}
        {shouldShowNextRoundBtn && (
          <Button onClick={showNextRound}>Start New Round</Button>
        )}
        {shouldShowNextRoundModal && (
          <NextRoundModal onOk={handleStartNewRound} onClose={hideNextRound} />
        )}

        {shouldShowRoundSummaryModal && (
          <RoundSummaryModal
            onOk={handleCompletedRoundSummary}
            socket={props.socket}
          />
        )}

        {/* END GAME */}
        {shouldShowGameOverBtn && (
          <Button className={styles["game-over-btn"]} onClick={handleEndGame}>
            End Game
          </Button>
        )}
        {shouldShowGameOverModal && (
          <GameOverModal
            onOk={hideGameOver}
            onClose={hideGameOver}
            player={winner}
          />
        )}
      </div>
    </div>
  );
};

export default Game;
