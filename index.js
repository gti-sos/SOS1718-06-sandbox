var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");

var port = (process.env.PORT || 1607);
var BASE_API_PATH = "/api/v1";

var app = express();

app.use(bodyParser.json());

app.use("/",express.static(path.join(__dirname,"public")));

var contacts = [
        { 
            "name" : "pablo",
            "phone" : 12345   
        },
        { 
            "name" : "pepe",
            "phone" : 6789   
        }
    ];

app.get(BASE_API_PATH+"/contacts",(req,res)=>{
    console.log(Date() + " - GET /contacts");
    res.send(contacts);
});

app.post(BASE_API_PATH+"/contacts",(req,res)=>{
    console.log(Date() + " - POST /contacts");
    var contact = req.body;
    contacts.push(contact);
    res.sendStatus(201);
});

app.put(BASE_API_PATH+"/contacts",(req,res)=>{
    console.log(Date() + " - PUT /contacts");
    res.sendStatus(405);
});

app.delete(BASE_API_PATH+"/contacts",(req,res)=>{
    console.log(Date() + " - DELETE /contacts");
    contacts = [];
    res.sendStatus(200);
});


app.get(BASE_API_PATH+"/contacts/:name",(req,res)=>{
    var name = req.params.name;
    console.log(Date() + " - GET /contacts/"+name);
    
    res.send(contacts.filter((c)=>{
        return (c.name == name);
    })[0]);
});

app.delete(BASE_API_PATH+"/contacts/:name",(req,res)=>{
    var name = req.params.name;
    console.log(Date() + " - DELETE /contacts/"+name);
    
    contacts = contacts.filter((c)=>{
        return (c.name != name);
    });
    
    res.sendStatus(200);
});

app.post(BASE_API_PATH+"/contacts/:name",(req,res)=>{
    var name = req.params.name;
    console.log(Date() + " - POST /contacts/"+name);
    res.sendStatus(405);
});

app.put(BASE_API_PATH+"/contacts/:name",(req,res)=>{
    var name = req.params.name;
    var contact = req.body;
    
    console.log(Date() + " - PUT /contacts/"+name);
    
    if(name != contact.name){
        res.sendStatus(409);
        console.warn(Date()+" - Hacking attempt!");
        return;
    }
    
    contacts = contacts.map((c)=>{
        if(c.name == contact.name)
            return contact;
        else
            return c;
    });
    
    res.sendStatus(200);
});


app.listen(port,()=>{
    console.log("Server ready on port "+port+"!");
}).on("error",(e)=>{
    console.log("Server NOT READY:"+e);
});

console.log("Server setting up...");