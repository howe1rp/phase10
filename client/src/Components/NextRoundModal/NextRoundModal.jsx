import styles from "./NextRoundModal.module.css";
import Modal from "../Modal/Modal";
import Button from "../Button/Button";

const NextRoundModal = (props) => {
  return (
    <Modal onClose={props.onClose}>
      <div className={styles.dialog}>
        <span className={styles.text}>Start next round?</span>
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

export default NextRoundModal;
