const express = require('express')
const posts=require('./routes/posts')
const connectDB=require("./db/connect")
require("dotenv").config()
const app = express()

//middleware
app.use(express.json())

//route
app.use('/api/v1/posts',posts)

const start = async ()=>{
    try{
        await connectDB(process.env.MONGO_URL)
        app.listen(process.env.PORT, () => console.log(`App listening on port ${process.env.PORT}!`))
    } catch(error){
        console.log(error)
    }
}

start()

