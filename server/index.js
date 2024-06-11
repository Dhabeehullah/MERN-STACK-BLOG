const express = require("express")
const cors = require("cors")
const {connect} = require("mongoose")
const upload= require('express-fileupload')
require("dotenv").config()

const userRoutes = require('./routes/userRoutes')
const postRoutes = require('./routes/postRoutes')
const {noFound,errorHandling} = require('./middleware/error-middleware')

const app = express()
app.use(express.json({extended:true}))  
app.use(express.urlencoded({extended:true}))                  
app.use(cors({credentials:true,origin:['https://main--stalwart-alpaca-9fb951.netlify.app','https://6663413574013c04116be965--stalwart-alpaca-9fb951.netlify.app','http://localhost:3000']}))
app.use(upload())
app.use('/uploads',express.static(__dirname + '/uploads'))

app.use("/api/users",userRoutes)
app.use("/api/posts",postRoutes)

app.use(noFound)
app.use(errorHandling)

connect(process.env.MONGODB_URL).then(app.listen(5000,() => console.log(`server running at port ${process.env.PORT}`)))
.catch(error => {console.log(error.message)})

