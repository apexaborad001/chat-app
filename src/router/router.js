const express = require("express");
const router = express.Router();
const Book = require("../model/model");
const mongoose = require("mongoose");

router.get("/getallBook", async (req, res) => {
  try {
    const data = await Book.find({});
    res.send(data);
  } catch (e) {
    res.send(e);
  }
});

router.post("/createBook", async (req, res) => {
  const entities = new Book({
    bookName:req.body.bookName,
    category:req.body.category,
  });
  try {
    const data = await entities.save();
    
    res.send(data);
  } catch (e) {
    res.send(e);
  }
});

module.exports = router;
