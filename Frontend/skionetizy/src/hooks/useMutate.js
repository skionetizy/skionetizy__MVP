import { useState } from "react";
import * as yup from "yup";
import getYupErrors from "../utils/getYupErrors";
import noop from "../utils/noop";

function useMutate({ mutateFn, onSuccess = noop, onFailure = noop } = {}) {

  const [status, setStatus] = useState("idle");
  const [errors, setErrors] = useState({});

  const mutate = async (data, event) => {
    if (event) event.preventDefault();

    try {
      setStatus("loading");
      setErrors({});

      const resData = await mutateFn(data);
      if (resData.status === 500) {
        setStatus("error")
        onFailure(resData);
      }
      else {
        setStatus("success");
        onSuccess(resData);
      }
    } catch (error) {
      let derivedErrors = {};

      switch (error) {
        case error instanceof yup.ValidationError: {
          derivedErrors = getYupErrors(error);
          break;
        }

        case error.isAxiosError: {
          derivedErrors = {
            flaskError: error?.response?.data?.Message || "Server Error",
          };
          break;
        }

        case error.isFlaskError: {
          derivedErrors = {
            flaskError: error.message || "Server Error",
          };
          break;
        }

        default: {
          throw error;
        }
      }

      setErrors(derivedErrors);
      setStatus("error");
      onFailure(derivedErrors);
    }
  };

  function reset() {
    setErrors({});
    setStatus("idle");
  }

  return {
    mutate,
    reset,
    status,
    errors,
    isIdle: status === "idle",
    isLoading: status === "loading",
    isError: status === "error",
    isSuccess: status === "success",
  };
}

export default useMutate;
