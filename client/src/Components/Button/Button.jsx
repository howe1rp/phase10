import cx from "classnames";
import styles from "./Button.module.css";

const Button = (props) => {
  const classNames = cx(styles.btn, props.className);

  return (
    <button {...props} className={classNames}>
      {props.children}
    </button>
  );
};

export default Button;
