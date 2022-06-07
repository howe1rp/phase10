import { useState, useEffect } from "react";
import styles from "./LobbyPlayer.module.css";

const LobbyPlayer = (props) => {
  const [avatar, setAvatar] = useState();
  useEffect(() => {
    setAvatar("https://placeimg.com/160/160/animals");
  }, []);

  return (
    <div className={styles["lobby-player"]} key={props.name}>
      {/* <img src="https://placeimg.com/80/80/animals" alt="cat" /> */}
      <img src={avatar} alt="cat" />
      <div className={styles["lobby-player-name"]}>{props.name}</div>
    </div>
  );
};

export default LobbyPlayer;
