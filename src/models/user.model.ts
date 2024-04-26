import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../orm/database'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

class User extends Model {
  public id!: number
  public name!: string
  public email!: string
  public password!: string

  public generateAuthToken(): string {
    return jwt.sign({ id: this.id }, process.env.JWT_SECRET!)
  }

  public async comparePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password)
  }
}

User.init(
  {
    id: {
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
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'user',
    hooks: {
      beforeCreate: async (user: User) => {
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)
      }
    }
  }
)

export default User