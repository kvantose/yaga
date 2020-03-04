export interface OrderItemResponseDto {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderResponseDto {
  id: string;
  phone: string;
  telegram: string;
  totalPrice: number;
  items: OrderItemResponseDto[];
  createdAt: string;
}
