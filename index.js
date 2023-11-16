// Modules importing
const express = require('express')
const cookieParser = require('cookie-parser')
const csrf = require('csurf')
const multer = require('multer');
const socketIo = require('socket.io');
const http = require('http');

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
const server = http.createServer(app);
const io = socketIo(server);
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

// Socket.io

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('chat message', (data) => {
        io.emit('chat message', data);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});




server.listen(3000, () => {
    console.log("Working")
})