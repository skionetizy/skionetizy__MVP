import axios from "axios";
import React, { useEffect } from "react";
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

  const verifyEmail = useMutate({
    mutateFn: () =>
      sendEmailVerification(token).then((res) => {
        console.log("24 emailverify,onsuccess", { res });
        if (res || res.status === 500) {
          // throw createFlaskError(res.message);
        }
      }),

    onSuccess: (res) => {
      const { profile, token } = res.data;
      console.log({ res })
      dispatch({
        type: AUTH.SAVE_PROFILE,
        payload: profile,
      });
      localStorage.setItem(AUTHORIZATION_HEADER, token);
      localStorage.setItem(LOGGED_IN_PROFILE_ID, profile.profileID);

      console.log("success", res);

      history.push("/");
    },

    onFailure: (res) => {
      console.log("46 emailverify onfail", { res });
      // if (res.flaskError === "User is now verified") {
      //   history.push("/");
      // }
    }
  });

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
