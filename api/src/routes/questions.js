const {
  createQuestion,
  getQuestionById,
  deleteQuestion,
  updateQuestion,
} = require("../core/question");

module.exports = (router) => {
  router.get("/quizzes/:quizId/questions/:questionId", async (req, res) => {
    /*
      #swagger.tags = ["Question"]
      #swagger.description = 'Get one question'
    */
    res.setHeader("Content-Type", "application/json");
    const { questionId, quizId } = req.params;

    try {
      const question = await getQuestionById(questionId);
      if (!question) {
        /*
          #swagger.responses[404] = {
            description: "Question not found",
          } 
        */
        res.status(404).send({});
        return;
      }
      /*
        #swagger.responses[200] = {
          description: "Question fetched successfully",
          schema: { $ref: "#/definitions/Question" }
        } 
      */
      res.send(question);
    } catch (error) {
      console.error(error);
      res.status(500).send({});
    }
  });

  router.post("/quizzes/:quizId/questions", async (req, res) => {
    /*
      #swagger.tags = ["Question"]
      #swagger.description = 'Create a question'
    */
    res.setHeader("Content-Type", "application/json");
    /*
      #swagger.requestBody = {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/definitions/AddQuestion'
            }
          }
        }
      }
    */
   const { quizId } = req.params;
    try {
      const question = await createQuestion({ ...req.body, quizId, createdById: 1 });
      /*
        #swagger.responses[200] = {
          description: "Question created successfully",
          schema: { $ref: "#/definitions/Question" }
        } 
      */
      res.send(question);
    } catch (error) {
      console.error(error);
      res.status(500).send({});
    }
  });

  router.delete("/quizzes/:quizId/questions/:questionId", async (req, res) => {
    /*
      #swagger.tags = ["Question"]
      #swagger.description = 'Delete a question'
    */
    res.setHeader("Content-Type", "application/json");
    const { questionId, quizId } = req.params;
    try {
      await deleteQuestion(questionId);
      /*
        #swagger.responses[200] = {
          description: "Question deleted successfully",
        } 
      */
      res.status(200).send({});
    } catch (error) {
      console.error(error);
      res.status(500).send();
    }
  });

  router.put("/quizzes/:quizId/questions/:questionId", async (req, res) => {
    /*
      #swagger.tags = ["Question"]
      #swagger.description = 'Update a question'
    */
    res.setHeader("Content-Type", "application/json");
    const { questionId, quizId } = req.params;
    /*
      #swagger.requestBody = {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/definitions/UpdateQuestion' }
          }
        }
      }
    */
    try {
      const result = await updateQuestion(questionId, req.body);
      /*
        #swagger.responses[200] = {
          description: "Question status updated successfully",
          schema: { $ref: "#/definitions/Question" }
        } 
      */
      res.status(200).send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send();
    }
  });
};
