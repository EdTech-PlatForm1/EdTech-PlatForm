import Product from "../../DB/model/products.schema.js";
import Order from "../../DB/model/orders.schema.js";

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
    return res.status(200).json({ message: "Product deleted successfully" });


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

       const product = await Product.findOne({
      _id: id,
      isDeleted: false
    });

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
    const { title, videoUrl, duration } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const exists = product.tutorials.find(t => t.title === title);
    if (exists) {
      return res.status(400).json({ message: "Tutorial title already exists" });
    }

    product.tutorials.push({ title, videoUrl, duration });
    await product.save();

    return res.status(201).json({ message: "Tutorial added successfully", tutorials: product.tutorials });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const getTutorialsByProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).select("tutorials");

    if (!product || product.isDeleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: "Tutorials fetched successfully",
      tutorials: product.tutorials
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const getTutorialsForUser = async (req, res) => {
  try {
    const userId = req.user._id; 
    const { productId } = req.params;

    const order = await Order.findOne({
      user: userId,
      
      "products.product": productId,
      status: "delivered"
    });

    if (!order) {
      return res.status(403).json({
        message: "You must purchase this product to access tutorials"
      });
    }

    const product = await Product.findById(productId).select("tutorials");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: "User tutorials fetched successfully",
      tutorials: product.tutorials
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateTutorial = async (req, res) => {
  try {
    const { id, tutorialId } = req.params;
    const { title, videoUrl, duration } = req.body;

    const product = await Product.findById(id);
    if (!product || product.isDeleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    const tutorial = product.tutorials.id(tutorialId);
    if (!tutorial) return res.status(404).json({ message: "Tutorial not found" });

    const exists = product.tutorials.find(
      t => t.title === title && t._id.toString() !== tutorialId
    );
    if (exists) return res.status(400).json({ message: "Tutorial title already exists" });

    if (title) tutorial.title = title;
    if (videoUrl) tutorial.videoUrl = videoUrl;
    if (duration) tutorial.duration = duration;

    await product.save();

    return res.status(200).json({ message: "Tutorial updated successfully", tutorials: product.tutorials });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
export const deleteTutorial = async (req, res) => {
  try {
    const { id, tutorialId } = req.params;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

      const index = product.tutorials.findIndex(t => t._id.toString() === tutorialId);
    if (index === -1) return res.status(404).json({ message: "Tutorial not found" });

    product.tutorials.splice(index, 1);
    await product.save();

    return res.status(200).json({ message: "Tutorial deleted successfully", tutorials: product.tutorials });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const addChallenge = async (req, res) => {
  try {
    const { id } = req.params; 
    const { question, correctAnswer } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const exists = product.challenges.find(c => c.question === question);
    if (exists) {
      return res.status(400).json({ message: "Challenge question already exists" });
    }

    product.challenges.push({ question, correctAnswer });
    await product.save();

    return res.status(201).json({ message: "Challenge added successfully", challenges: product.challenges });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const updateChallenge = async (req, res) => {
  try {
    const { id, challengeId } = req.params;
    const { question, correctAnswer } = req.body;

    const product = await Product.findById(id);
    if (!product || product.isDeleted) return res.status(404).json({ message: "Product not found" });

    const challenge = product.challenges.id(challengeId);
    if (!challenge) return res.status(404).json({ message: "Challenge not found" });

    if (question && question !== challenge.question) {
      const exists = product.challenges.find(
        c => c.question === question && c._id.toString() !== challengeId
      );
      if (exists) return res.status(400).json({ message: "Challenge question already exists" });
      challenge.question = question;
    }

    if (question) challenge.question = question;
    if (correctAnswer) challenge.correctAnswer = correctAnswer;

    await product.save();

    return res.status(200).json({ message: "Challenge updated successfully", challenges: product.challenges });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
export const deleteChallenge = async (req, res) => {
  try {
    const { id, challengeId } = req.params; 

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const index = product.challenges.findIndex(c => c._id.toString() === challengeId);
    if (index === -1) return res.status(404).json({ message: "Challenge not found" });

    product.challenges.splice(index, 1);
    await product.save();

    return res.status(200).json({ message: "Challenge deleted successfully", challenges: product.challenges });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const getChallengesByProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).select("challenges");

    if (!product || product.isDeleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: "Challenges fetched successfully",
      challenges: product.challenges
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const getChallengesForUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    const order = await Order.findOne({
      user: userId,
      "products.product": productId,
      status: "delivered"
    });

    if (!order) {
      return res.status(403).json({
        message: "You must purchase this product to access challenges"
      });
    }

    const product = await Product.findById(productId).select("challenges");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: "User challenges fetched successfully",
      challenges: product.challenges
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const solveChallenge = async (req, res) => {
  try {
    const { id, challengeId } = req.params;
    const { answer } = req.body;

    const product = await Product.findOne({ _id: id, isDeleted: false });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const challenge = product.challenges.id(challengeId); 
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    const isCorrect = challenge.correctAnswer === answer;

    res.status(200).json({
      correct: isCorrect,
      message: isCorrect ? "Correct answer" : "Wrong answer"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};