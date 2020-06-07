const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const uri = process.env.DB_PATH;

let client = new MongoClient(uri, { useNewUrlParser: true });

app.get("/", (req, res) => {
  res.send("Welcome to doctors portal.");
});

//get

app.get("/services", (req, res) => {
  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect((err) => {
    const collection = client.db("Dentators").collection("services");
    collection.find().toArray((err, documents) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: err });
      } else {
        res.send(documents);
      }
    });
    client.close();
  });
});

app.get("/dailyAppointment/:appointmentDate", (req, res) => {
  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect((error) => {
    const collection = client.db("Dentators").collection("appointments");
    collection.find(req.params).toArray((err, documents) => {
      if (err) {
        console.log(err);
        console.log(error);
        res.status(500).send({ message: err });
      } else {
        res.send(documents);
      }
    });
    client.close();
  });
});

app.get("/allAppointments", (req, res) => {
  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect((error) => {
    const collection = client.db("Dentators").collection("appointments");
    collection.find().toArray((err, documents) => {
      if (err) {
        console.log(err);
        console.log(error);
        res.status(500).send({ message: err });
      } else {
        res.send(documents);
      }
    });
    client.close();
  });
});

//post
app.post("/bookAppointment", (req, res) => {
  const appointmentDetails = req.body;
  appointmentDetails.bookingDate = new Date();
  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect((error) => {
    const collection = client.db("Dentators").collection("appointments");
    collection.insertOne(appointmentDetails, (err, result) => {
      if (err) {
        console.log(err);
        console.log(error);
        res.status(500).send({ message: err });
      } else {
        res.send(result.ops[0]);
      }
    });
    client.close();
  });
});

app.put("/dailyAppointment/updateVisit", (req, res) => {
  const id = req.body.id;
  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect((error) => {
    const collection = client.db("Dentators").collection("appointments");
    collection.updateOne(
      { _id: ObjectId(id) },
      { $set: { visited: true } },
      (err, result) => {
        if (err) {
          console.log(err);
          console.log(error);
          res.status(500).send({ message: err });
        }
      }
    );
    client.close();
  });
});
app.put("/updatePrescription", (req, res) => {
  const id = req.body.id;
  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect((error) => {
    const collection = client.db("Dentators").collection("appointments");
    collection.updateOne(
      { _id: ObjectId(id) },
      { $set: { prescription: req.body.prescription } },
      (err, result) => {
        if (err) {
          console.log(err);
          console.log(error);
          res.status(500).send({ message: err });
        }
      }
    );
    client.close();
  });
});

app.post("/addServices", (req, res) => {
  const service = req.body;
  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect((err) => {
    const collection = client.db("Dentators").collection("services");
    collection.insertOne(service, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: err });
      } else {
        console.log("successfully inserted", result);
        res.send(result.ops[0]);
      }
    });
    client.close();
  });
});

const port = process.env.PORT || 3700;
app.listen(port, () => console.log("Listening to port 3700"));
