import db from "../config/db";

const productSchema = new db.mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true, minimize: false, collection: "products" }
);

module.exports = db.mongoose.model("productModel", productSchema);
