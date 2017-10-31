// dependencies
var express = require("express");
var router = express.Router();
const cheerio = require("cheerio");
const request = require("request");
var mongoose = require("mongoose");
var Content = require("../models/model.js");

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/newsscrapper", {
  useMongoClient: true
});

//listen to GET request

router.get("/", function(req, res){
    res.render("index");
})

//listen to /getnews GET request and save content to databse
router.get("/getnews", function(req, res){
    //send request to reddit
    request("https://www.reddit.com/r/Bitcoin/", function(err, response, data){
        // data has form obj {resultArr: [{title:"abc", url: "abc"},.....]}
        var obj = {
            resultArr: []
        };
        const $ = cheerio.load(data);
        $("p.title").find("a.title").each(function(i, element){
            var title = $(this).text();
            var data_url = $(this).attr("data-href-url");
            if(data_url[0] == "/") {
                data_url = "https://www.reddit.com" + data_url;
            } else {
                data_url = $(this).attr("data-href-url");                
            }
            var content = {
                id: "modal" + i,
                title: title,
                url: data_url
            }
            obj.resultArr.push(content);
            //save obj to mongoDB database
            var data = {
                title: title,
                url: data_url
            }
            Content.create(data).then(function(dbContent){
                console.log("Content saved!");
            })
            .catch(function(err){
                console.log(err.message);
            });
        });
        res.render("index", obj);
    });
});

//POST request when click save button
router.get("/getArticle", function(req, res){
    res.send("Page is under construction");
})



module.exports = router;