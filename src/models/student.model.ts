// models/Student.ts

import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../orm/database'

class Student extends Model {
  public ra!: number
  public name!: string
  public email!: string
  public cpf!: string
}

Student.init(
  {
    ra: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    cpf: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    }
  },
  {
    sequelize,
    modelName: 'students',
  }
)

export default Student
