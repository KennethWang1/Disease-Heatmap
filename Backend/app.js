const express = require('express');
const http = require("http");
const fs = require("fs");
const cors = require('cors');
const bodyParser = require("body-parser");
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGODB_URI;

const MongoDBClient = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await MongoDBClient.connect();
    await MongoDBClient.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    await MongoDBClient.close();
  }
}
run().catch(MongoDBClient.dir);

const app = express();
const port = process.env.PORT || 3000;
app.use(cors({
    origin: ['http://localhost:3000', 'https://localhost:3001'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log('Incoming request: ' + req.url);
    next();
});

//endpoints here

app.use((req, res)=>{
    res.status(404).send('Not Found');
});

http.createServer(app).listen(port, () => {
    console.log(`HTTP server up and running on port ${port}`);
});