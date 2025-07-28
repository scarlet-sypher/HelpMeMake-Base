const express = require("express") ;
const app = express() ;
require("dotenv").config() ;
const db = require("./connection/conn") ;
const bodyParser = require("body-parser") ;
app.use(bodyParser.json()) ;

const PORT = process.env.PORT || 5000 ;

app.listen(PORT , () => {

    console.log("Server is running at port : " , PORT) ;
})





