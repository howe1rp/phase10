import cx from "classnames";
import styles from "./Phases.module.css";

const Phases = (props) => {
  return (
    <ul className={styles.phases}>
      {props.phases.map((phase) => {
        const phaseNameClasses = cx(
          styles["phase-name"],
          { [styles["current-phase-name"]]: phase.current },
          { [styles["completed-phase-name"]]: phase.completed },
          {
            [styles["incomplete-phase-name"]]:
              !phase.completed && !phase.current,
          }
        );
        return (
          <li
            key={phase.name}
            className={cx(styles.phase, {
              [styles["current-phase"]]: phase.current,
            })}
          >
            <span className={phaseNameClasses}>{phase.name}</span>
          </li>
        );
      })}
    </ul>
  );
};

export default Phases;
