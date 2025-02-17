import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import { Provider } from "react-redux";
import { createStore } from "redux";
import Reducer from "./store/reducer";
import { AUTHORIZATION_HEADER } from "./utils/localStorageKeys";
import axios from "axios";

axios.defaults.headers["Authorization"] =
  localStorage.getItem(AUTHORIZATION_HEADER);

const store = createStore(Reducer);

console.log(process.env.REACT_APP_DOMAIN);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
