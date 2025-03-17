const multer = require('multer');
const cloudinary = require("../config/cloudinary");
const Product = require("../models/productSchema");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('image');

const addProduct = async (req, res) => {
  const { productName, description, price, sizes } = req.body;
  const image = req.file;

  console.log("Request Body:", req.body);
  console.log("Uploaded Image:", image);

  let sizesArray = Array.isArray(sizes) ? sizes : sizes.split(",").map((size) => size.trim());


  const validSizes = sizesArray.every((size) =>
    ["XS", "S", "M", "L", "XL", "XXL"].includes(size)
  );

  if (!validSizes) {
    return res.status(400).json({
      message: "Invalid size(s) provided. Allowed sizes are XS, S, M, L, XL, XXL.",
    });
  }

  if (!productName || !description || !price || !sizesArray || !image) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const cloudinaryResult = await cloudinary.uploader.upload(
      `data:${image.mimetype};base64,${image.buffer.toString("base64")}`,
      {
        folder: "products",
        use_filename: true,
        unique_filename: true,
        resource_type: "image",
      }
    );

    const newProduct = new Product({
      productName,
      description,
      price,
      sizes: sizesArray, 
      imageUrl: cloudinaryResult.secure_url,
    });

    await newProduct.save();

    return res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Error creating product",
      error: err.message,
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json(products);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Error fetching products",
      error: err.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(product);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Error fetching product",
      error: err.message,
    });
  }
};



module.exports = { upload, addProduct, getAllProducts, getProductById };