const multer = require('multer');
const cloudinary = require("../config/cloudinary");
const Product = require("../models/productSchema");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('image');

// Create Product
// const addProduct = async (req, res) => {
//     const { productName, description, price, sizes } = req.body;
//     const image = req.file;

//     console.log("Request Body:", req.body);
//     console.log("Uploaded File:", image);
//     console.log("Cloudinary Config:", cloudinary.config()); //verify config

//     // Validate that all fields are provided
//     if (!productName || !description || !price || !sizes || !image) {
//         return res.status(400).json({ message: "All fields are required." });
//     }

//     try {
//         const cloudinaryResult = await cloudinary.uploader.upload(`data:${image.mimetype};base64,${image.buffer.toString('base64')}`, {
//             folder: "products",
//             use_filename: true,
//             unique_filename: true,
//             resource_type: "image",
//         });

//         const newProduct = new Product({
//             productName: productName,
//             description,
//             price,
//             sizes,
//             imageUrl: cloudinaryResult.secure_url,
//         });

//         await newProduct.save();

//         return res.status(201).json({
//             message: "Product created successfully",
//             product: newProduct,
//         });
//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({
//             message: "Error creating product",
//             error: err.message,
//         });
//     }
// };
// const addProduct = async (req, res) => {
//   const { productName, description, price, sizes } = req.body; // Ensure sizes is an array
//   const image = req.file;

//   console.log("Request Body:", req.body);
//   console.log("Sizes Array:", sizes); // Log sizes to see what is being sent

//   if (!productName || !description || !price || !sizes || !image) {
//     return res.status(400).json({ message: "All fields are required." });
//   }

//   // Ensure that sizes is an array (in case it comes as a comma-separated string)
//   let sizesArray = Array.isArray(sizes) ? sizes : sizes.split(",").map(size => size.trim());

//   // Log to see the array format
//   console.log("Parsed Sizes Array:", sizesArray);

//   // Validate sizes - Ensure sizes are valid
//   const validSizes = sizesArray.every((size) =>
//     ["XS", "S", "M", "L", "XL", "XXL"].includes(size)
//   );

//   if (!validSizes) {
//     return res.status(400).json({
//       message: "Invalid size(s) provided. Allowed sizes are XS, S, M, L, XL, XXL.",
//     });
//   }

//   try {
//     const cloudinaryResult = await cloudinary.uploader.upload(
//       `data:${image.mimetype};base64,${image.buffer.toString("base64")}`,
//       {
//         folder: "products",
//         use_filename: true,
//         unique_filename: true,
//         resource_type: "image",
//       }
//     );

//     const newProduct = new Product({
//       productName,
//       description,
//       price,
//       sizes: sizesArray, // Store the validated sizes array
//       imageUrl: cloudinaryResult.secure_url,
//     });

//     await newProduct.save();

//     return res.status(201).json({
//       message: "Product created successfully",
//       product: newProduct,
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({
//       message: "Error creating product",
//       error: err.message,
//     });
//   }
// };

const addProduct = async (req, res) => {
  const { productName, description, price, sizes } = req.body;
  const image = req.file;

  console.log("Request Body:", req.body);
  console.log("Uploaded Image:", image);

  // Ensure that sizes is an array (if it is not already)
  let sizesArray = Array.isArray(sizes) ? sizes : sizes.split(",").map((size) => size.trim());

  // Validate sizes - Ensure sizes are valid
  const validSizes = sizesArray.every((size) =>
    ["XS", "S", "M", "L", "XL", "XXL"].includes(size)
  );

  if (!validSizes) {
    return res.status(400).json({
      message: "Invalid size(s) provided. Allowed sizes are XS, S, M, L, XL, XXL.",
    });
  }

  // Ensure all required fields are provided
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
      sizes: sizesArray, // Store the validated sizes array
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



module.exports = { upload, addProduct };