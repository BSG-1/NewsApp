var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var request = require("request")

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// By default mongoose uses callbacks for async queries, we're setting it to use promises (.then syntax) instead
// Connect to the Mongo DB

mongoose.Promise = Promise;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
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
        
        var parentSelector = "article.item";

        // // Select each element in the HTML body from which you want information.
        // // NOTE: Cheerio selectors function similarly to jQuery's selectors,
        // // but be sure to visit the package's npm page to see how it works
        $(parentSelector).each(function(i, element) {

        //     // Save these results in an object that we'll push into the results array we defined earlier
            results.push({
                url: $(element).find("a").attr("href"),
                title: $(element).find("h2.title").text(),
                blurb: $(element).find("p.teaser").text(),
            })
        });

        for (let i = 0; i < results.length; i++) {
            db.Headline.create({"title": results[i].title, "blurb": results[i].blurb, "url": results[i].url}, function(err, docs){
                
            });
        }
        console.log("saved to DB");
    
        res.send(results);
    })
});






// 2: All: Send JSON response with all articles
// app.get("/all", function(req, res) {
//     // Query: In our database, go to the animals collection, then "find" everything
//     db.Headlines.find({}, function(err, results) {
//       // Log any errors if the server encounters one
//       if (err) {
//         console.log(err);
//       }
//       else {
//         // Otherwise, send the result of this query to the browser
//         res.json(results);
//       }
//     });
// });
// ---------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------//

app.get("/test", function(req, res) {
  // TODO: Finish the route so it grabs all of the articles
  db.Headline.create({'headline': 'test', }, function(err, articles){
    if (err) {
      res.json(err)
    }else{
      res.json(articles);
    }
    
  })
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});