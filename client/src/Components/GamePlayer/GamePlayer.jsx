import styles from "./GamePlayer.module.css";

const GamePlayer = (props) => {
  return (
    <div className={styles.player} key={props.name} onClick={props.onClick}>
      <img src="https://placekitten.com/256/256" alt="cat" />
      <div className={styles.name}>{props.name}</div>
      <div className={styles.score}>{props.score}pts</div>
      <div className={styles.phase}>Phase: {props.currentPhase}</div>
    </div>
  );
};

export default GamePlayer;
