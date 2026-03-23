import Product from "../products/products.schema.js";

export const createProduct = async (req, res) => {
  try {
    const { productName, description, price, discount, category, stock } = req.body;

    const existingProduct = await Product.findOne({ productName, isDeleted: false });
    if (existingProduct) {
      return res.status(400).json({ message: "Product already exists and is active" });
    }

    const imagesPaths = req.files ? req.files.map(file => file.path) : [];

    const product = new Product({
      productName,
      description,
      price,
      discount,
      images: imagesPaths,
      category,
      stock
    });

    await product.save();
    return res.status(201).json({ message: "Product created successfully", product });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const { 
      name, 
      minPrice, 
      maxPrice, 
      discount, 
      rating, 
      pagenumber, 
      perpageproduct, 
      sortBy = "createdAt", 
      order = "desc" 
    } = req.query;

    const allowedSort = ["price", "createdAt", "rating"];

    if (!allowedSort.includes(sortBy)) {
      return res.status(400).json({ message: "Invalid sort field" });
    }

    const page = Math.max(1, Number(pagenumber) || 1);
    const limit = Math.max(1, Number(perpageproduct) || 10);
    const skip = (page - 1) * limit;

    const filter = { isDeleted: false };

    if (name) {
      filter.productName = { $regex: name, $options: "i" };
    }

    if (minPrice || maxPrice) {
      const min = Number(minPrice);
      const max = Number(maxPrice);

      if ((minPrice && isNaN(min)) || (maxPrice && isNaN(max))) {
        return res.status(400).json({ message: "minPrice and maxPrice must be valid numbers" });
      }

      if (minPrice && maxPrice && min > max) {
        return res.status(400).json({ message: "minPrice cannot be greater than maxPrice" });
      }

      filter.price = {};
      if (minPrice) filter.price.$gte = min;
      if (maxPrice) filter.price.$lte = max;
    }

    if (discount) {
      const disc = Number(discount);
      if (isNaN(disc)) {
        return res.status(400).json({ message: "Discount must be a valid number" });
      }
      filter.discount = { $gte: disc };
    }

    if (rating) {
      const rat = Number(rating);
      if (isNaN(rat)) {
        return res.status(400).json({ message: "Rating must be a valid number" });
      }
      filter.rating = { $gte: rat };
    }

    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: order === "desc" ? -1 : 1 });

    return res.status(200).json({
      message: "Products fetched successfully",
      totalProducts: total,
      page,
      totalPages: Math.ceil(total / limit),
      products
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product || product.isDeleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ message: "Product fetched successfully", product });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const softDeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found or already deleted" });
    }

    return res.status(200).json({ message: "Product soft deleted", product });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const hardDeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(204).send();

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const allowedUpdates = [
      "productName",
      "description",
      "price",
      "discount",
      "images",
      "category",
      "stock"
    ];

    const updates = {};

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (req.files && req.files.length > 0) {
      updates.images = req.files.map(file => file.path);
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const price = updates.price ?? product.price;
    const discount = updates.discount ?? product.discount;

    updates.finalPrice = price - (price * discount / 100);

    Object.assign(product, updates);
    await product.save();

    return res.status(200).json({ message: "Product updated successfully", product });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const restoreProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOneAndUpdate(
      { _id: id, isDeleted: true },
      { isDeleted: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found or already active" });
    }

    return res.status(200).json({ message: "Product restored successfully", product });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const addTutorial = async (req, res) => {
  try {
    const { id } = req.params;
    const { tutorial } = req.body;

    if (!tutorial || typeof tutorial !== "string") {
      return res.status(400).json({ message: "Tutorial is required" });
    }

       const product = await Product.findByIdAndUpdate(
      id,
  { $push: { tutorials: { $each: tutorial } } },
  { new: true }
    );


    return res.status(201).json({ message: "Tutorial added", product });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateTutorial = async (req, res) => {
  try {
    const { id, index } = req.params;
    const { tutorial } = req.body;

    if (!tutorial || typeof tutorial !== "string") {
      return res.status(400).json({ message: "Tutorial is required" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const idx = Number(index);

    if (isNaN(idx) || idx < 0 || idx >= product.tutorials.length) {
      return res.status(400).json({ message: "Invalid tutorial index" });
    }

    product.tutorials[idx] = tutorial;
    await product.save();

    return res.status(200).json({ message: "Tutorial updated", product });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const deleteTutorial = async (req, res) => {
  try {
    const { id, index } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const idx = Number(index);

    if (isNaN(idx) || idx < 0 || idx >= product.tutorials.length) {
      return res.status(400).json({ message: "Invalid tutorial index" });
    }

    product.tutorials.splice(idx, 1);
    await product.save();

    return res.status(200).json({ message: "Tutorial deleted", product });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const addChallenge = async (req, res) => {
  try {
    const { id } = req.params;
    const { challenge } = req.body;

    if (!challenge || typeof challenge !== "string") {
      return res.status(400).json({ message: "Challenge is required" });
    }

    const product = await Product.findByIdAndUpdate(
      id,

  { $push: { challenges: { $each: challenges } } },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ message: "Challenge added", product });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateChallenge = async (req, res) => {
  try {
    const { id, index } = req.params;
    const { challenge } = req.body;

    if (!challenge || typeof challenge !== "string") {
      return res.status(400).json({ message: "Challenge is required" });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const idx = Number(index);

    if (isNaN(idx) || idx < 0 || idx >= product.challenges.length) {
      return res.status(400).json({ message: "Invalid challenge index" });
    }

    product.challenges[idx] = challenge;
    await product.save();

    return res.status(200).json({ message: "Challenge updated", product });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteChallenge = async (req, res) => {
  try {
    const { id, index } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const idx = Number(index);

    if (isNaN(idx) || idx < 0 || idx >= product.challenges.length) {
      return res.status(400).json({ message: "Invalid challenge index" });
    }

    product.challenges.splice(idx, 1);
    await product.save();

    return res.status(200).json({ message: "Challenge deleted", product });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const getChallengesByProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).select("challenges");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ 
      message: "Challenges retrieved successfully", 
      challenges: product.challenges 
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const getTutorialsByProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).select("tutorials");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: "Tutorials retrieved successfully",
      tutorials: product.tutorials
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
