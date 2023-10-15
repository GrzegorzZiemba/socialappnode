// Modules importing
const express = require('express')


// From inside files importing
const db = require('./db')
const userRoutes = require('./routes/userRoutes')

const app = express()
// Middlewares
app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded()); //Parse URL-encoded bodies
app.use(userRoutes)


db()


app.get('/', (req,res) => {
    console.log("first")
    return res.send("hello")
})


app.listen(3000, () => {
    console.log("Working")
})