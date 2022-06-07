import { useState, useEffect } from "react";
import styles from "./LobbyPlayer.module.css";

const LobbyPlayer = (props) => {
  return (
    <div className={styles["lobby-player"]} key={props.name}>
      <img src="https://placeimg.com/80/80/animals" alt="animal" />
      <div className={styles["lobby-player-name"]}>{props.name}</div>
    </div>
  );
};

export default LobbyPlayer;
