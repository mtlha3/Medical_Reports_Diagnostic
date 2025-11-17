const axios = require("axios");
const FormData = require("form-data");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

exports.uploadMiddleware = upload.single("image");

// ---------------- CONTROLLER FUNCTION ----------------
exports.predictImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const form = new FormData();
    form.append("image", req.file.buffer, {
      filename: req.file.originalname || "upload.jpg",
      contentType: req.file.mimetype,
      knownLength: req.file.size
    });

    const flaskURL = "http://127.0.0.1:5000/predict_full";

    const response = await axios.post(flaskURL, form, {
      headers: form.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    return res.status(200).json(response.data);
  } catch (err) {
    console.error("Error forwarding to Flask:", err.message);

    if (err.response && err.response.data) {
      return res.status(err.response.status).json(err.response.data);
    }

    return res.status(500).json({ error: "Error connecting to Flask API" });
  }
};
