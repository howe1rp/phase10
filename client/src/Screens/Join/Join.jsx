import React, { useState } from "react";
import Button from "../../Components/Button/Button";
import styles from "./Join.module.css";
import genStyles from "../../styles.module.css";

const Join = (props) => {
  const [player, setPlayer] = useState("");

  const addPlayer = (event) => {
    event.preventDefault();
    props.handleAddPlayer(player);
    setPlayer("");
  };

  return (
    <div className={styles["join-container"]}>
      <div className={genStyles.wrapper}>
        <form onSubmit={addPlayer}>
          <input
            className={styles["player-name"]}
            type="text"
            placeholder="Enter your name..."
            value={player}
            onChange={(e) => setPlayer(e.target.value)}
          />
          <Button className={styles["create-room-btn"]}>Join Game</Button>
        </form>
      </div>
    </div>
  );
};

export default Join;
