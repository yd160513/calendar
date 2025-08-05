import { useEffect } from 'react';

/**
 * 时间更新 hook
 * @param setTime 更新时间的函数
 */
export const useTime = (setTime: (date: Date) => void) => {
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 60_000);

    return () => clearInterval(timer);
  }, [setTime]);
};
