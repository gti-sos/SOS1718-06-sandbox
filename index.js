var express = require("express");
var port = (process.env.PORT || 1607); //proces objeto definido para acceded a la variable de entorno PORT
var server = express();
var BASE_API_PATH = "/api/v1";
var contacts = [
    {
        "name" : "pablo",
        "phone" : "12345",
    },
    {
        "name" : "pepe",
        "phone" : "6789",
    }
    ];
    
var bodyParser = require("body-parser");
server.use(bodyParser.json());

server.use("/",express.static(__dirname+"/public")); //plugins(.static)

//server.get("/time",(req,res)=>{//dentro del objeto req la cabecera . Se ejectuta todo de manera asincrona(solo cuando se pide /time)
//    console.log("new resquest to /time");
//    res.send(new Date());
//});

server.get(BASE_API_PATH+"/contacts",(req,res)=>{//dentro del objeto req la cabecera . Se ejectuta todo de manera asincrona(solo cuando se pide /time)
    res.send(contacts);
});


server.post(BASE_API_PATH+ "/contacts",(req,res)=>{
   var contact = req.body;
   contacts.push(contact);
   res.sendStatus(201);
});

server.listen(port,()=>{
    console.log("server readyon porto "+port+"!!!!!"); //cuando se va iniciar de verdad el listen
}).on("error",(error)=>{
    console.log("server NOT readyon porto "+error); 
});

console.log("server setting up lul");