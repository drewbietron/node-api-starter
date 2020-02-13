import { Sequelize } from 'sequelize';
import { config, configOptions } from './config';
export interface IDefaultModel {
  id: number;
  uuid: string;
  updatedAt: Date;
  createdAt: Date;
}

export const database = new Sequelize(config.url, {
  ...configOptions,
});

export default database;
