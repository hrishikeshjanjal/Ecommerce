const { Mongoose } = require("mongoose");

const mongoose = require("mongoose");
const product = require("./product");
const { ObjectId } = mongoose.Schema;

const ProductCartSchema = new mongoose.Schema({
  product: {
    type: ObjectId,
    ref: "Product",
  },
  name: String,
  count: Number,
  price: Number,
});

//productCartSchema export
const ProductCart = mongoose.model("ProductCart", ProductCartSchema);

const orderSchema = new mongoose.Schema(
  {
    products: [ProductCartSchema], //array of profucts in the cart!
    transaction_id: {},
    amount: { type: Number },
    address: String,
    status: {
      type: String,
      default: "processing",
      enum: ["cancelled", "delivered", "shipped", "processing", "recieved"],
    },
    updated: Date, //for admin purpose
    user: {
      //who placed a order so user type required
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

//oderSchema export
const Order = mongoose.model("Order", orderSchema); //name of the current file Order to epxort

module.exports = { Order, ProductCart }; //export both above orderSchema and ProductCartSchema
