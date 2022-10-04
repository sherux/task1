const express = require("express");
const mongoose = require("mongoose");
const app = express();
PORT = process.env.PORT || 3000;
const router = require("./routes/route");
//------------------------------------------- middleware---------------------------
app.use("/uploads", express.static("uploads"));
app.use(express.json());
// const router = require("./routes/route");
app.use("/api/users", router);

// -----------------------------------connect to the database----------------------

mongoose
  .connect("mongodb://localhost:27017/USERINFORMATION")
  .then(() => {
    console.log("database is connected");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.listen(PORT, () => {
  console.log("server is start....");
});
