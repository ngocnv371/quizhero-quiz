const db = require("../models");

module.exports = {
  async getAll(topicId) {
    //logger.debug("i think we will get all", { service: "bgi", bod: "ben" });
    const where = {};
    if (topicId) {
      where["topicId"] = topicId;
    }
    const all = await db.Topic.findAll({ where, order: [["id", "ASC"]] });
    return all;
  },
  async getOne(id) {
    //logger.debug("get this one just for fon");
    const match = await db.Topic.findOne({ where: { id } });
    return match;
  },
  async create(payload) {
    //logger.debug("create this for me");
    return await db.Topic.create(payload);
  },
};
