const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));


var items = ["Food", "Book Reading", "Eat"];

app.get("/", (req, res) => {
    var today = new Date();
    var options = {
        weekday:"long", 
        day:"numeric", 
        month:"long"
    }
    var date = today.toLocaleDateString("en-IN", options)

    res.render("dashboard", {KindOfDate: date, itemsTotal: items});
});

app.post("/", (req, res)=>{
    var item = req.body.item;
    items.push(item);
    res.redirect("/");
});
app.listen(3000, (error) => {
    console.log('Server is running on port 3000 ' + error);
});
