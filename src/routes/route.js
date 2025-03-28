const express = require("express");
const router = express.Router();
const {
  register,
  login,
  refreshToken,
} = require("../controllers/authController");
// const { verifyJWT, verifyAdmin } = require('../middlewares');
// const { verifyJWT } = require('../middlewares/verifyJWT');
const { verifyAdmin } = require("../middlewares/authMiddleware");
const {
  upload,
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  viewProduct,
  logOut
} = require("../controllers/productController");

router.post("/register", register);

router.post("/login", login);
router.post("/logout", logOut);

router.post("/product", upload, addProduct);
router.get("/product", getAllProducts);
router.get("/product/:id", getProductById);
router.put("/product/:id", upload, updateProduct);
router.delete("/product/:id", deleteProduct);
router.get("/product/view/:id", viewProduct);


router.get("/dashboard", verifyAdmin, (req, res) => {
  res.json({ message: "Welcome to the admin dashboard!" });
});

router.post("/refresh-token", refreshToken);

module.exports = router;
