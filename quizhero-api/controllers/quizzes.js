const { Op } = require("sequelize");
const db = require("../models");
const Quizzes = db.Quiz;

module.exports = {
  async getAll(topicId, after) {
    const where = {};
    if (topicId) {
      where["topicId"] = topicId;
    }
    if (after) {
      const date = new Date(Number(after));
      where["updatedAt"] = { [Op.gte]: date };
    }
    const all = await Quizzes.findAll({ where, order: [["id", "ASC"]] });
    return all;
  },
  async getOne(id) {
    const match = await Quizzes.findOne({ where: { id } });
    return match;
  },
  async create(payload) {
    return await Quizzes.create(payload);
  },
};
