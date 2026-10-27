import { useNavigate } from "react-router-dom";
import useUserStore from "../store/userStore";
import { toast } from "../store/toastStore";
import { getErrorMessage } from "../util/config";

export default function useToggleLike() {
  const userLogin = useUserStore((state) => state.userLogin);
  const arrFavorite = useUserStore((state) => state.arrFavorite);
  const toggleLikeApi = useUserStore((state) => state.toggleLikeApi);
  const navigate = useNavigate();

  const isLiked = (productId) =>
    arrFavorite.some((item) => String(item.id) === String(productId));

  const toggleLike = async (product) => {
    if (!userLogin) {
      toast.info("Vui lòng đăng nhập để thêm sản phẩm yêu thích!");
      navigate("/login");
      return;
    }
    try {
      const liked = await toggleLikeApi(product);
      if (liked) {
        toast.success(`Đã thêm "${product.name}" vào yêu thích`);
      } else {
        toast.info(`Đã bỏ thích "${product.name}"`);
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return { isLiked, toggleLike };
}
