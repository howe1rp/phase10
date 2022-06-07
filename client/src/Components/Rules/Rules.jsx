import React, { useState } from "react";
import styles from "./Rules.module.css";
import Button from "../Button/Button";

const Rules = (props) => {
  const [phaseSet, setPhaseSet] = useState("Classic");
  const [samePhase, setSamePhase] = useState("Yes");

  const handleUpdatePhaseSet = (event) => {
    setPhaseSet(event.target.value);
    props.socket.emit("phaseSetUpdatedClient", {
      socket: props.socket.id,
      value: event.target.value,
    });
  };

  props.socket.on("phaseSetUpdatedServer", (data) => {
    setPhaseSet(data);
  });

  const handleUpdatePhaseSetting = (event) => {
    setSamePhase(event.target.value);
    props.socket.emit("phaseSettingUpdatedClient", {
      socket: props.socket.id,
      value: event.target.value,
    });
  };

  props.socket.on("phaseSettingUpdatedServer", (data) => {
    setSamePhase(data);
  });

  const handleStartGame = (event) => {
    event.preventDefault();
    console.log("START GAME");
    props.socket.emit("startGameClient", {
      socket: props.socket.id,
      phaseSet: phaseSet,
      useSamePhaseOrder: samePhase === "Yes",
    });
  };

  return (
    <form onSubmit={handleStartGame}>
      <div className={styles["form-group"]}>
        <label className={styles["phase-label"]} htmlFor="phase-set">
          Phases
        </label>
        <select
          className={styles["phase-set"]}
          id="phase-set"
          name="phase-set"
          disabled={!props.isAdmin}
          value={phaseSet}
          onChange={handleUpdatePhaseSet}
        >
          <option>Classic</option>
          <option>Twisted</option>
          <option>Random</option>
        </select>
      </div>
      <div className={styles["form-group"]}>
        <p className={styles["phase-label"]}>
          Should everyone be on the same phase each round?
        </p>
        <div className={styles["phase-rule-options"]}>
          <div className={styles["phase-rule-group"]}>
            <input
              className={styles["phase-rule"]}
              type="radio"
              id="yes"
              name="phase-rule"
              value="Yes"
              checked={samePhase === "Yes"}
              onChange={handleUpdatePhaseSetting}
              disabled={!props.isAdmin}
            />
            <label htmlFor="yes">Yes</label>
          </div>
          <div className={styles["phase-rule-group"]}>
            <input
              className={styles["phase-rule"]}
              type="radio"
              id="no"
              name="phase-rule"
              value="No"
              checked={samePhase === "No"}
              onChange={handleUpdatePhaseSetting}
              disabled={!props.isAdmin}
            />
            <label htmlFor="no">No</label>
          </div>
        </div>
      </div>
      <Button>Start Game</Button>
    </form>
  );
};

export default Rules;
