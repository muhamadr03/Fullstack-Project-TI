const { Wishlist, Product } = require("../models");

exports.getUserWishlist = async (req, res, next) => {
  try {
    const wishlists = await Wishlist.findAll({
      where: { user_id: req.user.id },
      include: [{ model: Product, as: "product" }],
    });
    res.status(200).json({ success: true, data: wishlists });
  } catch (error) {
    next(error);
  }
};

exports.toggleWishlist = async (req, res, next) => {
  try {
    const { product_id } = req.body;
    const user_id = req.user.id;

    const existing = await Wishlist.findOne({ where: { user_id, product_id } });

    if (existing) {
      await existing.destroy();
      return res.status(200).json({ success: true, message: "Dihapus dari wishlist", action: "removed" });
    } else {
      await Wishlist.create({ user_id, product_id });
      return res.status(201).json({ success: true, message: "Ditambahkan ke wishlist", action: "added" });
    }
  } catch (error) {
    next(error);
  }
};
