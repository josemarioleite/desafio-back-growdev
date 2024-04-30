import { Request, Response } from 'express'
import { Op } from 'sequelize'
import Student from '../models/student.model'

class StudentController {
  public static async create(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, cpf } = req.body
      const newStudent = await Student.create({ name, email, cpf })

      return res.status(201).json(newStudent)
    } catch (error) {
      return res.status(500).json({ message: 'Falha ao criar novo aluno' })
    }
  }

  public static async createAll(req: Request, res: Response): Promise<Response> {
    try {
      const studentsData = req.body as { name: string, email: string, cpf: string }[]
  
      if (!Array.isArray(studentsData)) {
        return res.status(400).json({ message: 'Corpo da requisição deve conter um array de alunos' })
      }
  
      const createdStudents = await Promise.all(studentsData.map(async student => {
        return await Student.create(student)
      }))
  
      return res.status(201).json(createdStudents)
    } catch (error) {
      return res.status(500).json({ message: 'Falha ao criar novos alunos' })
    }
  }

  public static async findAll(req: Request, res: Response): Promise<Response> {
    try {
      const search = req.query.search ? (req.query.search as string).trim() : ''
      const page = req.query.page ? parseInt(req.query.page as string) : 1
      const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : 5
      const offset = (page - 1) * pageSize

      const searchOption = search ? {
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } }
        ],
      } : {}

      const students = await Student.findAndCountAll({
        where: searchOption,
        limit: pageSize,
        offset: offset,
        order: [
          ['ra', 'DESC']
        ]
      })

      return res.status(200).json(students)
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao obter os alunos' })
    }
  }

  public static async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { ra } = req.params  
      const deletedStudent = await Student.findByPk(ra)
  
      if (!deletedStudent) {
        return res.status(404).json({ message: 'Aluno não encontrado' })
      }
  
      await deletedStudent.destroy()
  
      return res.status(200).json({ message: 'Aluno excluído com sucesso' })
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao excluir aluno' })
    }
  }
  
  public static async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params
      const { name, email } = req.body
  
      const updatedStudent = await Student.findByPk(id)
  
      if (!updatedStudent) {
        return res.status(404).json({ message: 'Aluno não encontrado' })
      }
  
      await updatedStudent.update({ name, email })
  
      return res.status(200).json({ message: 'O aluno foi atualizado com sucesso' })
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao atualizar aluno' })
    }
  }
}

export default StudentController
