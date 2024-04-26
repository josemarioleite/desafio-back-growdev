import { Sequelize } from 'sequelize'

const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env

export const sequelize = new Sequelize(DB_NAME!, DB_USER!, DB_PASSWORD!, {
  host: DB_HOST!,
  port: parseInt(DB_PORT!),
  dialect: 'postgres'
})