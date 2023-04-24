const express = require('express')
const myposts=require('./routes/myposts')
const post=require('./routes/posts')
const home=require('./routes/home')
const connectDB=require("./db/connect")
require("dotenv").config()
const app = express()

//middleware
app.use(express.json())

//route
app.use('/api/v1/myposts',myposts)
app.use('/api/v1/home',home)
app.use('/api/v1/posts',post)

const start = async ()=>{
    try{
        await connectDB(process.env.MONGO_URL)
        app.listen(process.env.PORT, () => console.log(`App listening on port ${process.env.PORT}!`))
    } catch(error){
        console.log(error)
    }
}

start()

