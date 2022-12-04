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

    static addTodo({ title, dueDate }) {
      return this.create({ title: title, dueDate: dueDate, completed: false });
    }

    static getTodos() {
      return this.findAll({
        order: [["id", "ASC"]],
      });
    }

    static overdue() {
      return this.findAll({
        where: {
          completed: false,
          dueDate: {
            [Op.lt]: new Date().toISOString(),
          },
        },
      });
    }

    static dueToday() {
      return this.findAll({
        where: {
          completed: false,
          dueDate: {
            [Op.eq]: new Date().toISOString(),
          },
        },
      });
    }

    static dueLater() {
      return this.findAll({
        where: {
          completed: false,
          dueDate: {
            [Op.gt]: new Date().toISOString(),
          },
        },
      });
    }

    static completed() {
      return this.findAll({
        where: {
          completed: true,
        },
      });
    }

    setCompletionStatus(completed) {
      return this.update({ completed });
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
    }
  );
  return Todo;
};
