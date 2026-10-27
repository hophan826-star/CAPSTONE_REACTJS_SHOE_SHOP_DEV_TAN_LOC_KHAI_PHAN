const SHOES = [
  [
    "Vans Black",
    "Đen tuyền tối giản, đế waffle bám chắc",
    "Đôi Vans đen tuyền tối giản, dễ phối với mọi trang phục từ đi học đến đi chơi. Thân vải kết hợp da lộn bền bỉ, đế waffle đặc trưng bám đường chắc chân.",
  ],
  [
    "Vans Old School",
    "Dáng thấp cổ điển, sọc Jazz Stripe",
    "Mẫu giày trượt ván kinh điển của Vans với dáng thấp cổ, sọc Jazz Stripe bên hông và đế waffle bám chắc. Phong cách đường phố có từ thập niên 70 mà đến giờ vẫn chưa bao giờ lỗi mốt.",
  ],
  [
    "Converse Chuck Taylor",
    "Cổ cao huyền thoại, canvas xanh navy",
    "Chuck Taylor cổ cao huyền thoại với thân canvas xanh navy, mũi cao su và logo ngôi sao ở mắt cá. Thiết kế tồn tại hơn một thế kỷ, mang lại vẻ cá tính và trẻ trung cho mọi set đồ.",
  ],
  [
    "Nike Adapt Bb",
    "Tự thắt dây thông minh, đèn LED ở đế",
    "Đôi giày bóng rổ tự thắt dây bằng công nghệ Nike Adapt: tự động ôm chân theo ý bạn, chỉnh độ chặt chỉ bằng nút bấm hoặc ứng dụng. Đèn LED ở đế giữa cho vẻ ngoài đậm chất tương lai.",
  ],
  [
    "Nike Air Max 270 React",
    "Đệm Air lớn ở gót, êm cả ngày dài",
    "Air Max 270 React sở hữu bộ đệm Air khổng lồ ở gót kết hợp bọt React mềm bật, cho cảm giác êm ái suốt cả ngày. Phối màu rực rỡ, trẻ trung, nổi bật giữa đám đông.",
  ],
  [
    "Nike Air Max 97",
    "Thân gợn sóng, đệm Air toàn bàn chân",
    "Air Max 97 với thân giày gợn sóng lấy cảm hứng từ tàu cao tốc Nhật Bản và bộ đệm Air chạy suốt chiều dài bàn chân. Tông đen mạnh mẽ, dễ phối và rất hợp phong cách streetwear.",
  ],
  [
    "Nike Air Max 97 Blue",
    "Air Max 97 xanh ánh kim cực nổi bật",
    "Phiên bản Air Max 97 phối sắc xanh ánh kim bắt sáng đầy ấn tượng. Vẫn là thân giày gợn sóng đặc trưng cùng đệm Air toàn bàn chân, dành cho người thích nổi bật.",
  ],
  [
    "Nike Flyknit",
    "Thân Flyknit nhẹ, ôm chân, thoáng khí",
    "Thân giày Flyknit đan liền một mảnh, nhẹ, ôm chân và thoáng khí, kết hợp đế giữa êm giúp bước đi nhẹ nhàng. Màu xanh đậm với điểm nhấn sáng màu, hợp cả tập luyện lẫn mặc hằng ngày.",
  ],
  [
    "Nike React Element",
    "Phong cách tương lai, đệm React êm bật",
    "React Element mang dáng vẻ tương lai với mặt lưới thoáng và đệm React êm ái, phản hồi tốt mỗi bước chân. Lựa chọn lý tưởng cho những ai thích sự khác biệt nhưng vẫn muốn thoải mái.",
  ],
  [
    "Nike Shox Tl",
    "Trụ Shox ở đế, chất chạy bộ đầu 2000",
    "Nike Shox TL nổi bật với hệ thống trụ Shox ở đế giúp giảm chấn, đậm chất giày chạy bộ đầu những năm 2000 đang quay trở lại. Hợp với bạn thích phong cách retro, cá tính.",
  ],
  [
    "Nike Sp Dunk",
    "Dunk dáng thấp, họa tiết paisley độc đáo",
    "Nike Dunk dáng thấp với họa tiết paisley độc đáo, kết hợp các tông màu trầm tạo nên đôi giày vừa cổ điển vừa khác biệt. Một món đồ dành cho người sưu tầm và yêu sneaker.",
  ],
  [
    "Adidas Prophere",
    "Primeknit ôm chân, đế Boost êm và nảy",
    "Adidas Prophere với thân Primeknit ôm sát bàn chân, thiết kế đường nét khí động học và đế giữa Boost êm, nảy. Tông đen toàn tập mạnh mẽ, dễ phối với mọi trang phục.",
  ],
  [
    "Adidas Prophere Black White",
    "Phối đen trắng cá tính, đế Boost êm",
    "Prophere phối hai màu đen trắng tương phản đầy cá tính. Thân Primeknit ôm chân cùng đế giữa Boost êm ái giúp bạn thoải mái từ sáng đến tối.",
  ],
  [
    "Adidas Prophere Customize",
    "Tông đen trầm, đế gum, dễ phối đồ",
    "Phiên bản Prophere tông đen trầm với đế gum màu nâu làm điểm nhấn. Thân Primeknit ôm chân, đế Boost êm, kiểu giày đơn giản mà vẫn nổi bật khi phối cùng quần jean hay đồ thể thao.",
  ],
  [
    "Adidas Super Star Red",
    "Đỏ rực, mũi vỏ sò huyền thoại",
    "Superstar toàn thân đỏ rực với mũi vỏ sò (shell toe) huyền thoại và ba sọc đặc trưng. Một đôi giày mang lại cảm giác sôi động, tạo điểm nhấn cho cả set đồ giản dị.",
  ],
  [
    "Adidas Swift Run",
    "Thân lưới dệt siêu nhẹ, êm chân",
    "Adidas Swift Run với thân lưới dệt siêu nhẹ, thoáng khí và đế êm, phù hợp cho đi bộ, đi làm và chạy nhẹ mỗi ngày. Tông đen kín đáo, dễ phối đồ.",
  ],
  [
    "Adidas Tenisky Super Star",
    "Superstar đen, ba sọc vàng ánh kim",
    "Superstar màu đen kết hợp ba sọc vàng ánh kim sang trọng và mũi vỏ sò kinh điển. Đôi giày vừa cổ điển vừa nổi bật, hợp cả đi làm lẫn đi chơi.",
  ],
  [
    "Adidas Ultraboost 4",
    "Đệm Boost êm bật, Primeknit ôm chân",
    "Ultraboost 4 với bộ đệm Boost hoàn trả năng lượng sau mỗi bước chạy và thân Primeknit ôm chân như tất. Sắc hồng nhạt nhẹ nhàng, thích hợp cho các bạn nữ năng động.",
  ],
  [
    "Adidas Yeezy 350",
    "Đen toàn tập, nhẹ, đế Boost êm ái",
    "Yeezy Boost 350 dáng thấp với thân Primeknit nhẹ, đế Boost êm ái và tông đen toàn tập mạnh mẽ. Một trong những mẫu sneaker được yêu thích nhất, dễ phối với mọi phong cách.",
  ],
];

// "Nike Air Max 270 React" => "nikeairmax270react"
const makeKey = (name) =>
  String(name || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const DESCRIPTIONS = {};
SHOES.forEach(([name, short, long]) => {
  DESCRIPTIONS[makeKey(name)] = { short, long };
});
// api có khi ghi "Nike Air Max 270" (thiếu chữ React)
DESCRIPTIONS[makeKey("Nike Air Max 270")] =
  DESCRIPTIONS[makeKey("Nike Air Max 270 React")];

// trả về { short, long } theo tên giày, hoặc null nếu chưa có mô tả viết tay
export const getShoeInfo = (name) => DESCRIPTIONS[makeKey(name)] || null;
