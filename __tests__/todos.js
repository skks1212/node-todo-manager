const request = require("supertest");
const cheerio = require("cheerio");
const db = require("../models/index");
const app = require("../app");

let server, agent;

const extractCSRFToken = (html) => {
  const $ = cheerio.load(html);
  return $("[name=_csrf]").val();
};

describe("Todo Application", function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(5000, () => {});
    agent = request.agent(server);
  });

  afterAll(async () => {
    try {
      await db.sequelize.close();
      await server.close();
    } catch (error) {
      console.log(error);
    }
  });

  test("Creates a todo", async () => {
    const { text } = await agent.get("/");
    const csrfToken = extractCSRFToken(text);

    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      _csrf: csrfToken,
    });
    expect(response.statusCode).toBe(302);
  });

  test("Marks a todo with the given ID as complete", async () => {
    let res = await agent.get("/");
    let csrfToken = extractCSRFToken(res.text);
    await agent.post("/todos").send({
      title: "Wash Dishes",
      dueDate: new Date().toISOString(),
      _csrf: csrfToken,
    });

    const groupedTodos = await agent
      .get("/todos")
      .set("Accept", "application/json");
    const parsedResponse = JSON.parse(groupedTodos.text);
    const lastItem = parsedResponse[parsedResponse.length - 1];

    res = await agent.get("/");
    csrfToken = extractCSRFToken(res.text);

    const markCompleteResponse = await agent.put(`/todos/${lastItem.id}`).send({
      _csrf: csrfToken,
      completed: true,
    });

    const parsedUpdateResponse = JSON.parse(markCompleteResponse.text);
    expect(parsedUpdateResponse.completed).toBe(true);
  });

  test("Fetches all todos in the database using /todos endpoint", async () => {
    let res = await agent.get("/");
    let csrfToken = extractCSRFToken(res.text);

    await agent.post("/todos").send({
      title: "Buy xbox",
      dueDate: new Date().toISOString(),
      _csrf: csrfToken,
    });

    const response = await agent.get("/todos");
    const parsedResponse = JSON.parse(response.text);

    expect(parsedResponse.length).toBe(3);
    expect(parsedResponse[2].title).toBe("Buy xbox");
  });

  test("Deletes a todo with the given ID if it exists and sends a boolean response", async () => {
    let res = await agent.get("/");
    let csrfToken = extractCSRFToken(res.text);

    await agent.post("/todos").send({
      title: "Defeat Thanos",
      dueDate: new Date().toISOString(),
      _csrf: csrfToken,
    });

    const response = await agent.get("/todos");
    const parsedResponse = JSON.parse(response.text);

    const todoID = parsedResponse[parsedResponse.length - 1].id;

    res = await agent.get("/");
    csrfToken = extractCSRFToken(res.text);

    const deleteResponse = await agent.delete(`/todos/${todoID}`).send({
      _csrf: csrfToken,
    });
    expect(deleteResponse.statusCode).toBe(200);
  });
});
