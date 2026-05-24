export interface Tool {
  id: string;
  name: string;
  brand: string;
  serialNumber?: string;
  pricePerDay: number;
  deposit: number;
  characteristics?: string;
  quantity: number;
  imageUrl?: string;
  category: string;
}

export const tools: Tool[] = [
  {
    id: '1',
    name: 'Лентошлифовальная машина',
    brand: 'Зубр ЗЛШМ-76-950',
    serialNumber: '325801345-0118',
    pricePerDay: 500,
    deposit: 5000,
    characteristics: 'Мощность 950 Вт, лента 76x533 мм, скорость 380 м/мин',
    quantity: 1,
    category: 'Шлифовальное оборудование'
  },
  {
    id: '2',
    name: 'Паяльник полипропилена',
    brand: 'Black Gear',
    serialNumber: '27112104775',
    pricePerDay: 600,
    deposit: 5000,
    characteristics: '1000-1500 Вт, до 300°C, насадки 20-32 мм',
    quantity: 1,
    category: 'Сварочное оборудование'
  },
  {
    id: '3',
    name: 'УШМ 125',
    brand: 'Max Pro 680W',
    serialNumber: '19-055/1/0456',
    pricePerDay: 350,
    deposit: 2000,
    characteristics: '680 Вт, диск 125 мм, 11000 об/мин',
    quantity: 1,
    category: 'Шлифовальное оборудование'
  },
  {
    id: '4',
    name: 'Дрель тихоходная с ударом',
    brand: 'AEG DB1500-2XE',
    serialNumber: '1378',
    pricePerDay: 2500,
    deposit: 10000,
    characteristics: '1500 Вт, патрон 13 мм, 0-3000 об/мин',
    quantity: 1,
    category: 'Электроинструмент'
  },
  {
    id: '5',
    name: 'Перфоратор',
    brand: 'Makita 2470',
    serialNumber: '300245',
    pricePerDay: 800,
    deposit: 5000,
    characteristics: '780 Вт, энергия удара 2.7 Дж',
    quantity: 1,
    category: 'Электроинструмент'
  },
  {
    id: '6',
    name: 'Шуруповерт',
    brand: 'Bosch GSB120-Li',
    serialNumber: '322203903',
    pricePerDay: 600,
    deposit: 5000,
    characteristics: '12В, 2 аккумулятора, 30/13 Нм',
    quantity: 1,
    category: 'Электроинструмент'
  },
  {
    id: '7',
    name: 'Бетономешалка 63 л',
    brand: 'Земляк БСЭ-63',
    pricePerDay: 1000,
    deposit: 5000,
    characteristics: '63 л, 550 Вт, 130 л/час',
    quantity: 1,
    category: 'Бетоносмесители'
  },
  {
    id: '8',
    name: 'Плазморез',
    brand: 'Rilon CUT 60 C',
    serialNumber: '92004788',
    pricePerDay: 2000,
    deposit: 10000,
    characteristics: '60А, рез до 20 мм, 220В',
    quantity: 1,
    category: 'Сварочное оборудование'
  },
  {
    id: '9',
    name: 'Отбойный молоток',
    brand: 'Favorit',
    serialNumber: '062023/20230331-15',
    pricePerDay: 2000,
    deposit: 10000,
    characteristics: '1500 Вт, 65 Дж, 1900 уд/мин',
    quantity: 3,
    category: 'Электроинструмент'
  },
  {
    id: '10',
    name: 'Осушитель воздуха',
    brand: 'Master DH92',
    serialNumber: '986360002340',
    pricePerDay: 1100,
    deposit: 10000,
    characteristics: '92 л/сутки, до 150 м²',
    quantity: 9,
    category: 'Климатическое оборудование'
  }
];
