import { useState, useEffect } from "react";

const useDebounce = (data, delay) => {
  const [debouncedData, setDebouncedData] = useState(data);

  useEffect(() => {
    const timerID = setTimeout(() => {
      setDebouncedData(data);
    }, delay);
    console.log("debounce executed");

    return () => {
      clearTimeout(timerID);
    };
  }, [data.blogTitle, data.blogDescription]);

  return debouncedData;
};

export default useDebounce;
