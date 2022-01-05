var express = require("express");
var router = express.Router();

const db = require("../db");

router.get("/", async (req, res) => {
  /*
    #swagger.tags = ["Quiz"]
    #swagger.description = 'Get all valid statuses that can be used for quizzes'
  */
  /*
    #swagger.responses[200] = {
      description: "Statuses fetched successfully",
      schema: { $ref: "#/definitions/Status" }
    } 
  */
  res.setHeader("Content-Type", "application/json");
  try {
    const query = "SELECT * FROM statuses";
    const data = await db.query(query);
    res.status(200).send(data.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

module.exports = router;
