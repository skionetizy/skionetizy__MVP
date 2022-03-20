import React from "react";
import styles from "./Careers.module.css";
import { connect } from "react-redux";
import Vector from "../Assets/undraw_researching_re_fuod 1.png";

import SmartphoneIcon from "../Assets/smartphone 5.png";
import DateIcon from "../Assets/Group 7300.png";
import LocationIcon from "../Assets/Group 7311.png";
import MessageIcon from "../Assets/Message.png";
import ProfileIcon from "../Assets/Profile.png";

const Careers = (props) => {

  return (
    <>
    <div className={styles.divContainer}>
        <div className={styles.leftContainer}>
          <iframe
            title = "Careers"
            src="https://docs.google.com/forms/d/e/1FAIpQLSccQRh4Hozn6mHrbRsmz0qR97PJ-ZQRq_fknXyqoV4MUZLV7g/viewform?embedded=true"
            width="640"
            height="3422"
            frameborder="0"
            marginheight="0"
            marginwidth="0"
          >
            Loading…
          </iframe>
        </div>
        {/* Right side image */}
        <div className={styles.rightContainer}>
          <img className={styles.img} alt="" src={Vector} />
        </div>
      </div>
    </>
  )
};

const mapStateToProps = (state) => {
  return {
    isLoginRedux: state.isLogin,
    profile: state.profile,
    jwt: state.jwtToken,
  };
};

export default connect(mapStateToProps)(Careers);
