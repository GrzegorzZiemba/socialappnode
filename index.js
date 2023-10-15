// Modules importing
const express = require('express')



// From inside files importing
const db = require('./db')


const app = express()
db()


app.get('/', (req,res) => {
    console.log("first")
    return res.send("hello")
})


app.listen(3000, () => {
    console.log("Working")
})