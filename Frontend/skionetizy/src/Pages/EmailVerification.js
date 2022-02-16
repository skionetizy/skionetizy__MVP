import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import Button from "../Components/Button";
import Spinner from "../Components/Spinner";
import useAsync from "../hooks/useAsync";
import useMutate from "../hooks/useMutate";
import createFlaskError from "../utils/createFlaskError";
import { AUTH } from "../store/reducer";
import { useDispatch } from "react-redux";
import {
  AUTHORIZATION_HEADER,
  LOGGED_IN_PROFILE_ID,
} from "../utils/localStorageKeys";

export default function EmailVerification() {
  const { token } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();

  const [error, setError] = useState("")
  const [loading, setLoading] = useState("");
  const [success, setSuccess] = useState("")

  const verifyEmail = useMutate({
    mutateFn: () =>
      sendEmailVerification(token).then((res) => {
        console.log("24 emailverify,onsuccess", { res });

        return res;

        // if (!res) {
        //   throw createFlaskError(res.message);
        // }
      }),

    onSuccess: (res) => {

      console.log("line 35 Emailvarify", { res });

      if (res.status === 200) {
        const { profile, token } = res;
        console.log({ res })
        dispatch({
          type: AUTH.SAVE_PROFILE,
          payload: profile,
        });
        localStorage.setItem(AUTHORIZATION_HEADER, token);
        localStorage.setItem(LOGGED_IN_PROFILE_ID, profile.profileID);
        console.log("success", res);
        let params = new URLSearchParams(window.location.search)
        if (params.get('redirect_to')){
          history.push(params.get('redirect_to'));
        }
        else{
          history.push("/");
        }
      }
      else {
        alert(res.message)
      }
    },

    onFailure: (res) => {
      console.log("46 emailverify onfail", { res });
      alert("some thing went wrong");
    }
  });
  ;
  useEffect(() => {
    verifyEmail.mutate();
  }, []);

  return (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        minHeight: "80vh",
        color: "white",
      }}
    >
      <div className="center">
        {verifyEmail.isSuccess ? (
          <>
            <Spinner />
            <p>Verifed. Redirecting.</p>
          </>
        ) : verifyEmail.isError ? (
          <p>{verifyEmail.errors.flaskError}</p>
        ) : verifyEmail.isLoading ? (
          <>
            <Spinner />
            <p>Verifing Email.</p>
          </>
        ) : null}
      </div>
    </div>
  );
}

function sendEmailVerification(token) {
  return axios.patch(`/api/emailVerification/${token}`).then((res) => res.data);
}
