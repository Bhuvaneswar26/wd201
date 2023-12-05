// models/todo.js
"use strict";
const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    
    static async addTask(params) {
      return await Todo.create(params);

    }
    static async showList() {
      console.log("My Todo list \n");

      console.log("Overdue");
      // FILL IN HERE

      let od = await Todo.overdue();

      let ods = od
        .map((item) => {
          console.log(item.displayableString());
        })
        .join("/n");

      console.log(ods);

      console.log("\n");

      console.log("Due Today");
      // FILL IN HERE

      let ot = await Todo.dueToday();

      let ots = ot
        .map((item) => {
          console.log(item.displayableString());
        })
        .join("\n");

      console.log(ots);

      console.log("\n");

      console.log("Due Later");
      // FILL IN HERE

      let ol = await Todo.dueLater();

      let ols = ol
        .map((item) => {
          console.log(item.displayableString());
        })
        .join("\n");

      console.log(ols);
    }

    static async overdue() {
      // FILL IN HERE TO RETURN OVERDUE ITEMS

      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.lt]: new Date(),
          },
        },
      });
    }

    static async dueToday() {
      // FILL IN HERE TO RETURN ITEMS DUE TODAY
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.eq]: new Date().toISOString().split("T")[0],
          },
        },
      });
    }

    static async dueLater() {
      // FILL IN HERE TO RETURN ITEMS DUE LATER
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date().toISOString().split("T")[0],
          },
        },
      });
    }

    static async markAsComplete(id) {
      // FILL IN HERE TO MARK AN ITEM AS COMPLETE
      return await Todo.update(
        { completed: true },
        {
          where: {
            id: id,
          },
        },
      );
    }

    displayableString() {
      let checkbox = this.completed ? "[x]" : "[ ]";
      const cd = new Date();
      const cds = cd.toISOString().split("T")[0];
      if (this.dueDate === cds) {
        return `${this.id}. ${checkbox} ${this.title}`;
      } else {
        return `${this.id}. ${checkbox} ${this.title} ${this.dueDate}`;
      }
    }
  }
  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    },
  );
  return Todo;
};
