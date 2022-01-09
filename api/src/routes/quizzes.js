const {
  createQuiz,
  deleteQuiz,
  getQuizById,
  updateQuiz,
  updateQuizStatus,
  getApprovedQuizzes,
  getPendingQuizzes,
} = require("../core/quiz");

module.exports = (router) => {
  router.get("/quizzes/pending", async (req, res) => {
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
    try {
      const data = await getPendingQuizzes(skip, take);
      /*
        #swagger.responses[200] = {
          description: "Quizzes fetched successfully",
          schema: { $ref: "#/definitions/QuizArray" }
        } 
      */
      res.send(data.rows);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  router.get("/quizzes/approved", async (req, res) => {
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
    try {
      const data = await getApprovedQuizzes(skip, take);
      /*
        #swagger.responses[200] = {
          description: "Quizzes fetched successfully",
          schema: { $ref: "#/definitions/QuizArray" }
        } 
      */
      res.send(data.rows);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  router.get("/quizzes/:quizId", async (req, res) => {
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
      console.error(error);
      res.status(500).send({});
    }
  });

  router.post("/quizzes", async (req, res) => {
    /*
      #swagger.tags = ["Quiz"]
      #swagger.description = 'create a quiz with questions'
    */
    res.setHeader("Content-Type", "application/json");
    const { name, topicId } = req.body;
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
      /*
        #swagger.responses[200] = {
          description: "Quiz created successfully",
          schema: { $ref: "#/definitions/Quiz" }
        } 
      */
      res.send(quiz);
    } catch (error) {
      console.error(error);
      res.status(500).send({});
    }
  });

  router.delete("/quizzes/:quizId", async (req, res) => {
    /*
      #swagger.tags = ["Quiz", "Status"]
      #swagger.description = 'Delete a quiz'
    */
    res.setHeader("Content-Type", "application/json");
    const { quizId } = req.params;
    try {
      await deleteQuiz(quizId);
      /*
        #swagger.responses[200] = {
          description: "Quiz deleted successfully",
        } 
      */
      res.status(200).send({});
    } catch (error) {
      console.error(error);
      res.status(500).send();
    }
  });

  router.put("/quizzes/:quizId", async (req, res) => {
    /*
      #swagger.tags = ["Quiz"]
      #swagger.description = 'Update a quiz'
    */
    res.setHeader("Content-Type", "application/json");
    const { quizId } = req.params;
    /*
      #swagger.requestBody = {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/definitions/UpdateQuiz'
            }
          }
        }
      }
    */
    try {
      const updated = await updateQuiz(quizId, req.body);

      /*
        #swagger.responses[200] = {
          description: "Quiz status updated successfully",
        } 
      */
      res.status(200).send(updated);
    } catch (error) {
      console.error(error);
      res.status(500).send();
    }
  });

  router.put("/quizzes/:quizId/status", async (req, res) => {
    /*
      #swagger.tags = ["Quiz", "Status"]
      #swagger.description = 'Update status of a quiz'
    */
    res.setHeader("Content-Type", "application/json");
    const { quizId } = req.params;
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
    try {
      const updated = await updateQuizStatus(quizId, statusId);
      /*
        #swagger.responses[200] = {
          description: "Quiz status updated successfully",
          schema: { $ref: "#/definitions/Quiz" }
        } 
      */
      res.status(200).send(updated);
    } catch (error) {
      console.error(error);
      res.status(500).send();
    }
  });
};
