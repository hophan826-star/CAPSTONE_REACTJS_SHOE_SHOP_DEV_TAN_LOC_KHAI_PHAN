import { create } from "zustand";

import { http, settings, TOKEN, USER_LOGIN } from "../util/config";

import { reconcilePurchases, forgetOrderReceipt } from "../util/orderReceipts";

const useUserStore = create((set, get) => ({
  userLogin: settings.getStorageJSON(USER_LOGIN),
  userProfile: null,
  profileLoading: false,
  profileError: null,
  arrFavorite: [],

  saveLogin: (content) => {
    settings.setStorage(TOKEN, content.accessToken);

    settings.setStorageJSON(USER_LOGIN, content);

    set({
      userLogin: content,
    });
  },

  logout: () => {
    settings.clearStorage(TOKEN);
    settings.clearStorage(USER_LOGIN);

    set({
      userLogin: null,
      userProfile: null,
      arrFavorite: [],
    });
  },

  loginApi: async (userLogin) => {
    const res = await http.post("/api/Users/signin", userLogin);

    get().saveLogin(res.data.content);

    return res.data;
  },

  loginFacebookApi: async (facebookToken) => {
    const res = await http.post("/api/Users/facebooklogin", { facebookToken });

    get().saveLogin(res.data.content);

    return res.data;
  },

  registerApi: async (userRegister) => {
    const res = await http.post("/api/Users/signup", userRegister);

    return res.data;
  },

  getProfileApi: async () => {
    set({
      profileLoading: true,
      profileError: null,
    });

    try {
      const res = await http.post("/api/Users/getProfile");

      const content = res.data?.content;

      if (!content || typeof content !== "object" || Array.isArray(content)) {
        throw new Error("API không trả về thông tin tài khoản hợp lệ.");
      }

      const rawHistory = content.ordersHistory ?? content.orderHistory ?? [];

      const ordersHistory = Array.isArray(rawHistory) ? rawHistory : [];

      reconcilePurchases(content.email, ordersHistory);

      set({
        userProfile: {
          ...content,
          ordersHistory,
        },
        profileLoading: false,
      });

      return {
        ...content,
        ordersHistory,
      };
    } catch (err) {
      set({
        profileError:
          err?.response?.data?.message || err.message || "Không thể tải hồ sơ.",
        profileLoading: false,
      });

      throw err;
    }
  },

  updateProfileApi: async (userUpdate) => {
    const res = await http.post("/api/Users/updateProfile", userUpdate);

    await get().getProfileApi();

    return res.data;
  },

  changePasswordApi: async (newPassword) => {
    const res = await http.post("/api/Users/changePassword", { newPassword });

    return res.data;
  },

  uploadAvatarApi: async (file) => {
    const formData = new FormData();

    formData.append("avatar", file);

    const res = await http.post("/api/Users/uploadavatar", formData);

    await get().getProfileApi();

    return res.data;
  },

  deleteOrderApi: async (orderId) => {
    const res = await http.post("/api/Users/deleteOrder", { orderId });

    forgetOrderReceipt(get().userProfile?.email, orderId);

    await get().getProfileApi();

    return res.data;
  },

  getFavoriteApi: async () => {
    if (!settings.getStorage(TOKEN)) {
      return;
    }

    try {
      const res = await http.get("/api/Users/getproductfavorite");

      set({
        arrFavorite: res.data.content?.productsFavorite || [],
      });
    } catch (err) {
      console.error(err);
    }
  },

  toggleLikeApi: async (product) => {
    const isLiked = get().arrFavorite.some(
      (item) => String(item.id) === String(product.id),
    );

    const url = isLiked ? "/api/Users/unlike" : "/api/Users/like";

    await http.get(url, {
      params: {
        productId: product.id,
      },
    });

    await get().getFavoriteApi();

    return !isLiked;
  },
}));

export default useUserStore;
