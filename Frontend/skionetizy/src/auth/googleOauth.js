import axios from "axios";
import * as GOOGLE from "./googleAuthCred";

export function createAuthURL(redirectURL) {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: redirectURL,
    client_id: GOOGLE.clientID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };

  return rootUrl + "?" + new URLSearchParams(options).toString();
}

export function getTokens({ code, redirectUri }) {
  const url = "https://oauth2.googleapis.com/token";

  const values = {
    code,
    client_id: GOOGLE.clientID,
    client_secret: GOOGLE.clientSecret,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  };

  return axios
    .post(url, new URLSearchParams(values).toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      throw new Error(error.message);
    });
}
