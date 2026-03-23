
import Product from "../products/products.schema.js";
import Order from "./orders.schema.js";

export const createOrder = async (req, res) => {
  try {
    const { products, address, paymentMethod } = req.body;

    let totalPrice = 0;
    let orderProducts = [];

    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product) throw new Error(`Product not found: ${item.product}`);
      if (product.stock < item.quantity) {
        throw new Error(`Not enough stock for ${product.productName}`);
      }

      const price = product.finalPrice ?? product.price;
      totalPrice += price * item.quantity;

      orderProducts.push({
        product: product._id,
        quantity: item.quantity,
        price: price 
      });

      // تحديث المخزون بدون transaction
      await Product.updateOne(
        { _id: product._id },
        { $inc: { stock: -item.quantity } }
      );
    }

    const order = await Order.create({
      user: req.user._id,
      products: orderProducts,
      totalPrice,
      address,
      paymentMethod,
      isPaid: false,
      status: "pending"
    });

    return res.status(201).json({ message: "Order created successfully", order });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
export const confirmPayment = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order || order.isDeleted) {
      return res.status(404).json({ message: "Order not found or deleted" });
    }

    if (order.isPaid) {
      return res.status(400).json({ message: "Order already paid" });
    }

    if (["cancelled", "failed", "returned"].includes(order.status)) {
      return res.status(400).json({ message: "Cannot pay this order" });
    }
