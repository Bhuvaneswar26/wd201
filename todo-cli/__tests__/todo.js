/* eslint-disable no-undef */
const todo_list = require("../todo");

const { all, add, markAsComplete, overdue, dueToday, dueLater } = todo_list();

describe("Todo list Test Suite", () => {
  beforeAll(() => {
    add({
      titile: "Test todo",
      completed: false,
      dueDate: new Date().toISOString().slice(0, 10),
    });
    add({
      titile: "Test todo",
      completed: false,
      dueDate: new Date().toISOString().slice(0, 10),
    });
    add({
      titile: "Test todo",
      completed: false,
      dueDate: new Date().toISOString().slice(0, 10),
    });
  });
  test("creating a new todo", () => {
    let len = all.length;
    add({
      titile: "Test todo",
      completed: false,
      dueDate: new Date().toISOString().slice(0, 10),
    });
    len += 1;
    expect(all.length).toBe(len);
  });

  test("marking a todo as completed.", () => {
    expect(all[0].completed).toBe(false);
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
  });

  test("retrieval of overdue items", () => {
    const todate = new Date().toISOString().slice(0, 10);
    const odate = overdue();
    let status = true;
    odate.forEach((item) => {
      if (item.dueDate >= todate) status = false;
    });
    expect(status).toBe(true);
  });

  test("retrieval of due today items", () => {
    const todate = new Date().toISOString().slice(0, 10);
    const tdate = dueToday();
    let status = true;
    tdate.forEach((item) => {
      if (item.dueDate != todate) status = false;
    });
    expect(status).toBe(true);
  });

  test("retrieval of due later items", () => {
    const todate = new Date().toISOString().slice(0, 10);
    const ldate = dueLater();
    let status = true;
    ldate.forEach((item) => {
      if (item.dueDate <= todate) status = false;
    });
    expect(status).toBe(true);
  });
});
