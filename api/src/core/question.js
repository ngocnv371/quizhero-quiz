const db = require("../db");

async function createQuestion(q) {
  const query = `INSERT INTO questions(
	  "text", "quizId", 
	  "choice0", "choice1", "choice2", "choice3", 
	  "correct0", "correct1", "correct2", "correct3", 
	  "createdById"
	  ) 
	  VALUES (
		$1, $2, 
		$3, $4, $5, $6, 
		$7, $8, $9, $10,
		$11
	  ) 
	  RETURNING *`;
  const result = await db.query(query, [
    q.text,
    q.quizId,
    q.choice0,
    q.choice1,
    q.choice2,
    q.choice3,
    q.correct0,
    q.correct1,
    q.correct2,
    q.correct3,
    q.createdById,
  ]);
  return {
    ...result.rows[0],
    correct0: Number(result.rows[0].correct0),
    correct1: Number(result.rows[0].correct1),
    correct2: Number(result.rows[0].correct2),
    correct3: Number(result.rows[0].correct3),
  };
}

async function updateQuestion(id, data) {
  const result = await db.query(
    `UPDATE questions 
		SET
		  "text" = $1,
		  "choice0" = $2,
		  "choice1" = $3,
		  "choice2" = $4,
		  "choice3" = $5,
		  "correct0" = $6,
		  "correct1" = $7,
		  "correct2" = $8,
		  "correct3" = $9
		WHERE "id" = $10
		RETURNING *`,
    [
      data.text,
      data.choice0,
      data.choice1,
      data.choice2,
      data.choice3,
      data.correct0,
      data.correct1,
      data.correct2,
      data.correct3,
      id,
    ]
  );
  return {
    ...result.rows[0],
    correct0: Number(result.rows[0].correct0),
    correct1: Number(result.rows[0].correct1),
    correct2: Number(result.rows[0].correct2),
    correct3: Number(result.rows[0].correct3),
  };
}

function deleteQuestion(id) {
  return db.query('DELETE FROM questions WHERE "id" = $1', [id]);
}

async function getQuestionById(id) {
  const query = 'SELECT * FROM questions WHERE "id" = $1';
  const result = await db.query(query, [id]);
  if (!result.rowCount) {
    return null;
  }
  return {
    ...result.rows[0],
    correct0: Number(result.rows[0].correct0),
    correct1: Number(result.rows[0].correct1),
    correct2: Number(result.rows[0].correct2),
    correct3: Number(result.rows[0].correct3),
  };
}

module.exports = {
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestionById,
};
