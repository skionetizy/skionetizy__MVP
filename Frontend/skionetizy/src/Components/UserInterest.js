import React, { useState } from "react";
import styles from "./UserInterest.module.css";
import { connect } from "react-redux";
import {
  profileInterest
} from "../API/profileAPIHandler";
import Entertainment from "../Assets/Entertainment.png";
import Travel from "../Assets/Travel.png";
import Food from "../Assets/Food.png";
import Gaming from "../Assets/Gaming.png";
import Literature from "../Assets/Literature.png";
import Health from "../Assets/Health.png";
import Technology from "../Assets/Technology.png";
import Culture from "../Assets/Culture.png";

function UserInterest(props) {
  var [ interests, setInterests ] = useState([]);
  const isLoggedIn = props.isLogin;

  const handleClick = (event) => {
    var id = event.currentTarget.parentElement.id;
    var ele = document.querySelector("[id='"+id+"']");
    ele = ele.lastChild;
    if(ele.nodeName === 'DIV'){
      document.getElementById(id).removeChild(ele);
      setInterests(interests.filter((value, index) => {
        var arr = [];
        if(value !== id){
          arr.append(value);
        }
        return arr;
      }))
    }
    else{
      if(interests.length < 3){
        setInterests((prev) => [ ...prev, id ]);
        document.getElementById(id).appendChild(createShade());
      }
    }
  }

  function createShade(){
    var div = document.createElement('div');
    div.classList.add(styles.shadow);
    div.onclick = handleClick;
    return div;
  }

  const handleSubmit = async() => {
    const data = {
      'interests': interests
    }
    console.log("Data is: ", data);
    await profileInterest(JSON.stringify(data));
  }

  return (
    (isLoggedIn && 
      <div className={styles.floatWindow}>
          <h1 className={styles.headingText}>Tell us what you're interested in..</h1>
          <span className={styles.categoryText}>Pick any three categories</span>
          <div className={styles.container}>
            <div className={styles.content} id="Entertainment">
              <img className={styles.interestImage} alt="Entertainment" src={Entertainment} onClick={handleClick}/>
              <p className={styles.contentText}>Entertainment</p>
            </div>
            <div className={styles.content} id="Travel">
              <img className={styles.interestImage} alt="Travel" src={Travel} onClick={handleClick}/>
              <p className={styles.contentText}>Travel</p>
            </div>
            <div className={styles.content} id="Food">
              <img className={styles.interestImage} alt="Food" src={Food} onClick={handleClick}/>
              <p className={styles.contentText}>Food</p>
            </div>
            <div className={styles.content} id="Gaming">
              <img className={styles.interestImage} alt="Gaming" src={Gaming} onClick={handleClick}/>
              <p className={styles.contentText}>Gaming</p>
            </div>
            <div className={styles.content} id="Literature">
              <img className={styles.interestImage} alt="Literature" src={Literature} onClick={handleClick}/>
              <p className={styles.contentText}>Literature</p>
            </div>
            <div className={styles.content} id="Health">
              <img className={styles.interestImage} alt="Health" src={Health} onClick={handleClick}/>
              <p className={styles.contentText}>Health</p>
            </div>
            <div className={styles.content} id="Technology">
              <img className={styles.interestImage} alt="Technology" src={Technology} onClick={handleClick}/>
              <p className={styles.contentText}>Technology</p>
            </div>
            <div className={styles.content} id="Culture">
              <img className={styles.interestImage} alt="Culture" src={Culture} onClick={handleClick}/>
              <p className={styles.contentText}>Culture</p>
            </div>
          </div>
          <button className={styles.btn} onClick={handleSubmit}>Next</button>
      </div>
    )
  );
}

const mapStateToProps = (state) => {
  return {
    isLogin: state.isLogin
  };
};

export default connect(mapStateToProps)(UserInterest);
