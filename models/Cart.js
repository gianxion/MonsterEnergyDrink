const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    userId: { type: String, required: true, unique: true },
    products: [
      {
        img: {
          type: String,
        },

        title: {
          type: String,
        },
        productId: {
          type: String,
        },
        price: {
          type: Number,
          
        },        
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);
