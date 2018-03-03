var express = require("express");//cargar modulo
var app = express();

app.get("/hello",(req,res)=>{
    res.send("hello");
})

app.listen(process.env.PORT);

