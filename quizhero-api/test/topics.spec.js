const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();
const BlueBird = require('bluebird');
const db = require("../models")
const Topics = db.Topic;

chai.use(chaiHttp);

const setup = (...topics) => {
    return BlueBird.mapSeries(topics, item => {
        return chai.request(server)
            .post('/topics')
            .send(item)
            .then(response => {
                return response.body;
            })
    })
}

describe('topics_api', () => {
    const topic_1_1 = {
        "name": "coff",
        "description": "Drink Coffee",
        "imageUrl": "tinyurl.com/abc"
    }

    const topic_2_1 = {
        "name": "Bex",
        "description": "Workout",
        "imageUrl": "tinyurl.com/a32bc"
    }

    const topic_2_2 = {
        "name": "Chop",
        "description": "Eat Breakfast",
        "imageUrl": "tinyurl.com/abwerc"
    }

    const topic_1_2 = {
        "name": "wax",
        "description": "Eat Lunch",
        "imageUrl": "tinyurl.com/abdc"
    }


    beforeEach(async () => {
        await Topics.sync();
    })

    afterEach(async () => {
        await Topics.drop();
    })

    it('should create a new topic', async () => {
        const response = await chai.request(server).post('/topics').send(topic_1_1)
        response.should.have.status(201);
        delete response.body.id;
        delete response.body.createdAt;
        delete response.body.updatedAt;
        response.body.should.eql(topic_1_1)
    });

    it('should fetch all the topics', async () => {
        const results = await setup(topic_1_1, topic_1_2, topic_2_1, topic_2_2);
        const response = await chai.request(server).get('/topics')
        response.should.have.status(200);
        response.body.should.eql(results);
    })

    it('should fetch a single topic', async () => {
        const [topic] = await setup(topic_2_2);
        const response = await chai.request(server).get(`/topics/${topic.id}`)
        response.should.have.status(200);
        response.body.should.eql(topic);
    })

    it('should get 404 if the topic ID does not exist', async () => {
        const response = await chai.request(server).get(`/topics/32323`)
        response.should.have.status(404);
        response.text.should.eql('ID not found');
    })

    it('should get 405 for a put request to /topics/:id', async () => {
        const [topic] = await setup(topic_2_2);
        const response = await chai.request(server).put(`/topics/${topic.id}`).send(topic)
        response.should.have.status(405);
    })

    it('should get 405 for a patch request to /topics/:id', async () => {
        const [topic] = await setup(topic_2_2);
        const response = await chai.request(server).patch(`/topics/${topic.id}`).send(topic)
        response.should.have.status(405);
    })

    it('should get 405 for a delete request to /topics/:id', async () => {
        const [topic] = await setup(topic_2_2);
        const response = await chai.request(server).delete(`/topics/${topic.id}`)
        response.should.have.status(405);
    })
});
