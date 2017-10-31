//dependencies
const express = require("express");
const app = express();
var methodOverride = require("method-override");
const PORT = process.env.PORT || 3000;
const bodyParser = require("body-parser");


// Import routes and give the server access to them.
app.use(express.static(__dirname + "/public"));
const routes = require("./controllers/router.js");
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", routes);


// Override with POST having ?_method=DELETE
app.use(methodOverride("_method"));


// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//listening to PORT
app.listen(PORT, function(){
    console.log("Listen on port: " + PORT);
})