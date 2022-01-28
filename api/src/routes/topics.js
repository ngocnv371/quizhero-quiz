const guard = require("express-jwt-permissions")();

const permissions = require("../core/permissions");

const {
  createTopic,
  deleteTopic,
  getTopicById,
  updateTopic,
  searchTopics,
  getTopicsByIds,
} = require("../core/topic");

module.exports = (router) => {
  router.get(
    "/topics",
    guard.check(permissions.READ_TOPICS),
    async (req, res) => {
      /*
      #swagger.tags = ["Topic"]
      #swagger.description = 'Get all topics'
      #swagger.security = [
        {
          bearerAuth: ["read:topics"]
        }
      ]
    */
      res.setHeader("Content-Type", "application/json");
      const skip = Number(req.query.skip) || 0;
      const take = Number(req.query.take) || 20;
      const { query, ids } = req.query;
      const sort = req.query.sort || "name";
      const order = req.query.order || "asc";

      /*
      #swagger.parameters['query'] = {
        in: 'query',
        description: 'Search by name.',
        required: false,
        type: 'string'
      }
      #swagger.parameters['ids'] = {
        in: 'query',
        description: 'Search by list of IDs. Example: 1,2,3',
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
        let data;
        if (ids && ids.length) {
          data = await getTopicsByIds(ids);
        } else {
          data = await searchTopics(query, sort, order, skip, take);
        }
        /*
        #swagger.responses[200] = {
          description: "Topics fetched successfully",
          schema: { $ref: "#/definitions/TopicSearchResult" }
        }
      */
        res.send(data);
      } catch (error) {
        console.error(error);
        res.status(500).send(error);
      }
    }
  );

  router.get(
    "/topics/:topicId",
    guard.check(permissions.READ_TOPICS),
    async (req, res) => {
      /*
      #swagger.tags = ["Topic"]
      #swagger.description = 'Get one topic'
      #swagger.security = [
        {
          bearerAuth: ["read:topics"]
        }
      ]
    */
      res.setHeader("Content-Type", "application/json");
      const { topicId } = req.params;

      try {
        const topic = await getTopicById(topicId);
        if (!topic) {
          /*
          #swagger.responses[404] = {
            description: "Topic not found",
          }
        */
          res.status(404).send({});
          return;
        }
        /*
        #swagger.responses[200] = {
          description: "Topic fetched successfully",
          schema: { $ref: "#/definitions/Topic" }
        }
      */
        res.send(topic);
      } catch (error) {
        console.error(error);
        res.status(500).send({});
      }
    }
  );

  router.post(
    "/topics",
    guard.check(permissions.CREATE_TOPICS),
    async (req, res) => {
      /*
      #swagger.tags = ["Topic"]
      #swagger.description = 'create a topic'
      #swagger.security = [
        {
          bearerAuth: ["create:topics"]
        }
      ]
    */
      res.setHeader("Content-Type", "application/json");
      const { name } = req.body;
      /*
      #swagger.requestBody = {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/definitions/AddTopic'
            }
          }
        }
      }
    */
      try {
        const topic = await createTopic({ name });
        /*
        #swagger.responses[200] = {
          description: "Topic created successfully",
          schema: { $ref: "#/definitions/Topic" }
        }
      */
        res.send(topic);
      } catch (error) {
        console.error(error);
        res.status(500).send({});
      }
    }
  );

  router.delete(
    "/topics/:topicId",
    guard.check(permissions.DELETE_TOPICS),
    async (req, res) => {
      /*
      #swagger.tags = ["Topic"]
      #swagger.description = 'Delete a topic'
      #swagger.security = [
        {
          bearerAuth: ["delete:topics"]
        }
      ]
    */
      res.setHeader("Content-Type", "application/json");
      const { topicId } = req.params;
      try {
        await deleteTopic(topicId);
        /*
        #swagger.responses[200] = {
          description: "Topic deleted successfully",
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
    "/topics/:topicId",
    guard.check(permissions.UPDATE_TOPICS),
    async (req, res) => {
      /*
      #swagger.tags = ["Topic"]
      #swagger.description = 'Update a topic'
      #swagger.security = [
        {
          bearerAuth: ["update:topics"]
        }
      ]
    */
      res.setHeader("Content-Type", "application/json");
      const { topicId } = req.params;
      /*
      #swagger.requestBody = {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/definitions/UpdateTopic'
            }
          }
        }
      }
    */
      try {
        const updated = await updateTopic(topicId, req.body);

        /*
        #swagger.responses[200] = {
          description: "Topic updated successfully",
        }
      */
        res.status(200).send(updated);
      } catch (error) {
        console.error(error);
        res.status(500).send();
      }
    }
  );
};
