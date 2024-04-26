import { Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export const AuthorizationMiddleware = (req: any, res: Response, next: NextFunction) => {
  if (req.path === '/api/v1/users/auth' && req.method === 'POST') {
    return next()
  }

  const authHeader = req.headers['authorization']

  if (!authHeader || typeof authHeader !== 'string') {
    return res.status(401).json({ message: 'Sem autorização para acesso da rota' })
  }

  const token = authHeader.split(' ')[1]

  try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as { id: number }
      const userId = decodedToken.id

      req.user = { id: userId }

      next()
  } catch (error) {
    return res.status(401).json({ message: 'Houve um erro na verificação da autorização da rota' })
  }
}