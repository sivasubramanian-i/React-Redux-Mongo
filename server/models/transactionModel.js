import db from "../config/db";

const transactionSchema = new db.mongoose.Schema(
  {
    
    authorId: {
      type: db.mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    title: {
      type: String,
      required: true
    },
    author: {
      type: String,
      default: null
    },
    description: {
      type: String,
      default: null
    },
    amount: {
      type: Number,
      default: 0
    },
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true, minimize: false, collection: "transactions" }
);

module.exports = db.mongoose.model("transactionModel", transactionSchema);
