import { cartModel } from "../../DB/model/cart.model.js";
import productModel from "../../DB/model/products.schema.js";

export const addProductToCart = async (req, res) => {
  try {
    const userId = req.userID;
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ message: "Product ID and valid quantity required" });
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const productPrice = product.finalPrice ?? product.price;
    let cart = await cartModel.findOne({ user: userId });

    if (!cart) {
      cart = await cartModel.create({
        user: userId,
        cartItems: [{
          product: productId,
          quantity,
          price: productPrice
        }],
        totalCartPrice: productPrice * quantity,
        productQuintity: quantity

      });
      return res.status(201).json({ message: "Cart created and product added", cart });
    }
    const itemIndex = cart.cartItems.findIndex(item => item.product.toString() === productId);
    if (itemIndex > -1) {
      cart.cartItems[itemIndex].quantity += quantity;
    } else {

      cart.cartItems.push({ product: productId, quantity, price: productPrice });
    }
    cart.totalCartPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    cart.productQuintity = cart.cartItems.reduce((acc, item) => acc + item.quantity, 0);
    await cart.save();
    res.status(200).json({ message: "Product added to cart", cart });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const getUserCart = async (req, res) => {
  try {
    const userId = req.userID;

    const cart = await cartModel.findOne({ user: userId }).populate('cartItems.product');
    if (!cart) return res.status(404).json({ message: "Cart is empty" });

    res.status(200).json({ cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const removeProductFromCart = async (req, res) => {
  try {
    const userId = req.userID;
    const { productId } = req.params;

    const cart = await cartModel.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.cartItems.findIndex(item => item.product.toString() === productId);
    if (itemIndex === -1) return res.status(404).json({ message: "Product not in cart" });

    cart.cartItems.splice(itemIndex, 1);

    cart.totalCartPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    cart.productQuintity = cart.cartItems.reduce((acc, item) => acc + item.quantity, 0);

    await cart.save();
    res.status(200).json({ message: "Product removed from cart", cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const clearUserCart = async (req, res) => {
  try {
    const userId = req.userID;
    const cart = await cartModel.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    cart.cartItems = [];
    cart.totalCartPrice = 0;
    cart.productQuintity = 0;
    cart.totalCartPriceAfterdiscount = 0;
    await cart.save();
    res.status(200).json({ message: "Cart cleared successfully", cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};