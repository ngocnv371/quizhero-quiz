const { VALID_STATUSES } = require('../config');

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

async function getPendingQuizzes(skip, take) {
  const result = await db.query(
    'SELECT * FROM pending_quizzes ORDER BY "id" LIMIT $1 OFFSET $2',
    [take, skip]
  );
  return result.rows;
}

async function getApprovedQuizzes(skip, take) {
  const result = await db.query(
    'SELECT * FROM approved_quizzes ORDER BY "id" LIMIT $1 OFFSET $2',
    [take, skip]
  );
  return result.rows;
}

module.exports = {
  createQuiz,
  deleteQuiz,
  updateQuiz,
  getQuizById,
  updateQuizStatus,
  getPendingQuizzes,
  getApprovedQuizzes,
};
