const express = require("express");
const { createServer } = require("http");
const routes = require("./src/routes/index.route");

require("dotenv").config();
const PORT = process.env.PORT;
const cors = require("cors");
const connectDB = require("./src/database/db");
const errorHandler = require("./src/utils/errorHandler");
const notFoundHandler = require("./src/utils/notFoundHandler");

const app = express();

const httpServer = createServer(app);

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", routes);
app.use(notFoundHandler);
app.use(errorHandler);

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
