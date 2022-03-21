import React, { useState, useEffect } from "react";
import { isAuthenticated } from "../utils/AuthorisationUtils";
import styles from "./contactUsPage.module.css";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { connect } from "react-redux";
import baseURL from "../utils/baseURL";
import * as yup from "yup";
import Spinner from "../Components/Spinner";
import VerifyEmailModal from "../Components/VerifyEmailModal";
import {
  REDIRECTED_FROM
} from "../utils/localStorageKeys";
import { PostOnContactAPIHandler } from "../API/contactAPIHandler";
import Vector1 from "../Assets/undraw_login_re_4vu2.png";
import Vector2 from "../Assets/undraw_authentication_re_svpt.svg";
import MessageIcon from "../Assets/Group 7101.png";
import PenIcon from "../Assets/Group 7209.png";
import Message from "../Assets/Message.png";
import ProfileIcon from "../Assets/Profile.png";
import Reaptcha from 'reaptcha';

const jwt = require("jsonwebtoken");

const ContactUsPage = (props) => {
  const profile = props.profile;
  const profileName = profile?.profileName;
  const token = props.jwt;

  var decode = jwt.decode(token);

  const emailId = decode?.emailID;

  const [contactdetails, setContactdetails] = useState({
    name: "",
    email: "",
    description: "",
    isSubmit: false,
  });

  const [emailID, setEmailID] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const [showModal, setShowModal] = useState("");

  const { name, description, email, isSubmit } = contactdetails;

  const handleChange = (name) => (event) => {
    setContactdetails({ ...contactdetails, [name]: event.target.value });
  };

  const submitDetails = (event) => {
    event.preventDefault();
    const data = {
      name: name,
      description: description,
      email: email,
    };
    const submitStatus = PostOnContactAPIHandler(data);
    if(submitStatus){
      setContactdetails({
        name: name,
        description: "",
        email: email,
        isSubmit: true,
      });
    }
    else{
      setContactdetails({ isSubmit: false });
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const url = `${baseURL}/signup`;
      await yup
        .string()
        .required("Email is required")
        .email("Enter a valid email address")
        .validate(emailID);

      setError("");
      const payload = {
        emailID: emailID,
        firstName: emailID.replace(/\./g, "_").split("@")[0],
        lastName: "",
        redirect_to: "/contact",
      };
      setIsLoading(true);
      const res = await axios.post(`${url}`, payload);
      if (res.data.statusCode === 500) {
        // throw createFlaskError(res.data.message);
        console.log("Error ->", res.data.message);
        setError(res.data.message);
        alert(res.data.message);
      } else {
        console.log("No error");
        setShowModal("VERIFY_EMAIL");
      }
      // onSignup(res.data, null);
      setIsLoading(false);
    } catch (error) {
      let errorMessage;
      if (error instanceof yup.ValidationError) {
        errorMessage = error.message;
      } else if (error.isFlaskError) {
        errorMessage = error.message;
      } else if (error.isAxiosError) {
        errorMessage = error?.response.data.message || "Server Error";
        console.log("Error ->", error?.response.data.message);
      }

      // expected message
      if (errorMessage) {
        // onSignup(null, errorMessage);
        setError(errorMessage);
      }
      setIsLoading(false);
    }
  };

  const redirecting = () => {
    localStorage.setItem(REDIRECTED_FROM, "/contact");
  }

  useEffect(() => {
    setContactdetails({ name: profileName, email: emailId });
  }, [profileName, emailId]);

  return !isAuthenticated() ? (
    <>
      <div className={styles.divContainer}>
        <div className={styles.leftContainer}>
          <p className={styles.whitecolor}>
            For support either login to this platform or enter your email to
              generate a token
          </p>
        {/* <div style={divContainer}>
          <p className={styles.whitecolor}>
            For support either login to this platform or enter your email to
            generate a token
          </p>
          <form>
            <label htmlFor="email" className={styles.fsize}>
              Email
            </label>
            <br />
          </form> */}
          {!!error && <p className={styles.error}>{error}</p>}
          {showModal === "VERIFY_EMAIL" && (
            <VerifyEmailModal
              onClose={() => {
                history.push("/login");
              }}
            />
          )}
          <div className={styles.commonStyleContainer}>
            {/* From contact page it is redirected to login page with a data stating the previous page */}
            <Link to='/login' onClick={redirecting} className={styles.loginForSupport}>
              <button className={styles.btnStyle}>Login for Support</button>
            </Link>
          </div>
          <div className={styles.divForOr}>
            <span className={styles.whitecolor}>Or</span>
          </div>

          <div className={styles.divForm}>
            <span className={styles.headStyle}>Enter your email id</span>
            <form className={styles.form} onSubmit={handleSubmit} method="POST">
              <div className={styles.formDiv}>
                <div className={styles.logoMessageDiv}>
                  <img className={styles.logoMessage} alt="" src={MessageIcon} />
                </div>
                <input
                  className={styles.input}
                  placeholder="abc@gmail.com"
                  name="emailID"
                  value={emailID}
                  onChange={(ev) => setEmailID(ev.target.value)}
                />
                <img className={styles.logoPen} alt="" src={PenIcon} />
              </div>
              <br/>
              <div className={styles.commonStyleContainer}>
                <button className={styles.btnStyle2}>
                  {isLoading ? <Spinner /> : <span>Send code</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Right side image */}
        <div className={styles.rightContainer1}>
          <img height="80%" alt="" src={Vector1} />
        </div>
        
      </div>
    </>
  ) : (
    <>
      <div className={styles.divContainer1}>
        <div className={styles.leftContainer}>
          {isSubmit && (
            <h1 style={{ color: "white" }}>
              Your Query is submitted, we will contact you soon.
            </h1>
          )}
          <form className={styles.descForm}>
            <label htmlFor="name" className={styles.require}>
              Name
            </label>
            <div className={styles.descDiv}>
              <img className={styles.logos} alt="" src={ProfileIcon} />
              <span className={styles.breaker}>|</span>
              <input
                type="text"
                className={styles.descFormInput}
                name="name"
                onChange={handleChange("name")}
                required="true"
                value={name}
              />
            </div>
            <br />
            <label htmlFor="email" className={styles.require}>
              Email
            </label>
            <br />
            <div className={styles.descDiv}>
              <img className={styles.logos} alt="" src={Message} />
              <span className={styles.breaker}>|</span>
              <input
                type="email"
                className={styles.descFormInput}
                name="email"
                onChange={handleChange("email")}
                required="true"
                value={email}
              />
            </div>
            <br />
            <label htmlFor="description">
              Description
            </label>
            <br />
            <div className={styles.descDivText}>
              <span className={styles.textBreaker}>|</span>
              <textarea
                className={styles.descFormInput}
                rows={8}
                name="description"
                onChange={handleChange("description")}
                value={description}
              ></textarea>
            </div>
            <br />
            <Reaptcha className={styles.captcha} sitekey="6LfIMeIeAAAAAJHcmGvf7oclsbRZpb-nBcxz0bKN" />
            <br />
            <button className={styles.btnStyle2} onClick={submitDetails}>
              Submit
            </button>
          </form>
        </div>
        {/* Right side image */}
        <div className={styles.rightContainer}>
          <img className={styles.img} alt="" src={Vector2} />
        </div>

      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    isLoginRedux: state.isLogin,
    profile: state.profile,
    jwt: state.jwtToken,
  };
};

export default connect(mapStateToProps)(ContactUsPage);
