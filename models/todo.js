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
      Todo.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }

    static addTodo({ title, dueDate, userId }) {
      return this.create({
        title: title,
        dueDate: dueDate,
        completed: false,
        userId,
      });
    }

    static getTodos(userId) {
      return this.findAll({
        order: [["id", "ASC"]],
        where: {
          userId,
        },
      });
    }

    static overdue(userId) {
      return this.findAll({
        where: {
          userId,
          completed: false,
          dueDate: {
            [Op.lt]: new Date(),
          },
        },
      });
    }

    static dueToday(userId) {
      return this.findAll({
        where: {
          userId,
          completed: false,
          dueDate: {
            [Op.eq]: new Date(),
          },
        },
      });
    }

    static dueLater(userId) {
      return this.findAll({
        where: {
          userId,
          completed: false,
          dueDate: {
            [Op.gt]: new Date(),
          },
        },
      });
    }

    static completed(userId) {
      return this.findAll({
        where: {
          userId,
          completed: true,
        },
      });
    }

    static async remove(userId) {
      return this.destroy({
        where: {
          userId,
        },
      });
    }

    setCompletionStatus(completed, userId) {
      return this.update({ completed }, { where: { id: this.id, userId } });
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
