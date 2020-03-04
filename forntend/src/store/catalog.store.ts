// store/catalog.store.ts
import { create } from "zustand";
import type { ICatalog } from "../types/catalog.interface";

export interface CreateCatalogDto {
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
}

interface CatalogState {
  items: ICatalog[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  // Actions
  fetchItems: () => Promise<void>;
  addItem: (itemData: CreateCatalogDto) => Promise<ICatalog | null>;
  removeItem: (id: string) => Promise<void>;
  uploadImage: (file: File) => Promise<string>;

  // Helpers
  clearError: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const useCatalogStore = create<CatalogState>((set) => ({
  items: [],
  isLoading: false,
  isSubmitting: false,
  error: null,

  fetchItems: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_URL}/api/catalog`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      set({ items: data, isLoading: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Не удалось загрузить каталог";
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_URL}/api/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Ошибка при загрузке изображения");
    }

    const result = await response.json();
    return result.url || result.filename || `/uploads/${file.name}`;
  },

  addItem: async (
    itemData: Omit<ICatalog, "id">
  ): Promise<ICatalog | null> => {
    set({ isSubmitting: true, error: null });

    try {
      const response = await fetch(`${API_URL}/api/catalog`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Ошибка при добавлении товара");
      }

      const newItem = await response.json();
      // Оптимистичное обновление UI
      set((state) => ({
        items: [...state.items, newItem],
        isSubmitting: false,
      }));

      return newItem;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Произошла ошибка";
      set({ error: message, isSubmitting: false });
      return null;
    }
  },

  removeItem: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/api/delete-catalog/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Удаляем из состояния
      set((state) => ({
        items: state.items.filter((item) => item.id !== id),
      }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Ошибка при удалении";
      set({ error: message });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
