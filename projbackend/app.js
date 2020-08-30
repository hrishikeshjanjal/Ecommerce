require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express"); //required to listen
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//my routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const paymentBRoutes = require("./routes/paymentBRoutes");

//DB connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true, //use is compulsory all these helps to keep the connection alive
    useUnifiedTopolgy: true, //read in docs
    useCreateIndex: true, //indexing
  })
  .then(() => {
    console.log("DB CONNECTED");
  });
//.catch(console.log("DATABASE CONNECTION FAILED!"));

//below are middlewares
// parse application/json
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//My routes
app.use("/api", authRoutes); //api is added from our side ie: http://localhost:8000/api/signout
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", paymentBRoutes);

//PORT
const port = 8000;

//starting the server.
app.listen(port, () => {
  //app listens on port
  console.log(`app is running at ${port}`); //use tilde key whenever we want to utilise any varaible use backticks\tilde
});
