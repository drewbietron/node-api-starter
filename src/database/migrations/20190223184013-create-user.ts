import Sequelize from "sequelize";

export const createUser = {
  up: (queryInterface: Sequelize.QueryInterface) => {
    return Promise.all([
      queryInterface.createTable("users", {
        id: {
          allowNull: false,
          type: Sequelize.INTEGER,
          autoIncrement: true,
        },
        uuid: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.STRING,
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        first_name: {
          type: Sequelize.STRING,
        },
        last_name: {
          type: Sequelize.STRING,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        password: {
          type: Sequelize.STRING,
        },
      }),
    ]);
  },
  down: (queryInterface: Sequelize.QueryInterface) => {
    return Promise.all([queryInterface.dropTable("users")]);
  },
};

export default createUser;
