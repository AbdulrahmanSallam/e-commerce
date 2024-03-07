import { Product } from './product';

export interface Cart {
  totalCartPrice: number;
  products: {
    title: string;
    price: number;
    count: number;
    product: Product;
  };
}
