import styles from "./EndRoundModal.module.css";
import Modal from "../Modal/Modal";
import Button from "../Button/Button";

const EndRoundModal = (props) => {
  return (
    <Modal onClose={props.onClose}>
      <div className={styles.dialog}>
        <span className={styles.text}>End Round?</span>
        <div className={styles.buttons}>
          <Button className={styles["button-alt"]} onClick={props.onClose}>
            Cancel
          </Button>
          <Button onClick={props.onOk}>OK</Button>
        </div>
      </div>
    </Modal>
  );
};

export default EndRoundModal;
