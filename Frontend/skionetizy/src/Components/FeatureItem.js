import React from "react";
import style from "./featureItem.module.css"

export default function FeatureItem(props) {
    // props are {name: string, image: ReactComponent|string}
    return (
        <div className={style["item__holder"]}>
            <div><center>{props.name}</center></div>
            <div ><img style={{height:"200px", width:"200px"}}src={props.image} alt={"Img Not Available"}/></div>
        </div>
    )
}