import { Request, Response } from 'express'
import User from '../models/user.model'

class UserController {
  public static async getAllUsers(req: Request, res: Response): Promise<Response> {
    try {
      const users = await User.findAll()
      
      return res.status(200).json(users)
    } catch (error) {
      return res.status(500).json({message: 'Falha ao obter usuários'})
    }
  }

  public static async signUp(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, password } = req.body
      const newUser = await User.create({ name, email, password })
      const token = newUser.generateAuthToken()

      return res.status(201).json({ user: newUser, token })
    } catch (error) {
      return res.status(500).json({ message: 'Não foi possível criar um novo usuário' })
    }
}

  public static async login(req: Request, res: Response): Promise<Response> {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ where: { email } })

        if (!user) {
          return res.status(400).json({ message: 'E-mail ou senha não encontrados' })
        }

        const isPasswordValid = await user!.comparePassword(password)

        if (!isPasswordValid) {
          return res.status(400).json({ message: 'E-mail ou senha inválidos' })
        }

        const token = user!.generateAuthToken()

        return res.status(200).json({ user, token })
    } catch (error) {
        return res.status(500).json({ message: 'Não foi possível fazer login' })
    }
  }
}

export default UserController