const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mssql = require("mssql");
const connectDB = require("./utils/connectDB");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api", require("./routes/authRouter"));
app.use("/api", require("./routes/userRouter"));
app.use("/api", require("./routes/itemPriceRouter"));

(async () => {
  try {
    mssql.connect(connectDB);
    console.log("Connected to database mssql.");
  } catch (err) {
    console.log(err.message);
  }
})();

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
