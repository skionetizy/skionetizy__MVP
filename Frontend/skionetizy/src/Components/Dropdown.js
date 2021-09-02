import { style } from "@material-ui/system";
import React, { Children, cloneElement, useState } from "react";
import styles from "./Dropdown.module.css";

// variant
function Dropdown({ children }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className={styles.dropdown}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {Children.map(children, (child, idx) => {
        if (child.type == Body) {
          return cloneElement(child, { isVisible });
        } else {
          return child;
        }
      })}
    </div>
  );
}

function Body({ isVisible, align = "left", children }) {
  return isVisible ? (
    <div style={{ [align]: "0" }} className={styles.dropdownBody}>
      <div>{children}</div>
    </div>
  ) : null;
}

function Button({ children, ...props }) {
  return <span {...props}>{children}</span>;
}

Dropdown.Body = Body;
Dropdown.Button = Button;
export default Dropdown;
