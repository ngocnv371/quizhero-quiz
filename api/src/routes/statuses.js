var express = require("express");
var router = express.Router();

const db = require("../db");

router.get("/", async (req, res) => {
  try {
    const query = "SELECT * FROM statuses";
    const data = await db.query(query);
    res.send(data.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

module.exports = router;
