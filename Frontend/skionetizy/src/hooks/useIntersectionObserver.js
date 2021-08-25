import { useEffect, useRef, useState } from "react";

function useIObserver() {
  const [isVisible, setIsVisible] = useState(false);
  const targetRef = useRef();
  const intersectionRef = useRef({ io: undefined, entry: undefined });

  useEffect(() => {
    const io = new IntersectionObserver(([entry], _io) => {
      intersectionRef.current = {
        io: _io,
        entry,
      };
      setIsVisible(entry.isIntersecting);
    });

    io.observe(targetRef.current);

    return () => {
      io.disconnect();
    };
  }, []);

  return {
    isVisible,
    targetRef,
    ...intersectionRef.current,
  };
}

export default useIObserver;
