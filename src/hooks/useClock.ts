import { useEffect, useState } from 'react';

/** Live HH:MM in a given IANA timezone (default Asia/Jakarta). Ticks each minute. */
export function useClock(timeZone = 'Asia/Jakarta') {
  const format = () =>
    new Intl.DateTimeFormat('en-GB', {
      timeZone, hour: '2-digit', minute: '2-digit', hour12: false,
    }).format(new Date());

  const [time, setTime] = useState(format);

  useEffect(() => {
    const id = setInterval(() => setTime(format()), 15000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeZone]);

  return time;
}
