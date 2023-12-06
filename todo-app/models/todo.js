"use strict";
const { Model, Op } = require("sequelize");
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

    static overdue() {
      return this.findAll({
        where: {
          dueDate: {
            [Op.lt]: new Date(), // Using the less than (<) operator
          },
        },
      });
    }

    static todaydue() {
      return this.findAll({
        where: {
          dueDate: {
            [Op.eq]: new Date(), // Using the less than (<) operator
          },
        },
      });
    }

    static laterdue() {
      return this.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date(), // Using the less than (<) operator
          },
        },
      });
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
