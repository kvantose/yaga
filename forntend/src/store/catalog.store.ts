import { create } from "zustand";

interface IImages {
  id: string;
  url: string;
}

export interface CreateCatalogDto {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  images: IImages[];
}

// DTO для отправки на бэкенд (бэкенд ожидает images: string[])
export interface CatalogApiDto {
  name: string;
  description: string;
  category: string;
  price: number;
  images: string[];
}

interface CatalogState {
  items: CreateCatalogDto[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  fetchItems: () => Promise<void>;
  addItem: (itemData: CatalogApiDto) => Promise<CreateCatalogDto | null>;
  removeItem: (id: string) => Promise<void>;
  editItem: (id: string, itemData: CatalogApiDto) => Promise<void>;

  uploadImages: (files: File[]) => Promise<string[]>;

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
        throw new Error(`Ошибка при загрузке: ${response.status}`);
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

  uploadImages: async (files: File[]): Promise<string[]> => {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await fetch(`${API_URL}/api/upload-multiple`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Ошибка загрузки");
    }

    const result = await response.json();
    return result.map((img: { url: string }) => img.url);
  },

  addItem: async (
    itemData: CatalogApiDto,
  ): Promise<CreateCatalogDto | null> => {
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

  editItem: async (id: string, itemData: CatalogApiDto) => {
    try {
      const response = await fetch(`${API_URL}/api/catalog/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Ошибка при редактировании товара");
      }

      // Обновляем элемент в store после успешного обновления
      const updatedItem = await response.json();
      set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? updatedItem : item
        ),
      }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Произошла ошибка";
      set({ error: message });
      throw error;
    }
  },

  removeItem: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/api/delete-catalog/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Ошибка при удалении: ${response.status}`);
      }

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
