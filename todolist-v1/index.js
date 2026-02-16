//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

// create a date object that requires the date.js file
const date = require(__dirname + "/date.js");

const app = express();

// set an array for the default items in the list
let items = ["Buy Food", "Prepare Food", "Cook Food", "Eat Food", "Clean Plates"];
// set an empty array for chores items
let choresItems = ["Do Laundry", "Sweep Floors", "Mop Floors"];
// set an empty array for camping items
let campingItems = ["Pack Tent", "Pack Food and Drinks", "Pack First Aid Kit"];


// set EJS as the viewing engine to display html
app.set('view engine', 'ejs');

// use body parser to parse html file
app.use(bodyParser.urlencoded({extended: true}));

// use Express to serve or display static files such as images, CSS, JS files etc.
app.use(express.static("public"));

// default html file in web server
app.get("/", function(req, res) {

    //get the system date from the getDate function exported by the date.js file
    let day = date.getDate();
    
    // use EJS render to display the day and the To Do List
    res.render("list", {listTitle: day, newListItems: items});
    
});

// display default to do list on the default root folder
app.post("/", function(req, res) {
    
    // code allows items to be added to the regular list and work list
    let item = req.body.newItem;
    
    // if route is /work, add to work list
  // if list === Fun then go to /fun
  // if list ==== Weekend then go to /weekend
  
    if (req.body.list === "Chores") {
        choresItems.push(item);
        res.redirect("/chores");
    } 
    
    else if (req.body.list === "Camping") {
        campingItems.push(item);
        res.redirect("/camping");
    }

    else {
        items.push(item);
        res.redirect("/");
    }
});

// display chores to do list on the localhost:3000/chores route!
app.get("/chores", function(req, res){


  let day = date.getDate();
  
    res.render("list", {listTitle: "Chores Items To-Do List", newListItems: choresItems})
});

// display camping to do list on the localhost:3000/camping route!
app.get("/camping", function(req, res){


  let day = date.getDate();
  
    res.render("list", {listTitle: "Camping Items To-Do List", newListItems: campingItems})
});

// add a app.get for every route - /fun and /weekend
// Make sure your listTitle starts off with Fun Items and Weekend Items

app.listen(3000, function() {
console.log ("Server is running on port 3000")
});