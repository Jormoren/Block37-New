const { client, fetchUsers, fetchProducts, fetchSingleUser } = require("./db");
const seed = require("./seed");
const path = require("path");
const express = require("express");
const apiRouter = require("./api");

const app = express();
app.use(require("morgan")("dev"));
app.use(express.json());
const port = process.env.PORT || 8081;

app.use(express.static(path.join(__dirname, "images")));
app.use("/api", apiRouter);

const init = async () => {
  try {
    await pool.connect();
    console.log("Connected to database");
    await seed();
    console.log("Data seeded");
    app.listen(port, () => console.log(`Listening on port ${port}`));
  } catch (err) {
    console.error("Error during initialization:", err);
    process.exit(1); 
  }
};

init();
