import { create } from "zustand";
import { persist } from "zustand/middleware";

const useRecentStore = create(
  persist(
    (set, get) => ({
      arrRecent: [],

      addRecent: (product) => {
        const item = {
          id: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          shortDescription: product.shortDescription,
          size: product.size,
          quantity: product.quantity,
        };

        const arrRecent = [
          item,
          ...get().arrRecent.filter((p) => p.id !== product.id),
        ].slice(0, 6);
        set({ arrRecent });
      },

      clearRecent: () => set({ arrRecent: [] }),
    }),
    { name: "recent" },
  ),
);

export default useRecentStore;
