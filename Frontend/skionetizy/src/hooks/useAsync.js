import { useCallback, useReducer, useRef } from "react";

const defaultInitialState = { status: "idle", data: null, error: null };

function useAsync(initialState) {
  const initialStateRef = useRef({
    ...defaultInitialState,
    ...initialState,
  });
  const [{ status, data, error }, setState] = useReducer(
    (s, a) => ({ ...s, ...a }),
    initialStateRef.current
  );

  const run = useCallback((promise) => {
    if (!promise || !promise.then) {
      throw new Error(
        `The argument passed to useAsync().run must be a promise. Maybe a function that's passed isn't returning anything?`
      );
    }

    setState({ status: "pending" });
    return promise.then(
      (data) => {
        setState({ data, status: "resolved" });
        return data;
      },
      (error) => {
        setState({ status: "rejected", error });
        return error;
      }
    );
  }, []);

  return {
    isIdle: status === "idle",
    isLoading: status === "pending",
    isError: status === "rejected",
    isSuccess: status === "resolved",

    error,
    status,
    data,
    run,
  };
}

export default useAsync;
