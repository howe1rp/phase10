import { useState, useEffect } from "react";
import styles from "./LobbyPlayer.module.css";

const LobbyPlayer = (props) => {
  const [avatar, setAvatar] = useState();

  useEffect(() => {
    const getAvatarImg = async () => {
      fetch("https://placeimg.com/160/160/animals").then((data) =>
        setAvatar(data)
      );
    };

    getAvatarImg();
  }, []);

  return (
    <div className={styles["lobby-player"]} key={props.name}>
      {/* <img src="https://placeimg.com/80/80/animals" alt="cat" /> */}
      {avatar && <img src={avatar} alt="cat" />}
      <div className={styles["lobby-player-name"]}>{props.name}</div>
    </div>
  );
};

export default LobbyPlayer;
