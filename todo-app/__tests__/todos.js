const request = require("supertest");

const db = require("../models/index");
const app = require("../app");

let server, agent;

describe("Todo Application", function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(3000, () => {});
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

  test("Creates a todo and responds with JSON at /todos POST endpoint", async () => {
    const response = await agent
      .post("/todos")
      .set("Accept", "application/json")
      .send({
        title: "Buy milk",
        dueDate: new Date().toISOString(),
        completed: false,
      });

    expect(response.statusCode).toBe(200);
    expect(response.header["content-type"]).toMatch(/application\/json/);
    const parsedResponse = JSON.parse(response.text);
    expect(parsedResponse.id).toBeDefined();
  });

  test("Marks a todo with the given ID as complete", async () => {
    const createResponse = await agent
      .post("/todos")
      .set("Accept", "application/json")
      .send({
        title: "Buy milk",
        dueDate: new Date().toISOString(),
        completed: false,
      });

    const todoID = createResponse.body.id;
    expect(createResponse.body.completed).toBe(false);

    const markCompleteResponse1 = await agent
      .put(`/todos/${todoID}`)
      .set("Accept", "application/json")
      .send({
        completed: false,
      });
    const parsedUpdateResponse = markCompleteResponse1.body;
    expect(parsedUpdateResponse.completed).toBe(true);
    const markCompleteResponse2 = await agent
      .put(`/todos/${todoID}`)
      .set("Accept", "application/json")
      .send({
        completed: true,
      });

    const parsedUpdateResponse2 = markCompleteResponse2.body;
    expect(parsedUpdateResponse2.completed).toBe(false);
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

    expect(parsedResponse.length).toBe(4);
    expect(parsedResponse[3]["title"]).toBe("Buy ps3");
  });

  test("Deletes a todo with the given ID if it exists and sends a boolean response", async () => {
    const response = await agent
      .post("/todos")
      .set("Accept", "application/json")
      .send({
        title: "Buy milk",
        dueDate: new Date().toISOString(),
        completed: false,
      });

    expect(response.statusCode).toBe(200);
    expect(response.header["content-type"]).toMatch(/application\/json/);

    const parsedResponse = JSON.parse(response.text);
    const todoID = parsedResponse.id;
    const response2 = await agent.delete(`/todos/${todoID}`);
    const parsedResponses = JSON.parse(response2.text);
    expect(parsedResponses).toBe(true);
  });
});
