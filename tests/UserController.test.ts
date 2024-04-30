import { Request, Response } from 'express'
import User from '../src/models/user.model'
import UserController from '../src/controllers/UserController'

describe('UserController', () => {
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

  describe('signUp', () => {
    it('deve retornar 201 e o token se o usuário for criado com sucesso', async () => {
      const req = { body: { name: 'Teste', email: 'test@example.com', password: 'password123' } } as Request
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response
      const newUser = { generateAuthToken: jest.fn().mockReturnValue('token') }
      jest.spyOn(User, 'create').mockResolvedValue(newUser as any)
  
      await UserController.signUp(req, res)
  
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith({ user: newUser, token: 'token' })
    })
  
    it('deve retornar 500 se ocorrer um erro ao criar o usuário', async () => {
      const req = { body: { name: 'Teste', email: 'test@example.com', password: 'password123' } } as Request
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response
      jest.spyOn(User, 'create').mockRejectedValue(new Error('Erro ao criar usuário'))
  
      await UserController.signUp(req, res)
  
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ message: 'Não foi possível criar um novo usuário' })
    })
  })
  
  describe('getAllUsers', () => {
    it('deve retornar 200 e os usuários se forem encontrados', async () => {
      const users = [
        { id: 1, name: 'Usuário 1', email: 'user1@example.com' },
        { id: 2, name: 'Usuário 2', email: 'user2@example.com' }
      ]
      const req = {} as Request
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response
      jest.spyOn(User, 'findAll').mockResolvedValue(users as any)
  
      await UserController.getAllUsers(req, res)
  
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(users)
    })
  
    it('deve retornar 500 se ocorrer um erro ao obter os usuários', async () => {
      const req = {} as Request
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response
      jest.spyOn(User, 'findAll').mockRejectedValue(new Error('Erro ao obter usuários'))
  
      await UserController.getAllUsers(req, res)
  
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ message: 'Falha ao obter usuários' })
    })
  })
})