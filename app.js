const express = require("express");
const mongoose = require("mongoose");
const Item = require("./models/items");
const app = express();

// allows client to post a defined data
app.use(express.urlencoded({ extended: true }));

// here is needed the mongodb connection string
const mongodb = "";

mongoose
  .connect(mongodb, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("connected");
    app.listen(3000);
  })
  .catch((err) => console.log(err));

app.set("view engine", "ejs");

// routes to main page
app.get("/", (req, res) => {
  res.redirect("/get-items");
});

// save item to db
app.get("/create-item", (req, res) => {
  const item = new Item({
    name: "computer",
    price: 2000,
  });
  item.save().then((result) => res.send(result));
});

// read all items
app.get("/get-items", (req, res) => {
  Item.find()
    .then((result) => {
      res.render("index", { items: result });
    })
    .catch((err) => console.log(err));
});

app.get("/add-item", (req, res) => {
  res.render("add-item");
});

app.post("/items", (req, res) => {
  console.log(req.body);
  const item = Item(req.body);
  item 
    .save()
    .then(() => res.redirect("/get-items"))
    .catch((err) => console.log(err));
});

// get item by ID
app.get('/items/:id', (req,res) => {
  const id = req.params.id;
  Item.findById(id).then(result => {
    console.log('result', result);
    res.render('item-detail', {item: result})
  })
})

// delete item by ID
app.delete('/items/:id', (req,res) => {
  const id = req.params.id;
  Item.findByIdAndDelete(id).then(result => {
    // res.redirect("/get-items"); // it doesn't work here
    res.json({redirect:'/'})
  })
})

// update item by ID
app.put('/items/:id', (req,res) => {
  const id = req.params.id;
  Item.findByIdAndUpdate(id, req.body).then(result => {
    res.json({ msg:'Updated Succesfully'})
  })
})

// as default when the route doesn't exist.. must be at the bottom
app.use((req, res) => {
  res.render("error");
});
