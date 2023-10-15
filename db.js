const mongoose = require('mongoose')
require('dotenv').config()

module.exports = function createMongoDb(){
    mongoose.connect(process.env.MONGO_URI).then((result) => {console.log('connected')}).catch(err=>console.log(err))
}
