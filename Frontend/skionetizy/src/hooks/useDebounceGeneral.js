import { useState, useEffect, useRef, useCallback } from "react";

const useDebounceGeneral = (data, delay) => {
  const [debouncedData, setDebouncedData] = useState(data);

  useEffect(() => {
    const timerID = setTimeout(() => {
      setDebouncedData(data);
    }, delay);
    console.log("debounce executed");

    return () => {
      clearTimeout(timerID);
    };
  }, [data]);
  console.log({ debouncedDataInuseDebounce: debouncedData });
  return debouncedData;
};

export function NEW_useDebounceGeneral(callback, timeout = 0) {
  const callbackRef = useRef(callback);
  const prevTimerRef = useRef();
  ///...

  const debounce = useCallback(
    (value) => {
      if (prevTimerRef.current) clearTimeout(prevTimerRef.current);

      prevTimerRef.current = setTimeout(
        () => callbackRef.current(value),
        timeout
      );
    },
    [timeout]
  );

  return debounce;
}

export default useDebounceGeneral;
