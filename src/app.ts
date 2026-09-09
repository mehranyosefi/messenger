import express from 'express'
import routes from "./routes/index"
import { AppError } from './utils/appError'
import globalErrorHandler from './controllers/ErrorController'
import helmet from "helmet";
import cors from "cors";
const app = express()

//middlewares
app.use(helmet())
//set cors middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


// Middleware to parse JSON
app.use(express.json())
app.use((req, res, next)=>{
  //the callbacks runs on event loop
  console.log('hello from global middleware')
  next()
})

//Routes
app.use('/api/v1', routes)

app.all('/*splat', (req, res, next)=>{
  // const err = new Error(`cant find ${ req.originalUrl } on this servier!`)
  // err.status = 'fail'
  // err.statusCode = 404
  const err = new AppError(`cant find ${ req.originalUrl } on this servier!`, 404)
  next(err)
})

//Global Erro Handler Middleware
app.use(globalErrorHandler)

if(process.env.NODE_ENV === 'development') {
  console.log('app running on development mode')
}

export default app

