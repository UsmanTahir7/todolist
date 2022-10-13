const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))

mongoose.connect(process.env.MONGO_DB_URL);

const itemsSchema = {
    name: String
}

const Item = mongoose.model(
    "Item", 
    itemsSchema
);

const itemCollection = []


app.get("/", function(req, res){
    var today = new Date();
    
    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    Item.find({}, function(err, foundItems){
        if (foundItems.length === 0 ) {
            Item.insertMany(itemCollection, function(err){
                if (err) {
                    console.log(err);
                } else {
                    console.log("Successful submission")
                }
            })
        }
         
        res.render("list", {
            kindOfDay: "Today", newListItems: foundItems
        });
    });

    var day = today.toLocaleDateString("en-US", options)
    
});

app.post("/delete", function(req, res){
    const deletedItem = req.body.button;
    Item.findByIdAndRemove(deletedItem, function(err){
        if (err) {
            console.log(err)
        } else {
            console.log("success")
        }
        res.redirect("/")
    });
});

app.post("/", function(req, res) {
    var itemName = req.body.newItem;
    const item = new Item ({
        name: itemName
    });
    item.save();
    res.redirect("/");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
 
app.listen(port, function() {
  console.log("Server started succesfully");
});   