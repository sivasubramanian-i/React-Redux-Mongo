import express from "express";
import productModel from "../models/productModel";
let router = express.Router();

router.get("/", (req, res) => {
  productModel.find({}, (err, products) => {
    if (err) throw err;
    res.json({ products });
  });
});

module.exports = router;
