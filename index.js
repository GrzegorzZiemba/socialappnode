// Modules importing
const express = require('express')
const cookieParser = require('cookie-parser')
const csrf = require('csurf')

// From inside files importing
const db = require('./db')
const isAuth = require('./middleware/isAuth')
// Routes imports
const userRoutes = require('./routes/userRoutes')
const postRoutes = require('./routes/postRoutes')


const app = express()
const csrfProtection = csrf({ cookie: true })
db()
// Middlewares
app.set('view engine', 'ejs')
app.use(cookieParser())
app.use(express.static(__dirname + '/public'));
app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded({extended: false})); //Parse URL-encoded bodies
app.use(csrfProtection)
app.use(isAuth.authenticateToken, (req,res,next) => {
    res.locals.csrfToken = req.csrfToken()
    res.locals.isAuth = req.user
    next()
})

// Routes
app.use(userRoutes)
app.use(postRoutes)



app.get('/', (req,res) => {
    console.log("first")
    return res.send("hello")
})


app.listen(3000, () => {
    console.log("Working")
})