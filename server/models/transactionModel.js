import db from "../config/db";

const transactionSchema = new db.mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    authorId: {
      type: db.mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    body: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      default: 0
    },
    addedOn: {
      type: Date,
      default: Date.now,
      required: true
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true, minimize: false, collection: "transactions" }
);

module.exports = db.mongoose.model("transactionModel", transactionSchema);
