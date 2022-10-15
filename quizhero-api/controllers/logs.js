const db = require("../models");
const logger = require("../logger");

module.exports = {
  async query(from, until, limit, start, order) {    
    return new Promise((resolve, reject) => {
      logger.query(
        {
          from,
          until,
          limit,
          start,
          order,
        },
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });
  },
};
