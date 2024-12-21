import React, { useState, useEffect } from 'react';

export const Countdown = ({ endDate }) => {
  const calculateTimeLeft = () => {
    const now = new Date();
    const difference = new Date(endDate) - now;

    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  console.log('timeLeft: ', Object.keys(timeLeft).length);
  return (
    <div className='flex font-regular italic gap-2 text-xl pl-4 pt-3'>
      {timeLeft.days > 0 && <p>{timeLeft.days} days</p>}
      {timeLeft.hours > 0 && <p>{timeLeft.hours} hours</p>}
      {timeLeft.minutes > 0 && <p>{timeLeft.minutes} minutes</p>}
      {timeLeft.seconds > 0 && <p>{timeLeft.seconds} seconds</p>}
      {Object.keys(timeLeft).length === 0 && <p>Product Sold!</p>}
    </div>
  );
};
