import { useState, useEffect } from "react";

const useCountdown = (initialValue: number = 10) => {
  const [countDown, setCountDown] = useState(initialValue);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    const startCountdown = () => {
      interval = setInterval(() => {
        setCountDown((prevCount) => {
          if (prevCount > 0) {
            return prevCount - 1;
          } else {
            clearInterval(interval!);
            return prevCount;
          }
        });
      }, 1000);
    };

    startCountdown();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const resetCountdown = (newValue: number) => {
    setCountDown(newValue);
  };

  return { countDown, setCountDown: resetCountdown };
};

export default useCountdown;
