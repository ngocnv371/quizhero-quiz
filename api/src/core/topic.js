const { VALID_STATUSES } = require("../config");

const db = require("../db");

async function getTopicById(topicId) {
  const topicQuery = 'SELECT * FROM topics WHERE "id" = $1';
  const topicResult = await db.query(topicQuery, [topicId]);
  if (!topicResult.rowCount) {
    return null;
  }
  return topicResult.rows[0];
}

async function createTopic(q) {
  const query =
    'INSERT INTO topics("name") VALUES ($1) RETURNING *';
  const result = await db.query(query, [q.name]);
  return result.rows[0];
}

function deleteTopic(topicId) {
  return db.query('DELETE FROM topics WHERE "id" = $1', [
    topicId,
  ]);
}

async function updateTopic(topicId, data) {
  const result = await db.query(
    `UPDATE topics
    SET "name" = $1
    WHERE "id" = $2 RETURNING *`,
    [data.name, topicId]
  );
  return result.rows[0];
}

function getSort(sort, order) {
  const validSorts = ["name", "id"];
  sort = validSorts.includes(sort) ? sort : validSorts[0];
  const validOrders = ["asc", "desc"];
  order = validOrders.includes(order) ? order : validOrders[0];
  return `ORDER BY "${sort}" ${order}`;
}

function getPaging(skip, take) {
  skip = skip >= 0 ? skip : 0;
  take = take >= 0 && take <= 100 ? take : 10;
  return `LIMIT ${take} OFFSET ${skip}`;
}

function toNumberArray(list) {
  return list.split(",").map(Number);
}

async function getTopicsByIds(ids) {
  const query = `SELECT * FROM topics WHERE id = ANY($1::int[])`;
  const result = await db.query(query, [toNumberArray(ids)]);
  return {
    total: result.rowCount,
    items: result.rows,
    skip: 0,
    take: result.rowCount,
  };
}

async function searchTopics(
  search,
  sort,
  order,
  skip,
  take
) {
  const params = [];
  const conditions = [];
  let index = 1;
  if (search) {
    conditions.push(`AND "name" LIKE $${index++}`);
    params.push(`%${search}%`);
  }
  const countQuery = `SELECT COUNT(*) as total FROM topics WHERE 1=1 ${conditions.join(
    " "
  )}`;
  const countResult = await db.query(countQuery, params);
  if (!countResult.rowCount) {
    return {
      total: 0,
      items: [],
      skip,
      take,
      sort,
      order,
      query: search,
    };
  }
  const query = `SELECT * FROM topics WHERE 1=1 ${conditions.join(
    " "
  )} ${getSort(sort, order)} ${getPaging(skip, take)}`;
  const result = await db.query(query, params);
  return {
    total: Number(countResult.rows[0]["total"]),
    items: result.rows,
    skip,
    take,
    sort,
    order,
    query: search,
  };
}

module.exports = {
  createTopic,
  deleteTopic,
  updateTopic,
  getTopicById,
  searchTopics,
  getTopicsByIds,
};
