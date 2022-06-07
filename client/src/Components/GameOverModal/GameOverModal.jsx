import styles from "./GameOverModal.module.css";
import Modal from "../Modal/Modal";
import Button from "../Button/Button";
import GamePlayer from "../GamePlayer/GamePlayer";

const GameOverModal = (props) => {
  return (
    <Modal onClose={props.onClose}>
      <div className={styles.dialog}>
        <span className={styles.text}>Winner! 🎉 🎉 🎉</span>
        <div className={styles.player}>
          <GamePlayer
            className={styles.winner}
            name={props.player.name}
            currentPhase={props.player.currentPhase}
            score={props.player.score}
          />
        </div>
        <div className={styles.buttons}>
          <Button className={styles.button} onClick={props.onOk}>
            OK
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default GameOverModal;