if (order.paymentMethod === "cash") {
  return res.status(400).json({ message: "Cash orders are paid on delivery" });
}
    order.isPaid = true;
    if (order.status === "pending") {
      order.status = "paid";
    }
    await order.save();

    return res.status(200).json({
      message: "Payment confirmed successfully",
      order
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
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
      (order.paymentMethod === "cash" && order.status === "pending")
    ) {
      order.status = "shipped";
      await order.save();

      return res.status(200).json({
        message: "Order shipped successfully",
        order
      });
    }

    return res.status(400).json({
      message: "Card orders must be paid before shipping"
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};
export const deliverOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentReceived } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "shipped") {
      return res.status(400).json({ message: "Order must be shipped before delivery" });
    }

    if (["cancelled", "returned", "failed"].includes(order.status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    if (order.paymentMethod === "card" && !order.isPaid) {
      return res.status(400).json({
        message: "Order must be paid before delivery"
      });
    }

    if (order.paymentMethod === "cash") {

      if (!paymentReceived) {

        for (const item of order.products) {
          await Product.updateOne(
            { _id: item.product },
            { $inc: { stock: item.quantity } }
          );
        }

        order.status = "failed";
        await order.save();

        return res.status(400).json({
          message: "Payment not received, order marked as failed",
          order
        });
      }

      // ✅ دفع
      order.isPaid = true;
    }

    order.status = "delivered";
    await order.save();

    return res.status(200).json({
      message: "Order delivered successfully",
      order
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const getAllOrders = async (req, res) => {
  try {
    const {
      pagenumber,
      perpageproduct,
      status,
      user
    } = req.query;

    const page = pagenumber ? Number(pagenumber) : 1;
    const limit = perpageproduct ? Number(perpageproduct) : 10;

    if (isNaN(page) || page < 1) {
      return res.status(400).json({
        message: "Error: please enter a correct page number"
      });
    }

    if (isNaN(limit) || limit < 1) {
      return res.status(400).json({
        message: "Error: please enter a correct limit"
      });
    }

    const skip = (page - 1) * limit;

    let filter =  { isDeleted: false };

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
      orders
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching orders",
      error: error.message
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
        message: "Order not found"
      });
    }

    res.status(200).json({
      message: "Order fetched successfully",
      order
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching order",
      error: error.message
    });
  }
};
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({  user: req.user._id, isDeleted: false  });

    res.status(200).json({
      message: "User orders fetched successfully",
      orders
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching user orders",
      error: error.message
    });
  }
};
export const softDeleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ message: "Order soft deleted", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const hardDeleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ message: "Order permanently deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const restoreOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { isDeleted: false },
      { new: true }
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
    const { status } = req.query; 

    let query = { user: userId };

    if (status) {
      query.status = status;
    }

    query.isDeleted = false;

    const orders = await Order.find(query)
      .populate("products.product", "productName price")

    res.status(200).json({ orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;


    const order = await Order.findById(orderId);

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
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (["cancelled", "failed", "delivered", "returned"].includes(order.status)) {
      return res.status(400).json({ message: "Order already finalized" });
    }

    if (["delivered", "returned"].includes(order.status)) {
      return res.status(400).json({
        message: `Cannot cancel an order that is ${order.status}`
      });
    }

    order.status = "cancelled";

    for (const item of order.products) {
      await Product.updateOne(
        { _id: item.product },
        { $inc: { stock: item.quantity } }
      );
    }

    if (order.isPaid) {
      order.isPaid = false;
      order.refundStatus = "requested";
    }

    await order.save();

    res.json({ message: "Order cancelled successfully", order });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const returnOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status !== "delivered") {
      return res.status(400).json({ message: "Only delivered orders can be returned" });
    }

    order.status = "returned";
    order.isPaid = false;
    order.refundStatus = "requested";

    for (const item of order.products) {
      await Product.updateOne(
        { _id: item.product },
        { $inc: { stock: item.quantity } }
      );
    }

    await order.save();

    res.json({ message: "Order returned successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const failOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (["cancelled", "failed", "delivered", "returned"].includes(order.status)) {
      return res.status(400).json({ message: "Order already finalized" });
    }

    if (!["pending", "paid", "shipped"].includes(order.status)) {
      return res.status(400).json({
        message: `Cannot mark order as failed in status ${order.status}`
      });
    }

    order.status = "failed";

    for (const item of order.products) {
      await Product.updateOne(
        { _id: item.product },
        { $inc: { stock: item.quantity } }
      );
    }

    if (order.isPaid) {
      order.isPaid = false;
      order.refundStatus = "requested";
    }

    await order.save();

    res.json({ message: "Order marked as failed", order });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const completeRefund = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.refundStatus !== "requested") {
      return res.status(400).json({ message: "Refund not requested or already completed" });
    }

    order.refundStatus = "completed";
    await order.save();

    res.json({ message: "Refund completed successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
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

    if (["shipped", "delivered", "cancelled", "failed", "returned"].includes(order.status)) {
      return res.status(400).json({ message: `Cannot update order in status ${order.status}` });
    }

    if (address) order.address = address;
    if (paymentMethod) order.paymentMethod = paymentMethod;

    if (products) {
      for (const item of order.products) {
        await Product.updateOne(
          { _id: item.product },
          { $inc: { stock: item.quantity } }
        );
      }

      let totalPrice = 0;
      const orderProducts = [];

      for (const item of products) {
        const product = await Product.findById(item.product);
        if (!product) throw new Error(`Product not found: ${item.product}`);
        if (product.stock < item.quantity) throw new Error(`Not enough stock for ${product.productName}`);

        const price = product.finalPrice ?? product.price;
        totalPrice += price * item.quantity;

        orderProducts.push({
          product: product._id,
          quantity: item.quantity,
          price: price
        });

        await Product.updateOne(
          { _id: product._id },
          { $inc: { stock: -item.quantity } }
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

export const getUserTutorials = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({ user: userId, isDeleted: false })
      .populate("products.product", "productName tutorials");

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    const tutorials = [];
    orders.forEach(order => {
      order.products.forEach(item => {
        if (item.product.tutorials && item.product.tutorials.length > 0) {
          tutorials.push({
            productName: item.product.productName,
            tutorials: item.product.tutorials
          });
        }
      });
    });

    if (tutorials.length === 0) {
      return res.status(404).json({ message: "No tutorials available for purchased products" });
    }

    res.status(200).json({
      message: "User tutorials fetched successfully",
      tutorials
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};