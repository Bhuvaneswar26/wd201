"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    markAsCompleted() {
      return this.update({ completed: true });
    }

    static allTodos() {
      return this.findAll();
    }

    static async addTodo(params) {
      return await Todo.create({
        title: params.title,
        dueDate: params.dueDate,
        completed: params.completed,
      });
    }

    static async deleteTodo(params) {
      return await Todo.destroy({
        where: {
          id: params,
        },
      });
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
