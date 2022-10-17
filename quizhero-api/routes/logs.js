const router = require("express").Router();
const controller = require("../controllers/logs");

router.get("/", async (req, res) => {
  var { from, until, limit, start, order } = req.query;
  if (!from) {
    from = new Date() - 24 * 60 * 60 * 1000;
  } else {
    from = new Date(Number(from));
  }
  if (!until) {
    until = new Date();
  } else {
    until = new Date(Number(until));
  }
  if (!limit) {
    limit = 10;
  } else {
    limit = Number(limit);
  }
  if (!start) {
    start = 0;
  } else {
    start = Number(start);
  }
  if (order != "desc" && order != "asc") {
    order = "desc";
  }
  try {
    const results = await controller.query(from, until, limit, start, order);
    res.send(results);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
