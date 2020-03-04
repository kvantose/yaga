// src/catalog/interfaces/catalog.interface.ts
export interface ICatalog {
  id: string; // UUID
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
}
