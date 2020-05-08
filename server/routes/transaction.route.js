import express from "express";
import jwt from "jsonwebtoken";
import transactionModel from "../models/transactionModel";
import config from "../config/config";
let router = express.Router();

const checkForErrors = ({ title, author, body }) => {
  let errors = {};
  let isValid = false;
  if (title === "") {
    console.log(title, "title=======");
    errors = { ...errors, title: "This field is required" };
  }
  if (author === "") {
    console.log(author, "author=======");
    errors = { ...errors, author: "This field is required" };
  }
  if (body === "") {
    console.log(body, "body=======");
    errors = { ...errors, body: "This field is required" };
  }

  if (Object.keys(errors).length > 0) {
    return { isValid, errors };
  }
  isValid = true;
  return { isValid, errors };
};

const isAuthenticated = (req, res, next) => {
  const authorizationHeader = req.headers["authorization"];
  const authorizationToken = authorizationHeader.split(" ")[1];
  if (authorizationToken) {
    jwt.verify(authorizationToken, config.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(401).json({ error: "Failed to authenticate" });
      } else {
        req.authorId = decoded.id;
        next();
      }
    });
  } else {
    res.status(403).json({ error: "No token provided" });
  }
};

router.get("/", (req, res) => {
  transactionModel.find({}, (err, articles) => {
    res.json({ articles });
  });
});

router.get("/myarticles", isAuthenticated, (req, res) => {
  transactionModel.find({ authorId: req.authorId }, (err, articles) => {
    if (err) throw err;
    res.json({ articles });
  });
});

router.get("/report", (req, res) => {
  console.log(req.query, "Params");
  if (req.query.date) {
    transactionModel
      .aggregate([
        { $match: { addedOn: { $gte: new Date(req.query.date) } } },
        {
          $group: {
            _id: {
              author: "$author"
            },
            totalAmount: { $sum: "$amount" },
            count: { $sum: 1 }
          }
        }
      ])
      .exec((err, data) => {
        if (err) {
          throw err;
          console.log(err);
        }
        res.json({ data });
      });
  } else {
    res.json({});
  }
});

router.get("/:id", (req, res) => {
  transactionModel.findById(req.params.id, (err, article) => {
    if (err) throw err;
    res.json({ article });
  });
});

router.post("/add", isAuthenticated, (req, res) => {
  const { title, author, body, amount } = req.body;
  const authorId = req.authorId;

  const { isValid, errors } = checkForErrors({ title, author, body, amount });

  if (isValid) {
    const newData = new transactionModel({
      title: title,
      author: author,
      body: body,
      amount: amount,
      authorId: authorId
    });

    newData.save(err => {
      if (err) throw err;
      else {
        res.json({ success: "success" });
      }
    });
  } else {
    res.json({ errors });
  }
});

router.post("/edit/:id", isAuthenticated, (req, res) => {
  const { title, author, body, amount, authorId } = req.body;

  const { isValid, errors } = checkForErrors({ title, author, body, amount });

  if (isValid) {
    transactionModel.findByIdAndUpdate(req.params.id, req.body, err => {
      if (err) throw err;
      else res.json({ success: "success" });
    });
  } else {
    res.json({ errors });
  }
});

router.delete("/delete/:id", isAuthenticated, (req, res) => {
  transactionModel.remove({ _id: req.params.id }, err => {
    res.json({ success: "success" });
  });
});

module.exports = router;
