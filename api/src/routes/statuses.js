var express = require("express");

const db = require("../db");

module.exports = (router) => {
  router.get("/statuses", async (req, res) => {
    /*
    #swagger.tags = ["Status"]
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
};
