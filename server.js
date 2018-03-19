var express = require("express");
var bodyParser = require("body-parser");
var path = require('path');
var logger = require("morgan");
var mongoose = require("mongoose");
var request = require("request");
var hbs = require('express-handlebars');
var mongojs = require("mongojs");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");
 
var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();
const routes = require("./routes");

app.use(routes);

// Configure middleware
app.set('views', path.join(__dirname, './views'));
app.engine('hbs', hbs({extname: '.hbs', defaultLayout: 'main'}));
app.set('view engine', 'hbs');
// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
// app.use(express.static("public"));

// By default mongoose uses callbacks for async queries, we're setting it to use promises (.then syntax) instead
// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {});

//scraping method
app.get("/scrape", function(req, res){
    console.log("Scraping!");
    var results = [];
    var npr = "https://www.npr.org/sections/national/"
    axios.get(npr).then(function(response) {
        
        // Load the HTML into cheerio and save it to a variable
        // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
        var $ = cheerio.load(response.data);
        // console.log(response.data)
        
        // An empty array to save the data that we'll scrape
        var results = [];

        var parentSelector = "article.item";

        // // Select each element in the HTML body from which you want information.
        // // NOTE: Cheerio selectors function similarly to jQuery's selectors,
        // // but be sure to visit the package's npm page to see how it works
        $(parentSelector).each(function(i, element) {

        //     // Save these results in an object that we'll push into the results array we defined earlier
            results.push({
                url: $(element).find("a").attr("href"),
                title: $(element).find("h2.title").text(),
                blurb: $(element).find("p.teaser").text()
            });
        });
        // //save to the DB
        // for (let i = 0; i < results.length; i++) {
        //     db.Headline.create({"title": results[i].title, "blurb": results[i].blurb, "url": results[i].url}, function(err, docs){
                
        //     });
        // }
        console.log("saved to DB");
    
        res.render('index', {title: 'NPR news scraper!', results});
    })    
});

//--------------------------------------------------------------------------------------------//

//save articles to db by clicking on "save this article"
app.post('/save', function(req, res) {
    // console.log("this is the title: " + req.body.title);
    // console.log("this is the url: " + req.body.url);
    // console.log("this is the blurb: " + req.body.blurb)
    var newArticleObject = {
        title: req.body.title,
        url: req.body.url,
        blurb: req.body.blurb
    };
    db.Headline.create(newArticleObject)
        .then(function(dbarticle){
            console.log("saved a headline!")
            //res.redirect("/saved");
        })
        .catch(function(err){
            return res.json(err);      
        })
});

//--------------------------------------------------------------------------------------------//
//find all saved headlines and display to "/saved"
app.get('/saved', function(req, res){
    var results = [];
    db.Headline.find({},function(error, newArticleObject){
        for (let i = 0; i < newArticleObject.length; i++) {
            const element = newArticleObject[i];
            results.push({
                id: element._id,
                title: element.title,
                url: element.url,
                blurb: element.blurb
            })
        }
        res.render('saved', {title: 'Your NPR saved articles!', results, message: "DB Articles!"});
    });
});

//--------------------------------------------------------------------------------------------//

//delete certain headlines
app.post("/delete/:id", function(req, res){
    var id = req.params.id;
    console.log("Article ID: " + id);

    db.Headline.findOneAndRemove({"_id": id}, function(err, doc){
        if (err){
            console.log("Error with delete", err)
        }
        else {
            console.log("Deleted headline", doc);
            res.redirect("/saved");
        }
    })
});

//--------------------------------------------------------------------------------------------//

//retrieve other notes from the db associated from a certain headline
app.get("/articles/:id", function(req, res){
    console.log("/articles", req.params.id);
    var id = req.params.id;

    db.Headline.findOne({"_id": id})
    .populate("notes")
    .then(function(doc){
        console.log(doc)
        res.json(doc);
    }).catch(function(err){
        res.json(err);
    })
});

//--------------------------------------------------------------------------------------------//

//save new Note to the db and associate it with a article
app.post("/articles/:id", function(req, res){
    var articleId = req.params.id
    db.Note.create(req.body)
        .then(function(dbNote){

            return db.Headline.findOneAndUpdate({"_id": articleId}, {$push:{notes:dbNote._id}}, { new:true });
        })
        .then(function(newArticleObject){
            console.log("Note with article: " + newArticleObject);
            res.redirect("/articles");
        })
        .catch(function(err){
            console.log(err);
            res.json(err);
        })
})

//--------------------------------------------------------------------------------------------//

//"populated user" route
app.get("/articles", function(req, res){
    db.Headline.find({})
    .populate("notes")
    .then(function(db){
        console.log(db);
        res.json(db);
    })
    .catch(function(err){
        res.json(err)
    })
});

//--------------------------------------------------------------------------------------------//
// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});