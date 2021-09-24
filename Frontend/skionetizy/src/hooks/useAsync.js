import { useEffect, useState } from "react";

function useAsync(asyncFn, initialData, deps) {
  const [data, setData] = useState(initialData);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("idle");

  async function run() {
    setStatus("loading");
    try {
      const results = await asyncFn();

      // check if we got undefined
      if (results === undefined) return;

      setData(results);
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setError(error);
    }
  }

  useEffect(() => {
    if (deps != null) {
      run();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return {
    isIdle: status === "idle",
    isLoading: status === "loading",
    isError: status === "error",
    isSuccess: status === "success",
    data,
    error,
    status,
    run,
  };
}

export default useAsync;
