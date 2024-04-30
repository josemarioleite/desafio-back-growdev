import { Request, Response } from 'express'
import Student from '../src/models/student.model'
import StudentController from '../src/controllers/StudentController'

describe('StudentController', () => {
  describe('create', () => {
    it('deve retornar 201 e o aluno criado', async () => {
      const req = { body: { name: 'Teste', email: 'test@example.com', cpf: '12345678901' } } as Request
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response

      const newStudent = { id: 1, name: 'Teste', email: 'test@example.com', cpf: '12345678901' }

      jest.spyOn(Student, 'create').mockResolvedValue(newStudent as any)

      await StudentController.create(req, res)

      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(newStudent)
    })

    it('deve retornar 500 se ocorrer um erro ao criar o aluno', async () => {
      const req = { body: { name: 'Teste', email: 'test@example.com', cpf: '12345678901' } } as Request
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response

      jest.spyOn(Student, 'create').mockRejectedValue(new Error('Erro ao criar aluno'))

      await StudentController.create(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ message: 'Falha ao criar novo aluno' })
    })
  })

  describe('createAll', () => {
    it('deve retornar 201 e os alunos criados se forem enviados como um array válido', async () => {
      const req = {
        body: [
          { name: 'Aluno 1', email: 'aluno1@example.com', cpf: '12345678901' },
          { name: 'Aluno 2', email: 'aluno2@example.com', cpf: '23456789012' }
        ]
      } as Request
  
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response
      const createdStudents = [
        { id: 1, name: 'Aluno 1', email: 'aluno1@example.com', cpf: '12345678901' },
        { id: 2, name: 'Aluno 2', email: 'aluno2@example.com', cpf: '23456789012' }
      ]

      jest.spyOn(Student, 'create').mockImplementation((studentData: any) => {
        const matchingStudent = createdStudents.find(student => student.email === studentData.email)
        return Promise.resolve(matchingStudent)
      })
  
      await StudentController.createAll(req, res)
  
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(createdStudents)
    })
  
    it('deve retornar 400 se os dados dos alunos não forem enviados como um array', async () => {
      const req = { body: { name: 'Aluno', email: 'aluno@example.com', cpf: '12345678901' } } as Request
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response
  
      await StudentController.createAll(req, res)
  
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ message: 'Corpo da requisição deve conter um array de alunos' })
    })
  
    it('deve retornar 500 se ocorrer um erro ao criar os alunos', async () => {
      const req = {
        body: [
          { name: 'Aluno 1', email: 'aluno1@example.com', cpf: '12345678901' },
          { name: 'Aluno 2', email: 'aluno2@example.com', cpf: '23456789012' }
        ]
      } as Request

      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response

      jest.spyOn(Student, 'create').mockRejectedValue(new Error('Erro ao criar aluno'))
  
      await StudentController.createAll(req, res)
  
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ message: 'Falha ao criar novos alunos' })
    })
  })

  describe('findAll', () => {
    it('deve retornar 200 e os alunos encontrados', async () => {
      const req = { query: { search: '', page: '1', pageSize: '5' } } as any as Request
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response

      const students = {
        rows: [
          { id: 1, name: 'Aluno 1', email: 'aluno1@example.com', cpf: '12345678901' },
          { id: 2, name: 'Aluno 2', email: 'aluno2@example.com', cpf: '23456789012' }
        ],
        count: 2
      }

      jest.spyOn(Student, 'findAndCountAll').mockResolvedValue(students as any)
  
      await StudentController.findAll(req, res)
  
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(students)
    })
  
    it('deve retornar 200 e uma lista vazia se não houver alunos encontrados', async () => {
      const req = { query: { search: '', page: '1', pageSize: '5' } } as any as Request
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response

      const students = { rows: [], count: 0 }

      jest.spyOn(Student, 'findAndCountAll').mockResolvedValue(students as any)
  
      await StudentController.findAll(req, res)
  
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(students)
    })
  
    it('deve retornar 500 se ocorrer um erro ao obter os alunos', async () => {
      const req = { query: { search: '', page: '1', pageSize: '5' } } as any as Request
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response

      jest.spyOn(Student, 'findAndCountAll').mockRejectedValue(new Error('Erro ao obter alunos'))
  
      await StudentController.findAll(req, res)
  
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao obter os alunos' })
    })
  })

  describe('delete', () => {
    it('deve retornar 200 e uma mensagem de sucesso ao excluir o aluno', async () => {
      const req = { params: { ra: '12345' } } as any as Request
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response
  
      const deletedStudent = { id: 1, name: 'Aluno', email: 'aluno@example.com', cpf: '12345678901' }

      const destroyMock = jest.fn().mockResolvedValue(null)
      const studentInstance = Student.build(deletedStudent)

      jest.spyOn(Student, 'findByPk').mockResolvedValue(studentInstance as any)
      jest.spyOn(studentInstance, 'destroy').mockImplementation(destroyMock)
  
      await StudentController.delete(req, res)
  
      expect(Student.findByPk).toHaveBeenCalledWith('12345')
      expect(destroyMock).toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({ message: 'Aluno excluído com sucesso' })
    })
  
    it('deve retornar 404 se o aluno não for encontrado', async () => {
      const req = { params: { ra: '12345' } } as any as Request
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response

      jest.spyOn(Student, 'findByPk').mockResolvedValue(null)
  
      await StudentController.delete(req, res)
  
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'Aluno não encontrado' })
    })
  
    it('deve retornar 500 se ocorrer um erro ao excluir o aluno', async () => {
      const req = { params: { ra: '12345' } } as any as Request
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response

      const deletedStudent = { id: 1, name: 'Aluno', email: 'aluno@example.com', cpf: '12345678901' }

      jest.spyOn(Student, 'findByPk').mockResolvedValue(deletedStudent as any)

      const destroyMock = jest.fn().mockRejectedValue(new Error('Erro ao excluir aluno'))
      const studentInstance = Student.build(deletedStudent)

      jest.spyOn(studentInstance as any, 'destroy').mockImplementation(destroyMock)
  
      await StudentController.delete(req, res)
  
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao excluir aluno' })
    })
  })

  describe('update', () => {
    it('deve retornar 200 e uma mensagem de sucesso ao atualizar o aluno', async () => {
      const req = { params: { id: '1' }, body: { name: 'Novo Nome', email: 'novoemail@example.com' } } as any as Request
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response

      const updatedStudent = { id: 1, name: 'Novo Nome', email: 'novoemail@example.com', cpf: '12345678901' }
      const studentInstance = Student.build(updatedStudent)

      jest.spyOn(Student, 'findByPk').mockResolvedValue(studentInstance as any)

      const updateMock = jest.fn().mockResolvedValue(null)

      jest.spyOn(studentInstance, 'update').mockImplementation(updateMock)
  
      await StudentController.update(req, res)
  
      expect(Student.findByPk).toHaveBeenCalledWith('1')
      expect(updateMock).toHaveBeenCalledWith({ name: 'Novo Nome', email: 'novoemail@example.com' })
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({ message: 'O aluno foi atualizado com sucesso' })
    })
  
    it('deve retornar 404 se o aluno não for encontrado', async () => {
      const req = { params: { id: '1' }, body: { name: 'Novo Nome', email: 'novoemail@example.com' } } as any as Request
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response

      jest.spyOn(Student, 'findByPk').mockResolvedValue(null)
  
      await StudentController.update(req, res)
  
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'Aluno não encontrado' })
    })
  
    it('deve retornar 500 se ocorrer um erro ao atualizar o aluno', async () => {
      const req = { params: { id: '1' }, body: { name: 'Novo Nome', email: 'novoemail@example.com' } } as any as Request
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response

      const updatedStudent = { id: 1, name: 'Novo Nome', email: 'novoemail@example.com', cpf: '12345678901' }
      const studentInstance = Student.build(updatedStudent)

      jest.spyOn(Student, 'findByPk').mockResolvedValue(studentInstance as any)

      const updateMock = jest.fn().mockRejectedValue(new Error('Erro ao atualizar aluno'))

      jest.spyOn(studentInstance, 'update').mockImplementation(updateMock)
  
      await StudentController.update(req, res)
  
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao atualizar aluno' })
    })
  })
})
