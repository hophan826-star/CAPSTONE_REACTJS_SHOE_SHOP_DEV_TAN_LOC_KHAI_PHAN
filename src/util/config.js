import axios from "axios";
import { toast } from "../store/toastStore";
import { getShoeInfo } from "./descriptions";

export const DOMAIN = "https://shop.cyberlearn.vn";
export const TOKEN = "accessToken";
export const USER_LOGIN = "userLogin";

export const FB_APP_ID = "4605829566359985";

export const NO_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200">' +
      '<rect width="300" height="200" fill="#f3f3f3"/>' +
      '<path d="M44 140 L46 100 Q48 90 60 90 L84 92 Q96 94 104 84 L118 68 Q124 62 132 66 L150 80 Q170 100 214 108 Q252 114 260 128 L262 140 Z" fill="#cfcfcf"/>' +
      '<path d="M124 78 l12 10 M134 72 l12 10 M144 78 l10 10" stroke="#f3f3f3" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M70 120 Q140 130 222 116" stroke="#b8b8b8" stroke-width="6" fill="none" stroke-linecap="round"/>' +
      '<rect x="38" y="140" width="228" height="14" rx="7" fill="#a5a5a5"/>' +
      '<text x="150" y="184" font-family="Arial" font-size="14" fill="#a0a0a0" text-anchor="middle">Shoes Shop</text>' +
      "</svg>",
  );

export const NO_AVATAR =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#d9d9e8"/><circle cx="100" cy="78" r="38" fill="#8f8fb3"/><path d="M30 190c8-44 38-66 70-66s62 22 70 66z" fill="#8f8fb3"/></svg>',
  );

export const settings = {
  setStorage: (name, value) => {
    localStorage.setItem(name, value);
  },
  getStorage: (name) => {
    return localStorage.getItem(name);
  },
  setStorageJSON: (name, data) => {
    localStorage.setItem(name, JSON.stringify(data));
  },
  getStorageJSON: (name) => {
    const data = localStorage.getItem(name);
    if (data) {
      try {
        return JSON.parse(data);
      } catch {
        return null;
      }
    }
    return null;
  },
  clearStorage: (name) => {
    localStorage.removeItem(name);
  },
};

export const http = axios.create({
  baseURL: DOMAIN,
  timeout: 30000,
});

http.interceptors.request.use(
  (config) => {
    const token = settings.getStorage(TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && settings.getStorage(TOKEN)) {
      settings.clearStorage(TOKEN);
      settings.clearStorage(USER_LOGIN);
      toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    }
    return Promise.reject(error);
  },
);

export const getErrorMessage = (error) => {
  return error?.response?.data?.message || error?.message || "Có lỗi xảy ra!";
};

export const formatDate = (dateString) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd} - ${mm} - ${d.getFullYear()}`;
};

export const formatPrice = (price) => {
  if (price === undefined || price === null) return "";
  return Number(price).toLocaleString("en-US") + "$";
};

export const cleanProducts = (arrProduct) => {
  if (!Array.isArray(arrProduct)) return [];
  return arrProduct.filter(
    (product) =>
      product.name &&
      product.name.trim() !== "" &&
      product.name !== "string" &&
      product.price > 0,
  );
};

export const getProductImage = (image) => {
  if (!image || typeof image !== "string") return NO_IMAGE;
  let url = image.trim();

  const lastHttp = Math.max(
    url.lastIndexOf("http://"),
    url.lastIndexOf("https://"),
  );
  if (lastHttp > 0) url = url.slice(lastHttp);
  if (!url.startsWith("http")) {
    return /\.(png|jpe?g|webp|gif)$/i.test(url)
      ? `${DOMAIN}/images/${url}`
      : NO_IMAGE;
  }
  if (url.endsWith("/images/") || url.includes("pravatar.cc")) return NO_IMAGE;
  return url;
};

export const getRealProducts = (arrProduct) => {
  return cleanProducts(arrProduct)
    .filter((product) =>
      getProductImage(product.image).startsWith(`${DOMAIN}/images/`),
    )
    .sort((a, b) => a.id - b.id);
};

export const BRAND_REGEX = {
  NIKE: /\bnike\b/i,
  ADIDAS: /\badidas\b/i,
  VANS_CONVERSE: /\b(vans?|converse)\b/i,
};

export const filterByBrand = (arrProduct, categoryId) => {
  const regex = BRAND_REGEX[categoryId];
  return regex
    ? arrProduct.filter((product) => regex.test(product.name))
    : arrProduct;
};

export const cleanDescription = (text) => {
  if (!text || typeof text !== "string") return "";
  const result = text
    .replace(/^\s*about this shoe\s*:\s*/i, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!result || result.toLowerCase() === "string") return "";
  if (/lorem ipsum|consectetur|adipiscing/i.test(result)) return "";
  return result;
};

export const getShortDescription = (product) => {
  const info = getShoeInfo(product?.name);
  if (info) return info.short;
  const text = cleanDescription(product?.shortDescription);
  if (text) return text;
  const sizes = Array.isArray(product?.size)
    ? product.size.map(Number).filter((n) => n > 0)
    : [];
  const parts = [];
  if (sizes.length)
    parts.push(`Size ${Math.min(...sizes)} - ${Math.max(...sizes)}`);
  if (product?.quantity > 0) parts.push(`Còn ${product.quantity} sản phẩm`);
  return parts.length ? parts.join(" · ") : "Giày chính hãng";
};

export const getLongDescription = (product) => {
  const info = getShoeInfo(product?.name);
  if (info) return info.long;
  return (
    cleanDescription(product?.description) ||
    cleanDescription(product?.shortDescription) ||
    getShortDescription(product)
  );
};

export const handleImageError = (e) => {
  if (!e.currentTarget.src.startsWith("data:")) {
    e.currentTarget.src = NO_IMAGE;
  }
};

export const handleAvatarError = (e) => {
  if (!e.currentTarget.src.startsWith("data:")) {
    e.currentTarget.src = NO_AVATAR;
  }
};

export const REAL_HCM_STORES = [
  {
    id: 1,
    name: "Shoes Shop Nguyễn Huệ (Quận 1)",
    alias: "shoes-shop-nguyen-hue",
    description: "123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    latitude: "10.774566",
    longtitude: "106.703556",
    image:
      "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    name: "Shoes Shop Quang Trung (Gò Vấp)",
    alias: "shoes-shop-quang-trung",
    description: "326 Quang Trung, Phường 10, Quận Gò Vấp, TP. Hồ Chí Minh",
    latitude: "10.831540",
    longtitude: "106.667890",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    name: "Shoes Shop Võ Văn Ngân (Thủ Đức)",
    alias: "shoes-shop-vo-van-ngan",
    description:
      "240 Võ Văn Ngân, Phường Bình Thọ, TP. Thủ Đức, TP. Hồ Chí Minh",
    latitude: "10.850120",
    longtitude: "106.762340",
    image:
      "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=600&q=80",
  },
];

export const getRealHcmStores = (apiStores = [], keyword = "") => {
  const kw = keyword.trim().toLowerCase();
  if (!kw) return REAL_HCM_STORES;
  return REAL_HCM_STORES.filter(
    (store) =>
      store.name.toLowerCase().includes(kw) ||
      store.description.toLowerCase().includes(kw),
  );
};
