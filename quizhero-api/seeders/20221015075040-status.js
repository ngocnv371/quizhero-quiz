"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Statuses", [
      {
        name: "Draft",
      },
      {
        name: "Pending",
      },
      {
        name: "Approved",
      },
      {
        name: "Rejected",
      },
      {
        name: "Deleted",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    queryInterface.bulkDelete("Statuses", null, {});
  },
};
