import request from 'supertest'
import app from '../src/index'

const defaultRoute = '/api/v1/users'

describe('UserController', () => {
  it('deve receber todos os usuários', async () => {
    const response = await request(app).get(defaultRoute)

    expect(response.status).toBe(200)
  })

  it('deve criar um novo usuário', async () => {
    const response = await request(app)
      .post(defaultRoute)
      .send({ name: 'teste', email: 'teste@examplo.com' })

    expect(response.status).toBe(201)
})
})