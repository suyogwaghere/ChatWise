const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
// database link
const MONGO_URL =
  "mongodb+srv://mack:mackdb@cluster0.zd362wd.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.log(error.message);
  });
