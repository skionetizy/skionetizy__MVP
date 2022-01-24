import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import PasswordInput from "../Components/PasswordInput";
import styles from "./ForgotPassword.module.css";
import EmailEnvelopeImage from "../Assets/close_mail_envelope.png";
import ForgotPasswordSS from "../Assets/forgot_password.png";
import VerifyEmailModal from "../Components/VerifyEmailModal";
import useForm from "../hooks/useForm";
import { updatePassword, updatePasswordNow } from "../API/profileAPIHandler";
import Button from "../Components/Button";
import { useParams } from "react-router-dom";




function ForgotPassword() {
  const [showModal, setShowModal] = useState('');
  const [error, setError]= useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { data: details, handleChange } = useForm({
    emailID: "",
    password: "",
    confirmpassword: ""
  });

  const {token}=useParams();
  const storage_token=localStorage.getItem("temp_pass_forgot_auth");
  console.log(token,storage_token)

  async function handleEmailSubmit(e) {
    setIsLoading(true);
    e.preventDefault()
    if (details) {
      console.log('Details ->', details)
      const res=await updatePassword(details);
      console.log("res inside password update request-> ",res);
      if(res['data'].status!==200){
        setError(res.data.message);
      }
      else{
        console.log("Email sent!")
        setShowModal('VERFY_EMAIL')
        localStorage.removeItem("temp_pass_forgot_auth")
        // TODO: localstorage not uppdating.
        localStorage.setItem("temp_pass_forgot_auth", res.data.auth_token);
      }
      setIsLoading(false);
    }
  }

  async function handlePasswordSubmit(e) { 
    setIsLoading(true);
    e.preventDefault()
    // TODO: if condition.
    //if(token===storage_token){
      if(details){
        const res=await updatePasswordNow(details, token);
        console.log(res);
        setError(res.data.message);
      }
    //}
    /* else{
      setError("Something went wrong!");
    } */
    setIsLoading(false);
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Forgot Password</h1>

      <section className={styles.flex}>
        <div className={styles.imageFlexItem}>
          <img
            className={styles.heroImage}
            src={ForgotPasswordSS}
            alt="forgot password page screen shot with key pic on top "
          />
        </div>


        <div className={styles.formsFlexItem}>
          {token===undefined || token===null || storage_token==null? 
          <>
          <form className={styles.emailForm} onSubmit={handleEmailSubmit}  >
            <input className={styles.emailInput} type="email" onChange={handleChange} value={details.emailID} name="emailID" placeholder="Enter Email" />
            <Button
              className={styles.emailVerifyBtn}
              variant="dark"
              size="normal"
              isLoading={isLoading}
              type="submit"
            >
              Verify
            </Button>
          </form>
          <p className={styles.status}>{error}</p>
          </>
          //:
          // TODO: 
          /* token!==storage_token ? <p>"Something went wrong !"</p> */:
          <>
          <p className={styles.emailVerified}>
            <img
              src={EmailEnvelopeImage}
              className={styles.emailEnvelopeImg}
              alt="closed mail envelope"
            />
            Email Verified
          </p>

          <form className={styles.passwordForm} onSubmit={handlePasswordSubmit}>
            {/* <PasswordInput
              wrapperClassName={styles.input}
              placeholder="New Password"
            />
            <PasswordInput
              wrapperClassName={styles.input}
              placeholder="Confirm New Password"
            /> */}
            <input
              type="password"
              name="password"
              placeholder="New password"
              onChange={handleChange}
              value={details.password}
              className={styles.input}
              required
            /><br></br>
            <input
              type="password"
              name="confirmpassword"
              placeholder="Confirm password"
              onChange={handleChange}
              value={details.confirmPass}
              className={styles.input}
              required
            />
            <Button
              className={styles.loginBtn}
              variant="dark"
              size="normal"
              isLoading={isLoading}
              type="submit"
            >
              Login
              <FontAwesomeIcon icon={faSignInAlt} />
            </Button>
          </form>
          <p className={styles.status}>{error}</p>
        </>
        }
        </div>
        {
          showModal === 'VERFY_EMAIL' && (
            <VerifyEmailModal onClose={() => setShowModal('')} />
          )
        }
      </section>

    </main>
  );
}

export default ForgotPassword;
