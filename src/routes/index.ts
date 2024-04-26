import express, { Router } from 'express'
import UserController from '../controllers/UserController'
import StudentController from '../controllers/StudentController'
import { AuthorizationMiddleware } from '../middlewares/authorization'

const router: Router = express.Router()

// Users
router.post('/users/auth', UserController.login)
router.get('/users', AuthorizationMiddleware, UserController.getAllUsers)
router.post('/users/create', AuthorizationMiddleware, UserController.signUp)

// Students
router.post('/students/create', AuthorizationMiddleware, StudentController.create)
router.post('/students/create/all', AuthorizationMiddleware, StudentController.createAll)
router.put('/students/:id', AuthorizationMiddleware, StudentController.update)
router.delete('/students/:ra', AuthorizationMiddleware, StudentController.delete)
router.get('/students', AuthorizationMiddleware, StudentController.findAll)

export default router