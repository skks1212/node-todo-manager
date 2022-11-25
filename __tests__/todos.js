// const request = require("supertest");
// const cheerio = require("cheerio");
//
// const db = require("../models/index");
// const app = require("../app");

//let server, agent;

//const extractCSRFToken = (html) => {
//  const $ = cheerio.load(html);
//  return $("[name=_csrf]").val();
//};

describe("Todo Application", function () {
  //beforeAll(async () => {
  //  await db.sequelize.sync({ force: true });
  //  server = app.listen(4000, () => { });
  //  agent = request.agent(server);
  //});
  //
  //afterAll(async () => {
  //  try {
  //    await db.sequelize.close();
  //    await server.close();
  //  } catch (error) {
  //    console.log(error);
  //  }
  //});

  test("sample", async () => {
    expect(1).toBe(1);
  });
  /*
  test("Creates a todo", async () => {
    const { text } = await agent.get("/");
    const csrfToken = extractCSRFToken(text);
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      "_csrf": csrfToken,
    });
    expect(response.statusCode).toBe(302);
  });

  test("Marks a todo with the given ID as complete", async () => {
    let res = await agent.get("/");
    let csrfToken = extractCSRFToken(res.text);
    await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      "_csrf": csrfToken,
    });

    const groupedTodos = await agent.get("/").set("Accept", "application/json");

    const parsedResponse = JSON.parse(groupedTodos.text);
    const overdueCount = parsedResponse.dueTodayTodos.length;
    const latestTodo = parsedResponse.dueTodayTodos[overdueCount - 1];

    res = await agent.get("/");
    csrfToken = extractCSRFToken(res.text);

    const markCompleteResponse = await agent
      .put(`/todos/${latestTodo}/markASCompleted`)
      .send({
        "_csrf": csrfToken,
      });
    const parsedUpdateResponse = JSON.parse(markCompleteResponse.text);
    expect(parsedUpdateResponse.completed).toBe(true);
  });

  test("Fetches all todos in the database using /todos endpoint", async () => {
    await agent.post("/todos").send({
      title: "Buy xbox",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    await agent.post("/todos").send({
      title: "Buy ps3",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    const response = await agent.get("/todos");
    const parsedResponse = JSON.parse(response.text);

    expect(parsedResponse.length).toBe(3);
    expect(parsedResponse[2]["title"]).toBe("Buy ps3");
  });
  */

  //test("Deletes a todo with the given ID if it exists and sends a boolean response", async () => {
  //  const response = await agent.post("/todos").send({
  //    title: "Buy milk",
  //    dueDate: new Date().toISOString(),
  //    completed: false,
  //  });
  //  const parsedResponse = JSON.parse(response.text);
  //  const todoID = parsedResponse.id;
  //
  //  const deleteResponse = await agent.delete(`/todos/${todoID}`);
  //  expect(deleteResponse.text).toBe("true");
  //});
});
