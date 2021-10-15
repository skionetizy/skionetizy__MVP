import React from "react";
import style from "./featureItem.module.css"

export default function FeatureItem(props) {
    // props are {name: string, image: ReactComponent|string}
    return (
        <div className={style["item__holder"]}>
            <div>{props.name}</div>
            <img src={props.image} alt={""} style={{width: "80%"}}/>
        </div>
    )
}