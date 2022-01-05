var express = require("express");
var router = express.Router();

const db = require("../db");

router.get("/pending", async (req, res) => {
  const skip = Number(req.params.skip) || 0;
  const take = Number(req.params.take) || 20;
  const query =
    'SELECT * FROM pending_quizzes ORDER BY "id" LIMIT $1 OFFSET $2';
  try {
    const data = await db.query(query, [take, skip]);
    res.send(data.rows);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/approved", async (req, res) => {
  const skip = Number(req.params.skip) || 0;
  const take = Number(req.params.take) || 20;
  const query =
    'SELECT * FROM approved_quizzes ORDER BY "id" LIMIT $1 OFFSET $2';
  try {
    const data = await db.query(query, [take, skip]);
    res.send(data.rows);
  } catch (error) {
    res.status(500).send(error);
  }
});

async function getQuizById(quizId) {
  const quizQuery = 'SELECT * FROM quizzes WHERE "id" = $1';
  const quizResult = await db.query(quizQuery, [quizId]);
  if (!quizResult.rowCount) {
    console.log(quizResult)
    return null;
  }
  const questionsQuery = 'SELECT * FROM questions WHERE "quizId" = $1';
  const questionsResult = await db.query(questionsQuery, [quizId]);
  return {
    ...quizResult.rows[0],
    questions: questionsResult.rows,
  };
}

router.get("/:quizId", async (req, res) => {
  const { quizId } = req.params;
  try {
    const quiz = await getQuizById(quizId);
    if (!quiz) {
      res.status(404).send();
      return;
    }
    res.send(quiz);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

async function createQuiz(q) {
  const query =
    'INSERT INTO quizzes("name", "topicId", "statusId", "createdById") VALUES ($1, $2, 1, $3) RETURNING *';
  const result = await db.query(query, [q.name, q.topicId, q.createdById]);
  return result.rows[0];
}

function createQuestion(q) {
  const query = `INSERT INTO questions(
    "text", "quizId", 
    "choice0", "choice1", "choice2", "choice3", 
    "correct0", "correct1", "correct2", "correct3", 
    "createdById"
    ) VALUES (
      $1, $2, 
      $3, $4, $5, $6, 
      $7, $8, $9, $10,
      $11)`;
  return db.query(query, [
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
}

router.post("/", async (req, res) => {
  const { name, topicId, questions } = req.body;
  try {
    const quiz = await createQuiz({ name, topicId, createdById: 1 });
    await Promise.all(
      questions.map((q) =>
        createQuestion({ ...q, createdById: 1, quizId: quiz.id })
      )
    );
    res.send(getQuizById(quiz.id));
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

router.put("/:quizId/status", async (req, res) => {
  const { quizId } = req.params;
  const { statusId } = req.body;
  const query = 'UPDATE quizzes SET "statusId" = $1 WHERE "id" = $2';
  try {
    await db.query(query, [statusId, quizId]);
    res.send(200);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

module.exports = router;
