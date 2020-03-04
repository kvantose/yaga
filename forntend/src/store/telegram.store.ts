import { create } from "zustand";

interface TelegramStore {
  sendToTelegram: (
    question: string,
    phone: string,
    telegram: string
  ) => Promise<void>;
  error: string | null;
  success: boolean;
  loading: boolean;
  clearError: () => void;
}

export const useTelegram = create<TelegramStore>((set) => ({
  error: null,
  success: false,
  loading: false,

  clearError: () => set({ error: null }),

  sendToTelegram: async (question, phone, telegram) => {
    set({ loading: true, error: null });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/feedback`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question, phone, telegram }),
        }
      );

      if (!response.ok) {
        throw new Error("Не удалось отправить сообщение");
      }

      set({ success: true });
    } catch {
      set({ error: "Не удалось отправить сообщение" });
    } finally {
      set({ loading: false });
    }
  },
}));
