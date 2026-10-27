import { create } from "zustand";
import { persist } from "zustand/middleware";
import { http } from "../util/config";

const useCartStore = create(
  persist(
    (set, get) => ({
      cartData: [],

      getQuantityInCart: (id) => {
        return get()
          .cartData.filter((item) => String(item.id) === String(id))
          .reduce((total, item) => total + Number(item.quantity), 0);
      },

      addToCart: (product, size, quantity) => {
        const stock = Number(product.quantity ?? 0);
        const requested = Number(quantity);

        if (!Number.isInteger(requested) || requested < 1) {
          return 0;
        }

        const canAdd = Math.max(
          0,
          Math.min(requested, stock - get().getQuantityInCart(product.id)),
        );

        if (canAdd <= 0) {
          return 0;
        }

        const cartData = [...get().cartData];

        const index = cartData.findIndex(
          (item) =>
            String(item.id) === String(product.id) &&
            String(item.size) === String(size),
        );

        if (index !== -1) {
          cartData[index] = {
            ...cartData[index],
            quantity: cartData[index].quantity + canAdd,
          };
        } else {
          cartData.push({
            id: product.id,
            name: product.name,
            image: product.image,
            price: product.price,
            size,
            quantity: canAdd,
            stock,
            checked: true,
          });
        }

        set({ cartData });

        return canAdd;
      },

      changeQuantity: (id, size, number) => {
        const totalOfProduct = get().getQuantityInCart(id);

        const cartData = get().cartData.map((item) => {
          if (
            String(item.id) !== String(id) ||
            String(item.size) !== String(size)
          ) {
            return item;
          }

          const quantity = Number(item.quantity) + Number(number);

          if (quantity < 1) {
            return item;
          }

          if (
            number > 0 &&
            item.stock &&
            totalOfProduct + Number(number) > item.stock
          ) {
            return item;
          }

          return {
            ...item,
            quantity,
          };
        });

        set({ cartData });
      },

      deleteItem: (id, size) => {
        set({
          cartData: get().cartData.filter(
            (item) =>
              !(
                String(item.id) === String(id) &&
                String(item.size) === String(size)
              ),
          ),
        });
      },

      deleteChecked: () => {
        set({
          cartData: get().cartData.filter((item) => !item.checked),
        });
      },

      clearCart: () => {
        set({ cartData: [] });
      },

      toggleChecked: (id, size) => {
        set({
          cartData: get().cartData.map((item) =>
            String(item.id) === String(id) && String(item.size) === String(size)
              ? { ...item, checked: !item.checked }
              : item,
          ),
        });
      },

      toggleCheckAll: (checked) => {
        set({
          cartData: get().cartData.map((item) => ({
            ...item,
            checked,
          })),
        });
      },

      submitOrderApi: async (email) => {
        const arrChecked = get().cartData.filter((item) => item.checked);

        if (arrChecked.length === 0) {
          throw new Error("Vui lòng chọn sản phẩm để đặt hàng!");
        }

        if (!email) {
          throw new Error("Bạn cần đăng nhập để đặt hàng.");
        }

        const lines = new Map();

        for (const item of arrChecked) {
          const productId = Number(item.id);
          const quantity = Number(item.quantity);

          if (
            !Number.isInteger(productId) ||
            productId <= 0 ||
            !Number.isInteger(quantity) ||
            quantity <= 0
          ) {
            throw new Error("Mã sản phẩm hoặc số lượng không hợp lệ.");
          }

          lines.set(productId, (lines.get(productId) || 0) + quantity);
        }

        const order = {
          orderDetail: [...lines.entries()].map(([productId, quantity]) => ({
            productId,
            quantity,
          })),
          email,
        };

        const res = await http.post("/api/Users/order", order);

        if (
          res.data?.statusCode &&
          ![200, 201].includes(Number(res.data.statusCode))
        ) {
          throw new Error(res.data?.message || "Đặt hàng chưa thành công.");
        }

        get().deleteChecked();

        return res.data;
      },
    }),
    {
      name: "cartData",
    },
  ),
);

export default useCartStore;
