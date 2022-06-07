import React, { useState } from "react";
import cx from "classnames";
import styles from "./Home.module.css";
import genStyles from "../../styles.module.css";
import Button from "../../Components/Button/Button";

const Home = (props) => {
  const [player, setPlayer] = useState("");

  const addPlayer = (event) => {
    event.preventDefault();
    props.handleAddPlayer(player);
    setPlayer("");
  };

  return (
    <div className={styles["home-container"]}>
      <div className={genStyles.wrapper}>
        <form onSubmit={addPlayer}>
          <input
            className={styles["player-name"]}
            type="text"
            placeholder="Enter your name..."
            value={player}
            onChange={(e) => setPlayer(e.target.value)}
          />
          <Button className={cx(styles.btn, styles["create-room-btn"])}>
            Create Game
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Home;
