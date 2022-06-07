import { useState } from "react";
import cx from "classnames";
import styles from "./RoundSummaryModal.module.css";
import Modal from "../Modal/Modal";
import Button from "../Button/Button";

const RoundSummaryModal = (props) => {
  const [completedPhase, setCompletedPhase] = useState("No");
  const [points, setPoints] = useState(0);

  const handleCompleteRoundSummary = (event) => {
    event.preventDefault();

    props.socket.emit("completedRoundClient", {
      socket: props.socket.id,
      completedPhase: completedPhase === "Yes",
      points: points,
    });

    props.onOk();
  };

  const handleUpdateCompletedPhase = (event) => {
    setCompletedPhase(event.target.value);
  };

  const handleUpdatePoints = (event) => {
    setPoints(+event.target.value);
  };

  return (
    <Modal onClose={props.onClose}>
      <form className={styles.summary} onSubmit={handleCompleteRoundSummary}>
        <div className={styles["form-group"]}>
          <p className={styles.label}>Did you complete your phase?</p>
          <div className={styles.options}>
            <div className={styles["option-group"]}>
              <input
                className={styles.option}
                type="radio"
                id="yes"
                name="option"
                value="Yes"
                checked={completedPhase === "Yes"}
                onChange={handleUpdateCompletedPhase}
              />
              <label htmlFor="yes">Yes</label>
            </div>
            <div className={styles["option-group"]}>
              <input
                className={styles.option}
                type="radio"
                id="no"
                name="option"
                value="No"
                checked={completedPhase === "No"}
                onChange={handleUpdateCompletedPhase}
              />
              <label htmlFor="no">No</label>
            </div>
          </div>
        </div>

        <div className={styles["form-group"]}>
          <div>
            <label className={styles.label} htmlFor="phase-set">
              How many points did you get stuck with?
            </label>
            <input
              className={cx(styles.option, styles.input)}
              type="text"
              id="points"
              name="points"
              placeholder="50"
              value={points}
              onChange={handleUpdatePoints}
            />
          </div>
        </div>
        <Button className={styles.btn} type="submit">
          OK
        </Button>
      </form>
    </Modal>
  );
};

export default RoundSummaryModal;
