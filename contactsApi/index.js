var contactsApi = {};
var BASE_API_PATH = "/api/v1"; //variable global

module.exports = contactsApi; //voy a exportar ese objeto

contactsApi.register = function(app,db) {
    console.log("Registering routs for contact API..");

    

    app.get(BASE_API_PATH + "/help", (req, res) => {
    res.redirect("https://documenter.getpostman.com/view/359472/collection/RVnWhyva");
});

    app.get(BASE_API_PATH + "/contacts", (req, res) => {
        console.log(Date() + " - GET /contacts");

        db.find({}, (err, contacts) => {
            if (err) {
                console.error("Error accesing DB");
                res.sendStatus(500);
                return;
            }

            res.send(contacts);
        });

    });

    app.post(BASE_API_PATH + "/contacts", (req, res) => {
        console.log(Date() + " - POST /contacts");
        var contact = req.body;
        contacts.push(contact);
        res.sendStatus(201);
    });

    app.put(BASE_API_PATH + "/contacts", (req, res) => {
        console.log(Date() + " - PUT /contacts");
        res.sendStatus(405);
    });

    app.delete(BASE_API_PATH + "/contacts", (req, res) => {
        console.log(Date() + " - DELETE /contacts");
        contacts = [];

        db.remove({});

        res.sendStatus(200);
    });


    app.get(BASE_API_PATH + "/contacts/:name", (req, res) => {
        var name = req.params.name;
        console.log(Date() + " - GET /contacts/" + name);

        res.send(contacts.filter((c) => {
            return (c.name == name);
        })[0]);
    });

    app.delete(BASE_API_PATH + "/contacts/:name", (req, res) => {
        var name = req.params.name;
        console.log(Date() + " - DELETE /contacts/" + name);

        contacts = contacts.filter((c) => {
            return (c.name != name);
        });

        res.sendStatus(200);
    });

    app.post(BASE_API_PATH + "/contacts/:name", (req, res) => {
        var name = req.params.name;
        console.log(Date() + " - POST /contacts/" + name);
        res.sendStatus(405);
    });

    app.put(BASE_API_PATH + "/contacts/:name", (req, res) => {
        var name = req.params.name;
        var contact = req.body;

        console.log(Date() + " - PUT /contacts/" + name);


        if (name != contact.name) {
            res.sendStatus(409);
            console.warn(Date() + " - Hacking attempt!");
            return;
        }

        db.update({ "name": contact.name }, contact, (err, numUpdated) => {
            console.log("Udapted: " + numUpdated);
        });

        res.sendStatus(200);
    });


};
