export interface Product {
  _id?: string;
  id?: any;
  name: string;
  categoryId: any;
  price: number;
  image: string;
  description: string;
  buyCount?: number;
  userId?: string;
}
