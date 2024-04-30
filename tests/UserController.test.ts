import { Request, Response } from 'express'
import User from '../src/models/user.model'
import UserController from '../src/controllers/UserController'

describe('login', () => {
  it('deve retornar 200 e o token se o e-mail e a senha estiverem corretos', async () => {
    const req = { body: { email: 'test@example.com', password: 'password123' } } as Request
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response
    const user = { comparePassword: jest.fn().mockResolvedValue(true), generateAuthToken: jest.fn().mockReturnValue('token') }
    jest.spyOn(User, 'findOne').mockResolvedValue(user as any)

    await UserController.login(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ user, token: 'token' })
  })

  it('deve retornar 400 se o e-mail não for encontrado', async () => {
    const req = { body: { email: 'nonexistent@example.com', password: 'password123' } } as Request
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response
    jest.spyOn(User, 'findOne').mockResolvedValue(null)

    await UserController.login(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ message: 'E-mail ou senha não encontrados' })
  })

  it('deve retornar 400 se a senha estiver incorreta', async () => {
    const req = { body: { email: 'test@example.com', password: 'wrongpassword' } } as Request
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response
    const user = { comparePassword: jest.fn().mockResolvedValue(false) }
    jest.spyOn(User, 'findOne').mockResolvedValue(user as any)

    await UserController.login(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ message: 'E-mail ou senha inválidos' })
  })

  it('deve retornar 500 se ocorrer um erro', async () => {
    const req = { body: { email: 'test@example.com', password: 'password123' } } as Request
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response
    jest.spyOn(User, 'findOne').mockRejectedValue(new Error('Erro no banco de dados'))

    await UserController.login(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ message: 'Não foi possível fazer login' })
  })
})