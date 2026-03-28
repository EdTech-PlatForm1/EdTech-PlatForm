
import { wishlistModel } from "../../DB/model/withlist.model.js";
import productsSchema from "../../DB/model/products.schema.js";

export const addToWishlist = async (req, res, next) => {
  try {
    const { productId, guestId } = req.body;
    if (!guestId) return res.status(400).json({ message: "guestId is required" });
    let wishlist = await wishlistModel.findOne({ guestId });
    if (!wishlist) {
      wishlist = await wishlistModel.create({ guestId, products: [productId] });
    } else {
      wishlist.products.addToSet(productId);
      await wishlist.save();
    }
    return res.status(200).json({
      message: "Product added to wishlist",
      wishlist: wishlist.products,
    });
  } catch (error) {
    next(error);
  }
};

export const removeFromWishlist = async (req, res, next) => {
  try {
    const { guestId, productId } = req.body;

    if (!guestId || !productId) return res.status(400).json({ message: "guestId and productId are required" });

    const wishlist = await wishlistModel.findOne({ guestId });
    if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });

    wishlist.products.pull(productId);
    await wishlist.save();

    return res.status(200).json({
      message: "Product removed from wishlist",
      wishlist: wishlist.products,
    });
  } catch (error) {
    next(error);
  }
};

export const getWishlist = async (req, res, next) => {
  try {
    const { guestId } = req.params;
    if (!guestId) return res.status(400).json({ message: "guestId is required" });

    const wishlist = await wishlistModel.findOne({ guestId }).populate("products");
    if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });

    return res.status(200).json({
      message: "Wishlist fetched successfully",
      wishlist: wishlist.products,
    });
  } catch (error) {
    next(error);
  }
};