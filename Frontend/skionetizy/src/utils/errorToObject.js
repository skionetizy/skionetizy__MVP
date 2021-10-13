import getYupErrors from "./getYupErrors";
import * as yup from "yup";

export default function errorToObject(error) {
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

    case error.isFlaskError: {
      derivedErrors = {
        flaskError: error.message || "Server Error",
      };
      break;
    }

    default:
      throw error;
  }

  derivedErrors.message = derivedErrors[Object.keys(derivedErrors)[0]];

  return derivedErrors;
}
