
var express = require("express");
var bodyParser = require("body-parser");
var DataStore = require("nedb");

var contactsApi = require("./contactsApi");

var port = (process.env.PORT || 1607);

var dbFileName = __dirname + "/contacts.db";

var app = express();

app.use(bodyParser.json());

var intialContacts = [{
        "name": "pablo",
        "phone": 12345
    },
    {
        "name": "pepe",
        "phone": 6789
    }
];


var db = new DataStore({
    filename: dbFileName,
    autoload: true
});

db.find({}, (err, contacts) => {
    if (err) {
        console.error("Error accesing DB");
        process.exit(1);
    }

    if (contacts.length == 0) {
        console.log("Empty DB");
        db.insert(intialContacts);
    }
    else {
        console.log("DB initialized with " + contacts.length + " contacts");
    }

});

contactsApi.register(app,db); //una vez que se haya hecho la carga de los contactos

app.listen(port, () => {
    console.log("Server ready on port " + port + "!");
}).on("error", (e) => {
    console.log("Server NOT READY:" + e);
});

console.log("Server setting up...");