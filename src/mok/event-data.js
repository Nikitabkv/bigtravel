import dayjs from 'dayjs';

const DESCRIPTION = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
];

const CITIES = [
  'Tokyo',
  'Osaka',
  'Kagosima',
  'Fudzi',
  'Okinawa',
];

const POINT_TYPE = [
  'Taxi',
  'Bus',
  'Train',
  'Ship',
  'Transport',
  'Drive',
  'Flight',
  'Check-in',
  'Sightseeing',
  'Restaurant',
];

const OFFERS_TAXI = [
  {
    offerTitle: 'Order Uber',
    offerPrice: '20',
    checked: Boolean(getRandomInteger(0, 1)),
  },
  {
    offerTitle: 'Order Business Taxi',
    offerPrice: '50',
    checked: false,
  },
  {
    offerTitle: 'Catch a taxi on the street',
    offerPrice: '35',
    checked: false,
  },
];

const OFFERS_BUS = [
  {
    offerTitle: 'Choose seats',
    offerPrice: '10',
    checked: Boolean(getRandomInteger(0, 1)),
  },
  {
    offerTitle: 'Switch class',
    offerPrice: '25',
    checked: Boolean(getRandomInteger(0, 1)),
  },
];

const OFFERS_TRAIN = [
  {
    offerTitle: 'Buy meal',
    offerPrice: '10',
    checked: Boolean(getRandomInteger(0, 1)),
  },
  {
    offerTitle: 'Switch class',
    offerPrice: '25',
    checked: Boolean(getRandomInteger(0, 1)),
  },
  {
    offerTitle: 'Add luggage',
    offerPrice: '15',
    checked: Boolean(getRandomInteger(0, 1)),
  },
  {
    offerTitle: 'Choose seats',
    offerPrice: '10',
    checked: Boolean(getRandomInteger(0, 1)),
  },
];

const OFFERS_SHIP = [
  {
    offerTitle: 'Add luggage',
    offerPrice: '15',
    checked: Boolean(getRandomInteger(0, 1)),
  },
  {
    offerTitle: 'Buy meal',
    offerPrice: '10',
    checked: Boolean(getRandomInteger(0, 1)),
  },
];

const OFFERS_TRANSPORT = [];

const OFFERS_DRIVE = [
  {
    offerTitle: 'Rent a car',
    offerPrice: '180',
    checked: Boolean(getRandomInteger(0, 1)),
  },
];

const OFFERS_FLIGHT = [
  {
    offerTitle: 'Buy meal',
    offerPrice: '10',
    checked: Boolean(getRandomInteger(0, 1)),
  },
  {
    offerTitle: 'Switch class',
    offerPrice: '75',
    checked: Boolean(getRandomInteger(0, 1)),
  },
  {
    offerTitle: 'Add luggage',
    offerPrice: '15',
    checked: Boolean(getRandomInteger(0, 1)),
  },
  {
    offerTitle: 'Choose seats',
    offerPrice: '10',
    checked: Boolean(getRandomInteger(0, 1)),
  },
];

const OFFERS_CHECKIN = [
  {
    offerTitle: 'Add breakfast',
    offerPrice: '50',
    checked: Boolean(getRandomInteger(0, 1)),
  },
];

const OFFERS_SIGHTSEEING = [
  {
    offerTitle: 'Book tickets',
    offerPrice: '30',
    checked: Boolean(getRandomInteger(0, 1)),
  },
  {
    offerTitle: 'Lunch in city',
    offerPrice: '25',
    checked: Boolean(getRandomInteger(0, 1)),
  },
];

const OFFERS_RESTAURANT = [
  {
    offerTitle: 'Choose VIP room',
    offerPrice: '150',
    checked: Boolean(getRandomInteger(0, 1)),
  },
];

const PHOTOS = [
  'https://picsum.photos/248/152?r=0',
  'https://picsum.photos/248/152?r=1',
  'https://picsum.photos/248/152?r=2',
  'https://picsum.photos/248/152?r=3',
  'https://picsum.photos/248/152?r=4',
];

let id = 0;

const getOffers = (pointType) => {
  switch (pointType) {
    case 'Taxi':
      return OFFERS_TAXI;
    case 'Bus':
      return OFFERS_BUS;
    case 'Train':
      return OFFERS_TRAIN;
    case 'Ship':
      return OFFERS_SHIP;
    case 'Transport':
      return OFFERS_TRANSPORT;
    case 'Drive':
      return OFFERS_DRIVE;
    case 'Flight':
      return OFFERS_FLIGHT;
    case 'Check-in':
      return OFFERS_CHECKIN;
    case 'Sightseeing':
      return OFFERS_SIGHTSEEING;
    case 'Restaurant':
      return OFFERS_RESTAURANT;
  }
};

function getRandomInteger (a = 0, b = 1) {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
}

const generateDescription = () => `${new Array(getRandomInteger(1, 5)).fill().map(() => DESCRIPTION[getRandomInteger(0,10)]).join(' ')}`;

export const generateEvent = () => {
  // базовая дата
  // не используется в объекте точки
  const date = dayjs().add(getRandomInteger(-2, 2), 'day');

  // Дата старта и конца события
  const startTime = date.add(getRandomInteger(0, 10), 'minute');
  const endTime = date.add(getRandomInteger(15, 2000), 'minute');

  const eventType = `${POINT_TYPE[getRandomInteger(0, POINT_TYPE.length - 1)]}`;

  return {
    id: id += 1,
    eventType: eventType,
    destination: `${CITIES[getRandomInteger(0, CITIES.length - 1)]}`,
    offers: getOffers(eventType),
    allOffers: getOffers,
    destinationDescription: {
      description: generateDescription(),
      photo: PHOTOS,
    },
    startTrip: startTime,
    endTrip: endTime,
    eventCost: `${getRandomInteger(15, 150)}`,
    favorite: Boolean(getRandomInteger(0, 1)),
  };
};
