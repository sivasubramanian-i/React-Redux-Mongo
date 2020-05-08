import mongoose from "mongoose";
import _ from "lodash";
import config from "./config";

console.log("config From MODELS---->", config);

mongoose.connect(config.MONGO_PATH, {
  useFindAndModify: false,
  useUnifiedTopology: true,
  useNewUrlParser: true
});
// test
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", () => {
  console.log("db Connected ---->>>>>>>>");
});

module.exports = _.extend(
  {
    mongoose
  },
  db
);
