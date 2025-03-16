require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const router = require("./routes/route");
const PORT = process.env.PORT || 3000;

// Database connection
mongoose.connect(process.env.MONGO_DB_URL);
mongoose.connection.on("open", () => console.log("Handshake Established"));
mongoose.connection.on("err", (err) => console.log(err));

// Middleware
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration: allow multiple origins (both localhost:3000 and localhost:5174)
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = ["https://store-server-6lv5.onrender.com", "http://localhost:5174"];
      if (allowedOrigins.includes(origin) || origin === undefined || origin === null) {
        callback(null, true);
      } else {
        callback(new Error('CORS policy: Origin not allowed'), false);
      }
    },
    credentials: true,
  })
);

// Handle preflight requests (OPTIONS)
app.options('*', cors());

// API routes
app.use("/api", router);

// Start server
app.listen(PORT, () => {
  console.log(`App running on http://localhost:${PORT}`);
});