import Product from "../products/products.schema.js";
import Order from "./orders.schema.js";

export const createOrder = async (req, res) => {
  try {
    const { products, address, paymentMethod } = req.body;

    let totalPrice = 0;
    let orderProducts = [];

    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        throw new Error(`Product not found: ${item.product}`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Not enough stock for ${product.productName}`);
      }

      const price = product.price;
      totalPrice += price * item.quantity;
      orderProducts.push({
        product: product._id,
        quantity: item.quantity,
        price: price,
      });

      await Product.updateOne(
        { _id: item.product },
        { $inc: { stock: -item.quantity } },
      );
    }

    const subtotal = totalPrice;
    const order = await Order.create([
      {
        user: req.user._id,
        products: orderProducts,
        subtotal,
        shippingCost: 0,
        totalPrice: subtotal,
        address,
        paymentMethod,
        isPaid: false,
        status: "pending",
      },
    ]);

    return res.status(201).json({
      message: "Order created successfully",
      order: order[0],
    });
  } catch (err) {
    if (req.body.products) {
      for (const item of req.body.products) {
        await Product.updateOne(
          { _id: item.product },
          { $inc: { stock: item.quantity } },
        );
      }
    }
    return res.status(400).json({ message: err.message });
  }
};

export const setShippingCost = async (req, res) => {
  try {
    const { id } = req.params;
    const { shippingCost } = req.body;

    const order = await Order.findById(id);
    if (!order) throw new Error("Order not found");

    if (order.status !== "pending") {
      throw new Error("Cannot set shipping now");
    }

    order.shippingCost = Number(shippingCost);
    order.totalPrice = order.subtotal + order.shippingCost;

    if (order.paymentMethod === "card") {
      order.paidAmount = 0;
      order.isPaid = false;
      order.status = "waiting_payment";
    }

    if (order.paymentMethod === "cash") {
      order.paidAmount = order.shippingCost;
      order.isPaid = false;
      order.status = "pending";
    }

    await order.save();

    res.json({ message: "Shipping set", order });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const confirmPayment = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order || order.isDeleted) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.paymentMethod !== "card") {
      return res.status(400).json({
        message: "Only card payments can be confirmed here",
      });
    }

    if (order.shippingCost == null) {
      return res.status(400).json({
        message: "Shipping not set by admin yet",
      });
    }

    if (order.isPaid) {
      return res.status(400).json({ message: "Already paid" });
    }

    if (["cancelled", "failed", "returned"].includes(order.status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    order.isPaid = true;
    order.paidAmount = order.totalPrice;
    order.finalCollected = order.totalPrice;
    order.status = "paid";

    await order.save();

    return res.status(200).json({
      message: "Payment confirmed successfully",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const shipOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (["shipped", "delivered"].includes(order.status)) {
      return res.status(400).json({ message: "Order already processed" });
    }

    if (["cancelled", "failed", "returned"].includes(order.status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    if (
      (order.paymentMethod === "card" && order.isPaid === true) ||
      (order.paymentMethod === "cash" &&
        order.status === "pending" &&
        order.paidAmount >= order.shippingCost)
    ) {
      order.status = "shipped";
      await order.save();

      return res.status(200).json({
        message: "Order shipped successfully",
        order,
      });
    }

    return res.status(400).json({
      message: "Card orders must be paid before shipping",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const markAsDeliveryarrived = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) throw new Error("Order not found");

    if (order.status === "delivered") {
      throw new Error("Order already delivered");
    }

    if (order.status !== "shipped") {
      throw new Error("Order is not in shipped state");
    }

    if (["cancelled", "failed", "returned"].includes(order.status)) {
      throw new Error("Order already finalized");
    }

    if (order.paymentMethod === "cash") {
      order.isPaid = true;
      order.paidAmount = order.totalPrice;
      order.finalCollected = order.totalPrice;
    } else if (order.paymentMethod === "card") {
      order.finalCollected = order.totalPrice;
    }

    order.status = "delivered";

    await order.save();

    res.json({
      message: "Order delivered successfully",
      order,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

export const markAsDeliveryFailed = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) throw new Error("Order not found");

    if (order.status !== "shipped") {
      throw new Error("Only shipped orders can be marked as delivery failed");
    }

    for (const item of order.products) {
      await Product.updateOne(
        { _id: item.product },
        { $inc: { stock: item.quantity } },
      );
    }

    if (order.paymentMethod === "card") {
      order.refundAmount = order.totalPrice - order.shippingCost;
      order.finalCollected = order.shippingCost;

      order.refundStatus = "requested";
    } else if (order.paymentMethod === "cash") {
      order.refundAmount = 0;
      order.finalCollected = order.shippingCost;

      order.refundStatus = "none";
    }

    order.status = "failed";
    order.isPaid = false;

    order.penalty = order.shippingCost;

    await order.save();

    res.json({ message: "Order marked as delivery failed", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const { pagenumber, perpageproduct, status, user } = req.query;

    const page = pagenumber ? Number(pagenumber) : 1;
    const limit = perpageproduct ? Number(perpageproduct) : 10;

    if (isNaN(page) || page < 1) {
      return res.status(400).json({
        message: "Error: please enter a correct page number",
      });
    }

    if (isNaN(limit) || limit < 1) {
      return res.status(400).json({
        message: "Error: please enter a correct limit",
      });
    }

    const skip = (page - 1) * limit;

    let filter = { isDeleted: false };

    if (status) {
      filter.status = status;
    }

    if (user) {
      filter.user = user;
    }

    const totalOrders = await Order.countDocuments(filter);

    const orders = await Order.find(filter)
      .populate("user", "name email")
      .populate("products.product", "productName price")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Orders fetched successfully",
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
      totalOrders,
      results: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching orders",
      error: error.message,
    });
  }
};

export const getSingleOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({ _id: id, isDeleted: false })
      .populate("user", "name email")
      .populate("products.product", "productName price");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json({
      message: "Order fetched successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching order",
      error: error.message,
    });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { address, paymentMethod, products } = req.body;

    const order = await Order.findById(id);
    if (!order || order.isDeleted) {
      return res.status(404).json({ message: "Order not found or deleted" });
    }

    if (
      ["shipped", "delivered", "cancelled", "failed", "returned"].includes(
        order.status,
      )
    ) {
      return res
        .status(400)
        .json({ message: `Cannot update order in status ${order.status}` });
    }

    if (address) order.address = address;
    if (paymentMethod) order.paymentMethod = paymentMethod;

    if (products) {
      for (const item of order.products) {
        await Product.updateOne(
          { _id: item.product },
          { $inc: { stock: item.quantity } },
        );
      }

      let totalPrice = 0;
      const orderProducts = [];

      for (const item of products) {
        const product = await Product.findById(item.product);
        if (!product) throw new Error(`Product not found: ${item.product}`);
        if (product.stock < item.quantity)
          throw new Error(`Not enough stock for ${product.productName}`);

        const price = product.price;
        totalPrice += price * item.quantity;

        orderProducts.push({
          product: product._id,
          quantity: item.quantity,
          price: price,
        });

        await Product.updateOne(
          { _id: product._id },
          { $inc: { stock: -item.quantity } },
        );
      }

      order.products = orderProducts;
      order.totalPrice = totalPrice;
    }

    await order.save();

    res.status(200).json({ message: "Order updated successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id, isDeleted: false });

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        message: "No orders found for this user",
        orders: [],
      });
    }

    res.status(200).json({
      message: "User orders fetched successfully",
      orders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user orders",
      error: error.message,
    });
  }
};

export const softDeleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    );
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ message: "Order soft deleted", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const hardDeleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ message: "Order permanently deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const restoreOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByIdAndUpdate(
      id,
      { isDeleted: false },
      { new: true },
    );
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ message: "Order restored successfully", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserOrderHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status, pageNumber, perPage } = req.query;

    const page = pageNumber ? Number(pageNumber) : 1;
    const limit = perPage ? Number(perPage) : 10;
    const skip = (page - 1) * limit;

    if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
      return res.status(400).json({ message: "Invalid pagination values" });
    }

    let query = { user: userId, isDeleted: false };
    if (status) query.status = status;

    const totalOrders = await Order.countDocuments(query);

    const orders = await Order.find(query)
      .populate("products.product", "productName price")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found", orders: [] });
    }

    res.status(200).json({
      message: "User orders fetched successfully",
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
      totalOrders,
      results: orders.length,
      orders,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getOrderStatus = async (req, res) => {
  try {
    const id = req.params.id;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ status: order.status });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (
      ["cancelled", "failed", "returned", "delivered"].includes(order.status)
    ) {
      return res.status(400).json({ message: "Order already finalized" });
    }

    let refundAmount = 0;
    let finalCollected = 0;
    let penalty = 0;

    if (order.status !== "shipped") {
      if (order.paymentMethod === "card") {
        refundAmount =
          order.paidAmount > 0 ? order.paidAmount : order.totalPrice;
        finalCollected = 0;
      } else if (order.paymentMethod === "cash") {
        refundAmount = order.paidAmount > 0 ? order.shippingCost : 0;
        finalCollected = 0;
      }
    } else {
      if (order.paymentMethod === "card") {
        refundAmount = order.totalPrice - order.shippingCost;
        finalCollected = order.shippingCost;
        penalty = order.shippingCost;
      } else if (order.paymentMethod === "cash") {
        refundAmount = 0;
        finalCollected = order.shippingCost;
        penalty = order.shippingCost;
      }
    }

    for (const item of order.products) {
      await Product.updateOne(
        { _id: item.product },
        { $inc: { stock: item.quantity } },
      );
    }

    order.status = "cancelled";

    if (
      order.isPaid ||
      order.paymentMethod === "card" ||
      (order.paymentMethod === "cash" && order.paidAmount > 0)
    ) {
      order.isPaid = false;
      order.refundStatus = "requested";
      order.refundAmount = refundAmount;
    }

    order.finalCollected = finalCollected;
    order.penalty = penalty;

    await order.save();

    res.json({ message: "Order cancelled successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const completeRefund = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) throw new Error("Order not found");

    if (order.refundStatus !== "requested") {
      throw new Error("Refund not requested or already completed");
    }

    if (order.refundAmount === undefined || order.refundAmount === null) {
      if (order.paymentMethod === "card") {
        order.refundAmount = order.paidAmount - order.shippingCost;
      } else if (order.paymentMethod === "cash") {
        order.refundAmount = order.paidAmount;
      }
    }

    if (order.finalCollected === undefined || order.finalCollected === null) {
      if (order.paymentMethod === "card") {
        order.finalCollected = order.totalPrice - order.refundAmount;
      } else if (order.paymentMethod === "cash") {
        order.finalCollected = order.paidAmount - order.refundAmount;
      }
    }

    order.refundStatus = "completed";
    order.isPaid = false;

    await order.save();

    res.json({ message: "Refund completed successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const returnOrder = async (req, res) => {
  try {
    const { id } = req.params.id;
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status !== "delivered") {
      return res
        .status(400)
        .json({ message: "Only delivered orders can be returned" });
    }

    for (const item of order.products) {
      await Product.updateOne(
        { _id: item.product },
        { $inc: { stock: item.quantity } },
      );
    }

    let refundAmount = order.totalPrice - order.shippingCost;
    let finalCollected = order.shippingCost;
    let penalty = order.shippingCost;

    order.status = "returned";
    order.isPaid = false;
    order.refundStatus = "requested";
    order.refundAmount = refundAmount;
    order.finalCollected = finalCollected;
    order.penalty = penalty;

    await order.save();

    res.json({ message: "Order returned successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const failOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) throw new Error("Order not found");

    if (
      ["cancelled", "failed", "delivered", "returned"].includes(order.status)
    ) {
      throw new Error("Order already finalized");
    }

    for (const item of order.products) {
      await Product.updateOne(
        { _id: item.product },
        { $inc: { stock: item.quantity } },
      );
    }

    order.status = "failed";
    order.isPaid = false;
    order.refundStatus = "requested";

    if (
      !order.paidAmount ||
      (order.paymentMethod === "cash" && order.paidAmount === 0)
    ) {
      order.refundAmount = 0;
      order.finalCollected = 0;
    } else {
      if (order.paymentMethod === "card") {
        order.refundAmount = order.paidAmount - order.shippingCost;
      } else if (order.paymentMethod === "cash") {
        order.refundAmount = 0;
        order.finalCollected = order.shippingCost;
      }
    }

    await order.save();

    res.json({ message: "Order marked as failed", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
