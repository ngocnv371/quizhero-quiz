var express = require("express");
var router = express.Router();

const db = require("../db");

router.get("/pending", async (req, res) => {
  /*
    #swagger.tags = ["Quiz"]
    #swagger.description = 'Get all pending quizzes'
  */
  res.setHeader("Content-Type", "application/json");
  const skip = Number(req.params.skip) || 0;
  const take = Number(req.params.take) || 20;
  /*
    #swagger.parameters['skip'] = {
      in: 'query',
      description: 'How many elements to skip. Used for paging.',
      required: false,
      type: 'number'
    } 
    #swagger.parameters['take'] = {
      in: 'query',
      description: 'How many elements to take. Used for paging.',
      required: false,
      type: 'number'
    } 
  */
  const query =
    'SELECT * FROM pending_quizzes ORDER BY "id" LIMIT $1 OFFSET $2';
  try {
    const data = await db.query(query, [take, skip]);
    /*
      #swagger.responses[200] = {
        description: "Quizzes fetched successfully",
        schema: { $ref: "#/definitions/Quiz" }
      } 
    */
    res.send(data.rows);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/approved", async (req, res) => {
  /*
    #swagger.tags = ["Quiz"]
    #swagger.description = 'Get all approved quizzes'
  */
  res.setHeader("Content-Type", "application/json");
  const skip = Number(req.params.skip) || 0;
  const take = Number(req.params.take) || 20;
  /*
      #swagger.parameters['skip'] = {
        in: 'query',
        description: 'How many elements to skip. Used for paging.',
        required: false,
        type: 'number'
      } 
      #swagger.parameters['take'] = {
        in: 'query',
        description: 'How many elements to take. Used for paging.',
        required: false,
        type: 'number'
      } 
    */
  const query =
    'SELECT * FROM approved_quizzes ORDER BY "id" LIMIT $1 OFFSET $2';
  try {
    const data = await db.query(query, [take, skip]);
    /*
      #swagger.responses[200] = {
        description: "Quizzes fetched successfully",
        schema: { $ref: "#/definitions/Quiz" }
      } 
    */
    res.send(data.rows);
  } catch (error) {
    res.status(500).send(error);
  }
});

async function getQuizById(quizId) {
  const quizQuery = 'SELECT * FROM quizzes WHERE "id" = $1';
  const quizResult = await db.query(quizQuery, [quizId]);
  if (!quizResult.rowCount) {
    console.log(quizResult);
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
  /*
    #swagger.tags = ["Quiz"]
    #swagger.description = 'Get one quiz including questions'
  */
  res.setHeader("Content-Type", "application/json");
  const { quizId } = req.params;

  try {
    const quiz = await getQuizById(quizId);
    if (!quiz) {
      /*
        #swagger.responses[404] = {
          description: "Quiz not found",
        } 
      */
      res.status(404).send({});
      return;
    }
    /*
      #swagger.responses[200] = {
        description: "Quiz fetched successfully",
        schema: { $ref: "#/definitions/QuizExtended" }
      } 
    */
    res.send(quiz);
  } catch (error) {
    console.log(error);
    res.status(500).send({});
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
  /*
    #swagger.tags = ["Quiz"]
    #swagger.description = 'Get one quiz including questions'
  */
  res.setHeader("Content-Type", "application/json");
  const { name, topicId, questions } = req.body;
  console.log(req.body);
  /*
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/definitions/AddQuiz'
          }
        }
      }
    }
  */
  try {
    const quiz = await createQuiz({ name, topicId, createdById: 1 });
    await Promise.all(
      questions.map((q) =>
        createQuestion({ ...q, createdById: 1, quizId: quiz.id })
      )
    );
    /*
      #swagger.responses[200] = {
        description: "Quiz created successfully",
        schema: { $ref: "#/definitions/QuizExtended" }
      } 
    */
    res.send(await getQuizById(quiz.id));
  } catch (error) {
    console.log(error);
    res.status(500).send({});
  }
});

router.put("/:quizId/status", async (req, res) => {
  /*
    #swagger.tags = ["Quiz"]
    #swagger.description = 'Update status of a quiz'
  */
  res.setHeader("Content-Type", "application/json");
  const { quizId } = req.params;
  /*
    #swagger.parameters['quizId'] = {
      in: 'path',
      description: 'Quiz Id.',
      required: true,
      schema: 'number'
    }  
  */
  const { statusId } = req.body;
  /*
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/definitions/UpdateQuizStatus'
          }
        }
      }
    }
  */
  const query = 'UPDATE quizzes SET "statusId" = $1 WHERE "id" = $2';
  try {
    await db.query(query, [statusId, quizId]);
    /*
      #swagger.responses[200] = {
        description: "Quiz status updated successfully",
      } 
    */
    res.status(200).send({});
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

module.exports = router;
