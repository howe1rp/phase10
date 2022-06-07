import Rules from "../../Components/Rules/Rules";
import styles from "./Lobby.module.css";
import genStyles from "../../styles.module.css";
import cx from "classnames";
import LobbyPlayer from "../../Components/LobbyPlayer/LobbyPlayer";

const Lobby = (props) => {
  return (
    <>
      <div className={styles["lobby-container"]}>
        <div className={cx(genStyles.wrapper, styles["lobby-settings"])}>
          <div className={styles.title}>Lobby</div>
          <Rules isAdmin={props.isAdmin} socket={props.socket} />
        </div>
        <div className={styles["lobby-players-section"]}>
          <div className={styles.title}>Players</div>
          <div className={styles["lobby-players-container"]}>
            {props.players.map((player) => (
              <LobbyPlayer key={player.name} name={player.name} />
            ))}
          </div>
        </div>
      </div>
      <div className={styles["join-link-container"]}>
        <div className={cx(genStyles.wrapper, styles["no-grow-wrapper"])}>
          <div className={styles.title}>Invite Link</div>
          <a
            href={`${window.location.href}${props.room}`}
          >{`${window.location.href}${props.room}`}</a>
        </div>
      </div>
    </>
  );
};

export default Lobby;
