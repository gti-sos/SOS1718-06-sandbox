var express = require("express");
var bodyParser = require("body-parser");
var DataStore = require("nedb");
var port = (process.env.PORT || 1607);

var BASE_API_PATH = "/api/v1";
var BASE_API_PATH_BUDGETS = "/api/v1/budgets-generals";
var BASE_API_PATH_HELP = "/api/v1/help";

var dbBudgets= __dirname + "budgets-generals.db";

var app = express();

app.use(bodyParser.json());
app.get(BASE_API_PATH_HELP,(req,res)=>{
    res.redirect("https://documenter.getpostman.com/collection/view/3895452-62614861-fe34-4ef4-83a2-a39409f16891#443a5885-f455-4f36-b0e1-3fc2a43728d1");
});


var budgets = [
        { 
            "community" : "andalucia",
            "year" : 2017,
            "section" : "parlamento-de-andalucia",
            "total-budget" : "45.479.748",
            "percentage-over-total" : 0.137,
        },
         { 
            "community" : "andalucia",
            "year" : 2017,
            "section" : "deuda-publica",
            "total-budget" : "4.162.050.097",
            "percentage-over-total" : 12.521,
        },
         { 
            "community" : "andalucia",
            "year" : 2017,
            "section" : "camara-de-cuentas",
            "total-budget" : "10.408.549",
            "percentage-over-total" : 31,
        },
         { 
            "community" : "andalucia",
            "year" : 2017,
            "section" : "consejeria-de-educacion",
            "total-budget" : "6.100.323.433",
            "percentage-over-total" : 18.353,
        },
         { 
            "community" : "andalucia",
            "year" : 2017,
            "section" : "consejeria-de-salud",
            "total-budget" : "725.885.406",
            "percentage-over-total" : 2.184,
        },
       
       
    ];
    
//////base de Datos de budgets////////
var db = new DataStore({  //inicializar base de datos
    filename: dbBudgets,
    autoload: true
}) ; 

//loadInitial de Budgets
app.get(BASE_API_PATH_BUDGETS + "/loadInitialData", (req, res) => {
    db.find({}, (err, budget) => {
        if (err) {
            console.error("Error accesing DB");
            res.sendStatus(500);
        }
        else if (budget.length == 0) {
            db.insert(budgets);
            budgets.push(budgets);
            console.log("DB initialized with " + budgets.length + " budgets");
            res.sendStatus(200)
        }
        else{
            console.log("DB initialized with " + budgets.length + " budgets.")
            res.sendStatus(200);
        }
    });
});
    
db.find({},(err,budgetsGenerals)=>{
    if(err){
        console.error("Error accesing DB");
        process.exit(1);
    }
    if(budgetsGenerals.length == 0){
        console.log("Empty DB");
        db.insert(budgets);
    }else{
        console.log("DB initialized with" + budgetsGenerals.length + " budgets");
    }
});    
//////-----budgets-generals------///////

app.get(BASE_API_PATH_BUDGETS,(req,res)=>{
    console.log(Date() + " - GET /budgets-generals");
    
    db.find({},(err,budgetsGenerals)=>{
    if(err){
        console.error("Error accesing DB");
        res.sendStatus(500);
        return;
    }
       res.send(budgets);
 
});

app.post(BASE_API_PATH_BUDGETS,(req,res)=>{
    console.log(Date() + " - POST /budgets-generals");
    db.insert(req.body, (err, budget) => {
        if (err) {
            console.error("Error accesing DB");
            res.sendStatus(500);
            return;
        }
        
        res.sendStatus(201);
    });
});

app.put(BASE_API_PATH_BUDGETS,(req,res)=>{ // debe dar un error de método no permitido
    console.log(Date() + " - PUT /budgets-generals"); 
    res.sendStatus(405);
});

app.delete(BASE_API_PATH_BUDGETS,(req,res)=>{
    console.log(Date() + " - DELETE /budgets-generals/");
    db.remove({});
    res.sendStatus(200);
});


app.get(BASE_API_PATH_BUDGETS+"/:section",(req,res)=>{
    var section = req.params.section;
    console.log(Date() + " - GET /budgets-generals/"+section);
    
    res.send(budgets.filter((b)=>{
        return (b.section == section);
    })[0]);
});


app.delete(BASE_API_PATH_BUDGETS+"/:section",(req,res)=>{
    var section = req.params.section;
    console.log(Date() + " - DELETE /budgets-generals/"+section);
    
    budgets = budgets.filter((b)=>{
        return (b.section != section);
    });
    
    res.sendStatus(200);
});

app.delete(BASE_API_PATH_BUDGETS+"/:section",(req,res)=>{
     var section1 = req.params.section;
    console.log(Date() + " - DELETE /budgets-generals/"+section);
     db.remove({section:section1}, {multi: true}, (err, budget) => {
        if (err) {
            console.error("Error accesing DB");
            res.sendStatus(500);
            return;
        }
        
        res.sendStatus(200);
    });
    
});

app.post(BASE_API_PATH_BUDGETS+"/:section",(req,res)=>{ //debe dar error de método no permitido
    var section = req.params.section;
    console.log(Date() + " - POST /budgets-generals/"+section);
    res.sendStatus(405);
});

app.put(BASE_API_PATH_BUDGETS+"/:section",(req,res)=>{
    var section = req.params.section;
    var b = req.body;
    
    console.log(Date() + " - PUT /budgets-generals/"+section);
    
   if (section != b.section) {
        res.sendStatus(409);
        console.warn(Date() + " - Hacking attempt!");
        return;
    }
    
    db.update({"section": b.section},b,(err,numUpdated)=>{
        if (err) {
            console.error("Error accesing DB");
            res.sendStatus(500);
            return;
        }
        console.log("Updated: " + numUpdated);
    });
    res.sendStatus(200);
});


app.listen(port,()=>{
    console.log("Server ready on port "+port+"!");
}).on("error",(e)=>{
    console.log("Server NOT READY:"+e);
});

console.log("Server setting up...");