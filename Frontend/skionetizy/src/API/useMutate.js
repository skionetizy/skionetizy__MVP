import { useCallback, useState } from "react";
import noop from "../utils/noop";
import * as yup from "yup";
import getYupErrors from "../utils/getYupErrors";

/**
 *
 * @param {{
 *  validationSchema: yup.ObjectSchema
 * }} param0
 * @returns
 */
function useMutate({ mutateFn, onSuccess = noop, onFailure = noop } = {}) {
  const [status, setStatus] = useState("idle");
  const [errors, setErrors] = useState({});

  const mutate = async (data) => {
    try {
      setStatus("loading");
      setErrors({});

      const resData = await mutateFn(data);
      await onSuccess(resData);
      setStatus("success");
    } catch (error) {
      setStatus("error");
      let derivedErrors = {};
      console.log(error);

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

      console.log(errors);
      setErrors(derivedErrors);
      await onFailure(derivedErrors);
    }
  };

  return {
    mutate,
    status,
    errors,
    isLoading: status === "loading",
    isError: status === "error",
    isSuccess: status === "success",
  };
}

export default useMutate;
