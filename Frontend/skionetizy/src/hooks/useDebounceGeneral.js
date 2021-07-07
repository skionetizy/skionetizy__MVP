import { useState, useEffect } from "react";

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

export default useDebounceGeneral;
