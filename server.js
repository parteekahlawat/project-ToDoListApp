const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/ToDoList");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
var today = new Date();
var options = {
  weekday: "long",
  day: "numeric",
  month: "long",
};
var date = today.toLocaleDateString("en-IN", options);

const listSchema = mongoose.Schema({
  work: String,
});
const list = mongoose.model("List", listSchema);


const NewListSchema = mongoose.Schema({
    name:String,
    items: [listSchema]
})
const NewList = mongoose.model("NewList", NewListSchema);



app.get("/", (req, res) => {
  list.find({}).then((items) => {
      res.render("dashboard", { Title: "Today", itemsTotal: items });
    }).catch((error) => {
      console.log(error);
    });
});

app.post("/", (req, res) => {
  var item = req.body.item;
  const PageName = req.body.page;
  const ItemsSubmitted = new list({
    work: item 
  })
    console.log("Added Successfully");

  if(PageName==="Today"){
    list.create(ItemsSubmitted);
    res.redirect("/");
  }
  else{
    NewList.findOne({name:PageName}).then((value)=>{
        value.items.push(ItemsSubmitted);
        value.save()
    })
    res.redirect("/"+PageName);
  }
  
});

app.post("/delete", (req, res) => {
  var itemIdDel = req.body.checkbox;
  const Page = req.body.pagename;


  if(Page==="Today"){
    list.findByIdAndRemove({ _id: itemIdDel }).then(() => {
        console.log("Deleted Successfully");
      }).catch((error) => {
        console.log(error);
      });
    res.redirect("/");
  }
  else{
    NewList.findOneAndUpdate({name:Page}, {$pull: {items:{_id:itemIdDel}}}).then((value)=>{
        res.redirect("/"+Page);
        console.log("Deleted Successfully")
    }).catch((e)=>{console.log(e)});
    
  }
});

const dummy = new list({
    work:"Default Value"
})
const NewListItems = [dummy]
app.get("/:NewListName", (req, res)=>{
    const NewListName = req.params.NewListName;

    NewList.findOne({name:NewListName}).then((page)=>{
        if(page){
            res.render("dashboard", { Title: NewListName, itemsTotal: page.items});
            console.log("Already Exist")
        }
        else{
            NewList.create({name:NewListName, items:NewListItems}).then(()=>{
                console.log("New List Added");
            })
            res.render("dashboard", { Title: NewListName, itemsTotal: NewListItems});
        }
        
    })



})


app.listen(3000, (error) => {
  console.log("Server is running on port 3000 " + error);
});
