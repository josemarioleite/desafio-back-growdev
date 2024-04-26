import dotenv from 'dotenv'
dotenv.config()

import express, { Application } from 'express'
import { AuthorizationMiddleware } from './middlewares/authorization'
import routes from './routes/index'
const cors = require('cors')

const app: Application = express()
const PORT = process.env.API_PORT || 3800

app.use(cors())
app.use(AuthorizationMiddleware)
app.use(express.json())
app.use('/api/v1', routes)

app.listen(PORT, () => {
  console.log(`API na porta: ${PORT}`)
})

export default app