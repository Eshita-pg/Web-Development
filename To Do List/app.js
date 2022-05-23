//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require('mongoose');
const _ = require('lodash');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];

//connectiong mongoose
mongoose.connect("mongodb://localhost:27017/todolistdb");

const itemsSchema = {
  name:String
};

const Item = mongoose.model("Item" , itemsSchema);

const item1 = new Item ({
  name : "Welcome to your TodoList!"
});

const item2 = new Item ({
  name : "Hit + button to add a new item."
});

const item3 = new Item ({
  name : "<-- Hit to delete an item.>"
});

const defaultItems = [item1,item2,item3];

const listSchema = {
  name:String,
  items : [itemsSchema]
};

const List = mongoose.model("List" , listSchema);



app.get("/", function(req, res) {
  
  Item.find({} , function(err,results){
    if(results.length === 0 ) {
      Item.insertMany(defaultItems , function(err) {
  if(err) {
    console.log(err);
  }else {
    console.log("inserted");
  }

});
res.redirect("/");
    }else {

       res.render("list", {listTitle:"Today", newListItems: results});

    }
  });




});


app.get("/:listName" , function(req,res){
  const pageName =_.capitalize( req.params.listName);
  
  const checkName = List.findOne({name:pageName},function(err,results){
     if(!err) {
       if(!results){
        const list = new List({
          name: pageName,
          items:defaultItems
        });
        list.save();
        res.redirect("/");
       }else {
        
        res.render("list" , {listTitle:results.name , newListItems:results.items});
       }
     }
  })

});


//  Item.deleteMany({name: "<-- Hit to delete an item.>"} , function(err) {
//     if(err) {
//       console.log(err);
//     }else {
//       console.log("deleted");
//     }
//   })

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item ({
    name : itemName
  });

  if (listName === "Today") {
    item.save();
    res.redirect("/");

  }else {
    List.findOne({name : listName} , function(err , foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }

   
});


app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});


app.post("/delete" , function(req,res){
  const checked = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today"){
    Item.findByIdAndRemove(checked , function(err){
    if(err) {
      console.log(err);
    }else {
      console.log("Deleted");
      res.redirect("/");
    }
  });
  }else {
    List.findOneAndUpdate({name:listName} ,{$pull:{items:{_id:checked}}} ,function(err,foundList){
      if(!err) {
        res.redirect("/"+listName);
      }
    });
  }
  
  
});