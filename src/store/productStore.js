import { create } from "zustand";
import {
  http,
  cleanProducts,
  getRealProducts,
  BRAND_REGEX,
  filterByBrand,
  getRealHcmStores,
} from "../util/config";

const useProductStore = create((set, get) => ({
  arrFeature: [],
  productDetail: null,
  detailErrorId: null,
  arrSearch: [],
  arrCategory: [],
  arrProductCategory: [],
  paging: { items: [], pageIndex: 1, pageSize: 9, totalRow: 0 },
  arrAllReal: [],
  arrStore: [],
  loading: true,

  getFeatureProductApi: async () => {
    set({ loading: true });
    try {
      const res = await http.get("/api/Product");
      set({ arrFeature: getRealProducts(res.data.content) });
    } catch (err) {
      console.log(err);
    } finally {
      set({ loading: false });
    }
  },

  getProductByIdApi: async (id) => {
    set({ loading: true, productDetail: null, detailErrorId: null });
    try {
      const res = await http.get("/api/Product/getbyid", { params: { id } });
      if (!res.data.content) throw new Error("Không tìm thấy sản phẩm");
      set({ productDetail: res.data.content });
    } catch (err) {
      console.log(err);
      set({ detailErrorId: String(id) });
    } finally {
      set({ loading: false });
    }
  },

  searchProductApi: async (keyword) => {
    set({ loading: true });
    try {
      const res = await http.get("/api/Product", { params: { keyword } });
      set({ arrSearch: cleanProducts(res.data.content) });
    } catch (err) {
      console.log(err);
      set({ arrSearch: [] });
    } finally {
      set({ loading: false });
    }
  },

  getSuggestApi: async (keyword) => {
    try {
      const res = await http.get("/api/Product", { params: { keyword } });
      return cleanProducts(res.data.content);
    } catch (err) {
      console.log(err);
      return [];
    }
  },

  getAllCategoryApi: async () => {
    try {
      const res = await http.get("/api/Product/getAllCategory");
      set({ arrCategory: res.data.content });
    } catch (err) {
      console.log(err);
    }
  },

  getProductByCategoryApi: async (categoryId, isSearchPage = false) => {
    set({ loading: true });
    try {
      let arrProduct;
      if (BRAND_REGEX[categoryId]) {
        const res = await http.get("/api/Product");
        arrProduct = filterByBrand(
          getRealProducts(res.data.content),
          categoryId,
        );
      } else {
        const res = await http.get("/api/Product/getProductByCategory", {
          params: { categoryId },
        });
        arrProduct = cleanProducts(res.data.content);
      }
      if (isSearchPage) {
        set({ arrSearch: arrProduct });
      } else {
        set({ arrProductCategory: arrProduct });
      }
    } catch (err) {
      console.log(err);
    } finally {
      set({ loading: false });
    }
  },

  getProductPagingApi: async (pageIndex = 1, pageSize = 9) => {
    set({ loading: true });
    try {
      let arrReal = get().arrAllReal;
      if (arrReal.length === 0) {
        const res = await http.get("/api/Product/getpaging", {
          params: { pageIndex: 1, pageSize: 1000 },
        });
        arrReal = getRealProducts(res.data.content.items);
        set({ arrAllReal: arrReal });
      }
      set({
        paging: {
          items: arrReal.slice(
            (pageIndex - 1) * pageSize,
            pageIndex * pageSize,
          ),
          pageIndex,
          pageSize,
          totalRow: arrReal.length,
        },
      });
    } catch (err) {
      console.log(err);
    } finally {
      set({ loading: false });
    }
  },

  getAllStoreApi: async (keyword = "") => {
    set({ loading: true });
    try {
      const res = await http.get("/api/Product/getAllStore", {
        params: { keyword },
      });

      set({ arrStore: getRealHcmStores(res.data.content, keyword) });
    } catch (err) {
      console.log(err);

      set({ arrStore: getRealHcmStores([], keyword) });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useProductStore;
