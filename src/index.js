require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const router = require("./routes/user.route");
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_DB_URL);
mongoose.connection.on("open", () => console.log("Handshake Established"));
mongoose.connection.on("err", (err) => console.log(err));

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`App running on http://localhost:${PORT}`);
});
