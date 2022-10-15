const db = require("../models");
const logger = require("../logger");

module.exports = {
  async getAll() {
    logger.debug("getting all topics");
    const all = await db.Topic.findAll({ order: [["id", "ASC"]] });
    return all;
  },
  async getOne(id) {
    const match = await db.Topic.findOne({ where: { id } });
    return match;
  },
  async create(payload) {
    return await db.Topic.create(payload);
  },
};
