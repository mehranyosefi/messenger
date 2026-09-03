import dotenv from "dotenv"
// import mongoose from "mongoose"
import connectToMongoDB from "./database"

dotenv.config({path: './.env'})
import app from "../app"

const port = process.env.PORT || 3000

connectToMongoDB()

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
//Errors outside Express
process.on('unhandledRejection', err=> {
  // console.log(err.name, err.message)
  console.log('Unhandled rejection. Shutting down ...')

  server.close(()=> process.exit(1))
})