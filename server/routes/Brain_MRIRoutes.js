const express = require("express");
const { uploadMiddleware, predictImage } = require("../controllers/Brain_MRIController");

const router = express.Router();

router.post("/predict", uploadMiddleware, predictImage);

module.exports = router;
