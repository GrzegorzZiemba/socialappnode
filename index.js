// Modules importing
const express = require('express')
const cookieParser = require('cookie-parser')
const csrf = require('csurf')
const multer = require('multer');
// From inside files importing
const db = require('./db')
const isAuth = require('./middleware/isAuth')
// Routes imports
const userRoutes = require('./routes/userRoutes')
const postRoutes = require('./routes/postRoutes')


const app = express()
const csrfProtection = csrf({ cookie: true })
db()
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
// Middlewares
app.set('view engine', 'ejs')
app.use(cookieParser())
app.use(express.static(__dirname + '/public'));
app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded({extended: false})); //Parse URL-encoded bodies
app.use(upload.single('sampleFile'));
app.use(csrfProtection)
app.use(isAuth.authenticateToken, (req,res,next) => {
    res.locals.csrfToken = req.csrfToken()
    res.locals.isAuth = req.user
    next()
})

// Routes
app.use(userRoutes)
app.use(postRoutes)





app.listen(3000, () => {
    console.log("Working")
})