const express = require("express");
const morgan = require("morgan");
const { PORT } = require("./config");
var cors = require("cors");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const apiRoutes = require("./routes/api");

app.use("/health", (req, res) => {
  res.send("Healthy!");
});

app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.send("Hey Raj this side! Welcome to the API");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
