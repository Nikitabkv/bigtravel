import dayjs from 'dayjs';

export const sortByDay = (a, b) => dayjs(a.startTrip).diff(dayjs(b.startTrip), 'm');

export const sortByDuration = (a, b) => {
  a = dayjs(a.endTrip).diff(dayjs(a.startTrip), 'm');
  b = dayjs(b.endTrip).diff(dayjs(b.startTrip), 'm');
  return a - b;
};

export const sortByPrice = (a, b) => {
  a = a.eventCost;
  b = b.eventCost;
  return a - b;
};

export const sortByEvent = (a, b) => {
  if (a.eventType === 'Ship') {
    return 3.5 - b.eventType.length;
  }
  if (a.eventType === 'Drive') {
    return 4.5 - b.eventType.length;
  }
  return a.eventType.length - b.eventType.length;
};

export const getRandomInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const getDuration = (millisecond) => {
  const days = Math.floor((millisecond)/86400000);
  const hours = Math.floor((millisecond)/3600000) - (days*24);
  const minutes = Math.floor(((millisecond) - (hours*3600000) - (days*86400000))/60000);
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};
