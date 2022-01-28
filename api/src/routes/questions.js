const guard = require("express-jwt-permissions")();

const permissions = require("../core/permissions");

const {
  createQuestion,
  getQuestionById,
  deleteQuestion,
  updateQuestion,
  searchQuestions,
} = require("../core/question");

module.exports = (router) => {
  router.get(
    "/quizzes/:quizId/questions/:questionId",
    guard.check(permissions.READ_QUESTIONS),
    async (req, res) => {
      /*
      #swagger.tags = ["Question"]
      #swagger.description = 'Get one question'
      #swagger.security = [
        {
          bearerAuth: ["read:questions"]
        }
      ]
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
    }
  );

  router.post(
    "/quizzes/:quizId/questions",
    guard.check(permissions.CREATE_QUESTIONS),
    async (req, res) => {
      /*
      #swagger.tags = ["Question"]
      #swagger.description = 'Create a question'
      #swagger.security = [
        {
          bearerAuth: ["create:questions"]
        }
      ]
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
        const question = await createQuestion({
          ...req.body,
          quizId,
          createdById: 1,
        });
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
    }
  );

  router.delete(
    "/quizzes/:quizId/questions/:questionId",
    guard.check(permissions.DELETE_QUESTIONS),
    async (req, res) => {
      /*
      #swagger.tags = ["Question"]
      #swagger.description = 'Delete a question'
      #swagger.security = [
        {
          bearerAuth: ["delete:questions"]
        }
      ]
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
    }
  );

  router.put(
    "/quizzes/:quizId/questions/:questionId",
    guard.check(permissions.UPDATE_QUESTIONS),
    async (req, res) => {
      /*
      #swagger.tags = ["Question"]
      #swagger.description = 'Update a question'
      #swagger.security = [
        {
          bearerAuth: ["update:questions"]
        }
      ]
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
    }
  );
  router.get(
    "/questions",
    guard.check(permissions.READ_QUESTIONS),
    async (req, res) => {
      /*
      #swagger.tags = ["Question"]
      #swagger.description = 'Get all questions'
      #swagger.security = [
        {
          bearerAuth: ["read:questions"]
        }
      ]
    */
      res.setHeader("Content-Type", "application/json");
      const skip = Number(req.query.skip) || 0;
      const take = Number(req.query.take) || 20;
      const { query, quizzes, topics } = req.query;
      const sort = req.query.sort || "name";
      const order = req.query.order || "asc";

      /*
      #swagger.parameters['query'] = {
        in: 'query',
        description: 'Search by name.',
        required: false,
        type: 'string'
      }
      #swagger.parameters['quizzes'] = {
        in: 'query',
        description: 'Search by list of quizzes. Example: 1,2,3',
        required: false,
        type: 'string'
      }
      #swagger.parameters['topics'] = {
        in: 'query',
        description: 'Search by list of topics. Example: 1,2,3',
        required: false,
        type: 'string'
      }
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
      #swagger.parameters['sort'] = {
        in: 'query',
        description: 'Sort by field',
        required: false,
        type: 'string'
      } 
      #swagger.parameters['order'] = {
        in: 'query',
        description: 'Sort order.',
        required: false,
        type: 'string'
      } 
    */
      try {
        console.log(query, topics, quizzes, sort, order, skip, take);
        const data = await searchQuestions(
          query,
          topics,
          quizzes,
          sort,
          order,
          skip,
          take
        );
        /*
        #swagger.responses[200] = {
          description: "Questions fetched successfully",
          schema: { $ref: "#/definitions/QuestionSearchResult" }
        } 
      */
        res.send(data);
      } catch (error) {
        console.error(error);
        res.status(500).send(error);
      }
    }
  );
};
