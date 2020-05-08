import express from "express";
import path from "path";
import cors from "cors";

import db from "./config/db";
import transactionRoutes from "./routes/transaction.route";
import customerRoutes from "./routes/customer.route";
import productRoutes from "./routes/product.route";
require("dotenv").config();

const PORT = process.env.PORT || 4000;

let app = express();

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "client/build")));
// For Cross origin
app.use(cors());
// Router Match
app.use("/api/transaction", transactionRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/product", productRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  //   res.render('error');
});

app.listen(PORT, () => {
  console.log("Server started on port", PORT);
});
