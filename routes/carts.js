const Cart = require("../models/Cart");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifytoken");

const router = require("express").Router();

//CREATE

router.post("/", verifyToken, async (req, res) => {
  const newCart = new Cart(req.body);

  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});
// CLEAR USER CART
router.put("/clear/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const clearedCart = await Cart.findOneAndUpdate(
      { userId: req.params.userId },
      { $set: { products: [] } },  // Use an empty array to clear products
      { new: true }
    );
    res.status(200).json(clearedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});


router.put("/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedCart = await Cart.findOneAndUpdate(
      { userId: req.params.userId },
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:productId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    // Assuming you're using Mongoose as the ODM
    await Cart.products.findOneAndDelete({ productId: req.params.productId });

    res.status(200).json("Product from Cart has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});


//GET USER CART
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// //GET ALL

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;