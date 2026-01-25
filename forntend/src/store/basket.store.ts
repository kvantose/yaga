import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CreateCatalogDto } from "./catalog.store";

export interface BasketItem extends CreateCatalogDto {
  quantity: number;
}

interface BasketState {
  loading: boolean;
  success: string | null;
  error: string | null;
  modalEditCard: boolean;

  basketItems: BasketItem[];

  addItem: (item: CreateCatalogDto) => void;
  removeBasketItem: (id: string) => void;
  decreaseItem: (id: string) => void;
  increaseItem: (id: string) => void;
  clearBasket: () => void;
  sendBasket: (phone: string, telegram: string) => Promise<void>;

  totalCount: () => number;
  totalPrice: () => number;
}

export const useBasketStore = create<BasketState>()(
  persist(
    (set, get) => ({
      basketItems: [],
      loading: false,
      success: null,
      error: null,
      modalEditCard: false,

      addItem: (item) =>
        set((state) => {
          const existing = state.basketItems.find((i) => i.id === item.id);

          if (existing) {
            return {
              basketItems: state.basketItems.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
              ),
            };
          }
          console.log(get().basketItems);
          return {
            basketItems: [...state.basketItems, { ...item, quantity: 1 }],
          };
        }),
      decreaseItem: (id) =>
        set((state) => ({
          basketItems: state.basketItems
            .map((item) =>
              item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
            )
            .filter((item) => item.quantity > 0),
        })),

      increaseItem: (id) =>
        set((state) => ({
          basketItems: state.basketItems.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        })),

      removeBasketItem: (id) =>
        set((state) => ({
          basketItems: state.basketItems.filter((item) => item.id !== id),
        })),

      clearBasket: () => {
        (async () => {
          set({ basketItems: [] });
          await localStorage.removeItem("basketItems");
        })();
      },

      sendBasket: async (phone, telegram) => {
        set({ loading: true });

        const items = get().basketItems.map((item) => ({
          productId: item.id,
          name: item.name,
          price: +item.price,
          quantity: +item.quantity,
        }));

        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/orders`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                phone,
                telegram,
                items: items,
              }),
            },
          );

          if (!response.ok) {
            throw new Error("Не удалось отправить");
          }

          set({ success: "Спасибо за заказ" });
          get().clearBasket();
        } catch {
          set({ error: "Не удалось отправить сообщение" });
        } finally {
          set({ loading: false });
        }
      },

      totalCount: () =>
        get().basketItems.reduce((sum, item) => sum + item.quantity, 0),

      totalPrice: () =>
        get().basketItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        ),

      setModelEditCard: () => {
        set({ modalEditCard: !get().modalEditCard });
      },
    }),

    {
      name: "basket-storage",
      partialize: (state) => ({ basketItems: state.basketItems }),
    },
  ),
);
