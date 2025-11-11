const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./db/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const blogRoutes = require("./routes/blogRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/blogs", blogRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
