import { useState } from "react";
import * as yup from "yup";
import getYupErrors from "../utils/getYupErrors";
import noop from "../utils/noop";

function useMutate({ mutateFn, onSuccess = noop, onFailure = noop } = {}) {
  const [status, setStatus] = useState("idle");
  const [errors, setErrors] = useState({});

  const mutate = async (data) => {
    try {
      setStatus("loading");
      setErrors({});

      const resData = await mutateFn(data);

      setStatus("success");
      onSuccess(resData);
    } catch (error) {
      let derivedErrors = {};

      switch (true) {
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

        default:
          throw error;
      }

      setErrors(derivedErrors);
      setStatus("error");
      onFailure(derivedErrors);
    }
  };

  return {
    mutate,
    status,
    errors,
    isIdle: status === "idle",
    isLoading: status === "loading",
    isError: status === "error",
    isSuccess: status === "success",
  };
}

export default useMutate;
