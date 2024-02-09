require("dotenv").config();
const cors = require("cors");
const express = require("express");
const knex = require("./database/connection/connection");
const port = process.env.SERVER_PORT || 3000;
const router = require("./router.js");
const { errorHandling } = require("./middleware/validate-body.js");

const app = express();

app.use(cors());
app.use(express.json());
app.use(errorHandling);
app.use(router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
