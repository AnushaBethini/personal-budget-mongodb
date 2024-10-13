const mongoose = require("mongoose");
const dataModel = require("./models/data_schema"); // Importing the schema

let url = 'mongodb://127.0.0.1:27017/budgetDB'; // The database name is budgetDB

const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use("/", express.static("public"));
app.use(cors());

// GET request to fetch budget data from the "budgets" collection
app.get("/budget", (req, res) => {
  mongoose
    .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("Connected to mongodb");
      dataModel
        .find({}) // Retrieve data from the "budgets" collection
        .then((data) => {
          res.json(data);
          console.log(data);
          mongoose.connection.close();
        })
        .catch((connectionError) => {
          console.log(connectionError);
        });
    })
    .catch((err) => {
      res.status(500).json({ message: "Database connection failed" });
      console.log(err);
    });
});

// POST request to add new data into the "budgets" collection
app.post("/addbudget", (req, res) => {
  mongoose
    .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("Connected to the budgetDB database");
      const newItem = new dataModel(req.body); // Create a new budget item from the request body
      dataModel
        .create(newItem) // Insert the new item into the "budgets" collection
        .then((data) => {
          res.json(data); // Send back the created data as a response
          console.log(data);
          mongoose.connection.close();
        })
        .catch((connectionError) => {
          res.status(500).json({ message: "Error creating new budget item" });
          console.log(connectionError);
        });
    })
    .catch((err) => {
      res.status(500).json({ message: "Database connection failed" });
      console.log(err);
    });
});

// Start the Express server
app.listen(port, () => {
  console.log(`API served at http://localhost:${port}`);
});
