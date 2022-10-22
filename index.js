const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRouter = require("./routes/login");
const formInfoRouter = require("./routes/formInfo");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// DB connection
var MONGODB_URL = process.env.MONGODB_URL;

mongoose
  .connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    //don't show the log when it is test
    if (process.env.NODE_ENV !== "test") {
      console.log("Connected to %s", MONGODB_URL);
      console.log("App is running ... \n");
      console.log("Press CTRL + C to stop the process. \n");
    }
  })
  .catch((err) => {
    console.error("App starting error:", err.message);
    process.exit(1);
  });

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/form", formInfoRouter);

app.listen("8000", () => console.log("Boom!"));
