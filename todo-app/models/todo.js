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

    setCompletionStatus(params) {
      return this.update({ completed: !params });
    }

    static allTodos() {
      return this.findAll();
    }

    static overdue() {
      return this.findAll({
        where: {
          [Op.and]: {
            dueDate: { [Op.lt]: new Date() },
            completed: { [Op.not]: true },
          },
        },
      });
    }

    static todaydue() {
      return this.findAll({
        where: {
          [Op.and]: {
            dueDate: { [Op.eq]: new Date() },
            completed: { [Op.not]: true },
          },
        },
      });
    }

    static laterdue() {
      return this.findAll({
        where: {
          [Op.and]: {
            dueDate: { [Op.gt]: new Date() },
            completed: { [Op.not]: true },
          },
        },
      });
    }

    static completedtodos() {
      return this.findAll({
        where: {
          completed: true,
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
