const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");

const connectDB = require("./config/db");
const { errorHandler } = require("./middlewares/errorMiddleware");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());

//to accepting post form data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = process.env.PORT || 5000;

connectDB(); //no need

app.use("/api/users", userRoutes);

//notfound url
app.all("*", (req, res) => {
  res.json({
    status: "failure",
    message: "wrong url",
  });
});

//error middleware
app.use(errorHandler);

app.listen(port, () => console.log(`Server is running on ${port}`));
