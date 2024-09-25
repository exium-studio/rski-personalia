import { useState, useEffect } from "react";

interface CountdownParams {
  initialValue?: number;
  conditions?: boolean;
}

const useCountdown = ({
  initialValue = 10,
  conditions = true,
}: CountdownParams) => {
  const [countDown, setCountDown] = useState(initialValue);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (conditions) {
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
    } else {
      setCountDown(initialValue);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [conditions, initialValue]);

  const resetCountdown = (newValue: number) => {
    setCountDown(newValue);
  };

  return { countDown, setCountDown: resetCountdown };
};

export default useCountdown;
