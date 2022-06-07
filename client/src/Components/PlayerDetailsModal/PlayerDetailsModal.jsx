import Phases from "../Phases/Phases";
import Modal from "../Modal/Modal";
import styles from "./PlayerDetailsModal.module.css";

const PlayerDetailsModal = (props) => {
  return (
    <Modal onClose={props.onClose}>
      <div className={styles.player} key={props.player.name}>
        <div className={styles.details}>
          <div className={styles.avatar}>
            <img src="https://placekitten.com/224/224" alt="cat" />
          </div>
          <div>
            <div className={styles.name}>{props.player.name}</div>
            <div className={styles.score}>{props.player.score} points</div>
            <div className={styles.phase}>
              Phase: {props.player.currentPhase}
            </div>
          </div>
        </div>
        <fieldset className={styles["phases-container"]}>
          <legend className={styles.legend} align="center">
            Phases
          </legend>
          <Phases phases={props.player.phases} />
        </fieldset>
      </div>
    </Modal>
  );
};

export default PlayerDetailsModal;
