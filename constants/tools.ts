export interface Tool {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
}

export const tools: Tool[] = [
  {
    id: '1',
    name: 'Дрель Makita',
    price: 500,
    description: 'Мощная дрель',
    image: 'https://via.placeholder.com/300'
  },
  {
    id: '2',
    name: 'Перфоратор Bosch',
    price: 800,
    description: 'Профессиональный перфоратор',
    image: 'https://via.placeholder.com/300'
  },
  {
    id: '3',
    name: 'Шуруповерт DeWalt',
    price: 600,
    description: 'Аккумуляторный шуруповерт',
    image: 'https://via.placeholder.com/300'
  }
];
