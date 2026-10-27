import { create } from "zustand";

const useToastStore = create((set, get) => ({
  arrToast: [],
  confirmBox: null,

  showToast: (message, type = "success") => {
    const id = Date.now() + Math.random();

    set({ arrToast: [...get().arrToast, { id, type, message }].slice(-4) });

    setTimeout(() => get().hideToast(id), 3000);
  },

  hideToast: (id) => {
    set({ arrToast: get().arrToast.filter((item) => item.id !== id) });
  },

  showConfirm: (message) => {
    get().confirmBox?.resolve(false);
    return new Promise((resolve) => {
      set({ confirmBox: { message, resolve } });
    });
  },

  closeConfirm: (result) => {
    get().confirmBox?.resolve(result);
    set({ confirmBox: null });
  },
}));

export const toast = {
  success: (message) => useToastStore.getState().showToast(message, "success"),
  error: (message) => useToastStore.getState().showToast(message, "error"),
  info: (message) => useToastStore.getState().showToast(message, "info"),
};

export const confirmDialog = (message) =>
  useToastStore.getState().showConfirm(message);

export default useToastStore;
