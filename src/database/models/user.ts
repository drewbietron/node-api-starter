import Sequelize, { Model } from "sequelize";
import uuid from "uuid/v4";
import bcrypt from "bcrypt";

import database, { IDefaultModel } from "../database";

async function saltPassword(password) {
  return bcrypt.hash(password, 12);
}

export interface IUser extends IDefaultModel {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
}

export class User extends Model implements IUser {
  public readonly id: number;
  public readonly uuid: string;
  public readonly updatedAt: Date;
  public readonly createdAt: Date;
  public firstName: string;
  public lastName: string;
  public email: string;
  public password?: string;
}

User.init(
  {
    createdAt: {
      type: Sequelize.DATE,
      field: "created_at"
    },
    updatedAt: {
      type: Sequelize.DATE,
      field: "updated_at"
    },
    uuid: {
      type: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
      defaultValue: () => uuid(),
      validate: {
        isUUID: 4
      }
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    firstName: {
      type: Sequelize.STRING,
      field: "first_name",
      allowNull: false
    },
    lastName: {
      type: Sequelize.STRING,
      field: "last_name",
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8, 256],
          msg: "Password must be at least 8 charcters"
        }
      }
    }
  },
  {
    sequelize: database,
    timestamps: true,
    underscored: true,
    tableName: "users"
  }
);

User.addHook("beforeCreate", async (user: User) => {
  if (user.changed("password")) {
    /* eslint-disable-next-line  no-param-reassign */
    user.password = await saltPassword(user.password);
  }
});

User.addHook("beforeUpdate", async (user: User) => {
  if (user.changed("password")) {
    /* eslint-disable-next-line  no-param-reassign */
    user.password = await saltPassword(user.password);
  }
});

export default User;
