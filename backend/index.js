const express = require("express");
const { createServer } = require("http");

require("dotenv").config();
const PORT = process.env.PORT;
const cors = require("cors");
const connectDB = require("./src/database/db");

const app = express();

const httpServer = createServer(app);

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", (req, res) => {
  res.send("Hello World!");
});
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
