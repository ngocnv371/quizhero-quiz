const { VALID_STATUSES } = require("../config");

const db = require("../db");

async function getQuizById(quizId) {
  const quizQuery = 'SELECT * FROM quizzes WHERE "id" = $1';
  const quizResult = await db.query(quizQuery, [quizId]);
  if (!quizResult.rowCount) {
    return null;
  }
  const questionsQuery = 'SELECT * FROM questions WHERE "quizId" = $1';
  const questionsResult = await db.query(questionsQuery, [quizId]);
  return {
    ...quizResult.rows[0],
    questions: questionsResult.rows,
  };
}

async function createQuiz(q) {
  const query =
    'INSERT INTO quizzes("name", "topicId", "statusId", "createdById") VALUES ($1, $2, 1, $3) RETURNING *';
  const result = await db.query(query, [q.name, q.topicId, q.createdById]);
  return result.rows[0];
}

function deleteQuiz(quizId) {
  return db.query('UPDATE quizzes SET "statusId" = $1 WHERE "id" = $2', [
    VALID_STATUSES.Deleted,
    quizId,
  ]);
}

async function updateQuiz(quizId, data) {
  const result = await db.query(
    `UPDATE quizzes
    SET "name" = $1, "topicId" = $2
    WHERE "id" = $3 RETURNING *`,
    [data.name, data.topicId, quizId]
  );
  return result.rows[0];
}

async function updateQuizStatus(quizId, status) {
  const result = await db.query(
    `UPDATE quizzes
    SET "statusId" = $1
    WHERE "id" = $2 RETURNING *`,
    [status, quizId]
  );
  return result.rows[0];
}

function getSort(sort, order) {
  const validSorts = ["name", "statusId", "topicId", "createdAt", "id"];
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

async function getQuizzesByIds(ids) {
  const query = `SELECT * FROM quizzes WHERE id = ANY($1::int[])`;
  const result = await db.query(query, [toNumberArray(ids)]);
  return {
    total: result.rowCount,
    items: result.rows,
    skip: 0,
    take: result.rowCount,
  };
}

async function searchQuizzes(
  search,
  topics,
  statuses,
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
  if (topics && topics.length) {
    conditions.push(`AND "topicId" = ANY($${index++}::int[])`);
    params.push(toNumberArray(topics));
  }
  if (statuses && statuses.length) {
    conditions.push(`AND "statusId" = ANY($${index++}::int[])`);
    params.push(toNumberArray(statuses));
  }
  const countQuery = `SELECT COUNT(*) as total FROM quizzes WHERE 1=1 ${conditions.join(
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
      statuses,
      topics,
      query: search,
    };
  }
  const query = `SELECT * FROM quizzes WHERE 1=1 ${conditions.join(
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
    statuses,
    topics,
    query: search,
  };
}

module.exports = {
  createQuiz,
  deleteQuiz,
  updateQuiz,
  getQuizById,
  updateQuizStatus,
  searchQuizzes,
  getQuizzesByIds,
};
