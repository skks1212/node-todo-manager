const request = require('supertest');
const app = require('../app');
const db = require('../models/index');

let server, agent;

describe("Todo test suite", () => {
    beforeAll(async () => {
        await db.sequelize.sync({ force: true });
        server = app.listen(3000, () => console.log('Test server running on port 3000'));
        agent = request.agent(server);
    });
    afterAll(async () => {
        await db.sequelize.close();
        await server.close();
    });
    test("POST /todos", async () => {
        const response = await agent.post('/todos').send({
            title: 'Test todo',
            dueDate: new Date().toISOString(),
        });
        expect(response.status).toBe(200);
        expect(response.header['content-type']).toBe(
            "application/json; charset=utf-8"
        );
        const parsedResponse = JSON.parse(response.text);
        expect(parsedResponse.id).toBeDefined();
    });
    test("PUT /todos/:id/complete", async () => {
        const response = await agent.post('/todos').send({
            title: 'Test todo',
            dueDate: new Date().toISOString(),
        });
        const parsedResponse = JSON.parse(response.text);
        const todoID = parsedResponse.id;

        expect(parsedResponse.completed).toBe(false);

        const markCompleteResponse = await agent.put(`/todos/${todoID}/complete`).send();
        const pasedUpdatedResponse = JSON.parse(markCompleteResponse.text);
        expect(pasedUpdatedResponse.completed).toBe(true);
    });
});