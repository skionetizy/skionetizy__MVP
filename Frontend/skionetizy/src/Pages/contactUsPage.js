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

const jwt = require("jsonwebtoken");

const btnStyle = { width: "16rem", height: "3.6rem" };
const divContainer = { width: "70%", margin: "auto", marginTop: "8rem" };

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
      <div style={divContainer}>
        <p className={styles.whitecolor}>
          For support either login to this platform or enter your email to
          generate a token
        </p>
        <form onSubmit={handleSubmit} method="POST">
          <label htmlFor="email" className={styles.fsize}>
            Email
          </label>
          <br />
          <input
            className={styles.input}
            placeholder="Enter Email ID"
            name="emailID"
            value={emailID}
            onChange={(ev) => setEmailID(ev.target.value)}
          />

          <button className={styles.btn}>
            {isLoading ? <Spinner /> : <span>Submit</span>}
          </button>
        </form>
        {!!error && <p className={styles.error}>{error}</p>}
        {showModal === "VERIFY_EMAIL" && (
          <VerifyEmailModal
            onClose={() => {
              history.push("/login");
            }}
          />
        )}
        <hr />
        {/* From contact page it is redirected to login page with a data stating the previous page */}
        <Link to='/login' onClick={redirecting}>
          <button style={btnStyle}>Login For Support</button>
        </Link>
      </div>
    </>
  ) : (
    <>
      <div style={divContainer}>
        {isSubmit && (
          <h1 style={{ color: "white" }}>
            Your Query is submitted, we will contact you soon.
          </h1>
        )}
        <form>
          <label htmlFor="name" className={styles.fsize}>
            Name
          </label>
          <br />
          <input
            type="text"
            className={styles.input}
            name="name"
            onChange={handleChange("name")}
            value={name}
          />
          <br />
          <label htmlFor="email" className={styles.fsize}>
            Email
          </label>
          <br />
          <input
            type="email"
            className={styles.input}
            name="email"
            onChange={handleChange("email")}
            value={email}
          />
          <br />
          <label htmlFor="description" className={styles.fsize}>
            Description
          </label>
          <br />
          <textarea
            className={styles.input}
            rows={8}
            name="description"
            onChange={handleChange("description")}
            value={description}
          ></textarea>
          <br />
          <button className={styles.btn1} onClick={submitDetails}>
            Submit
          </button>
        </form>
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
