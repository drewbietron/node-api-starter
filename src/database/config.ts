import Sequelize from "sequelize";
import Environment from "../environment";
import databaseLogger from "./logs";

new Environment(process.env.NODE_ENV).init();

export const configOptions: Sequelize.Options = {
  host: process.env.DATABASE_HOST,
  dialect: "postgres",
  ssl: ["production", "staging"].includes(process.env.NODE_ENV),
  dialectOptions: {
    ssl: ["production", "staging"].includes(process.env.NODE_ENV),
  },
  logging: process.env.DB_LOGS ? databaseLogger : false,
  benchmark: !["production", "staging"].includes(process.env.NODE_ENV),
};

export const config = {
  url: process.env.DATABASE_URL,
};
