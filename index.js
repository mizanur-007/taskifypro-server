const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json());


// mongodb connect 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.36j9dpz.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  const tasksCollection = client.db("Taskify").collection("tasks");

  async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
       client.connect();
      // Send a ping to confirm a successful connection
       client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
    //   await client.close();
    }
  }
  run().catch(console.dir);


// get operations 
app.get("/", (req, res) => {
    res.send("app is running");
  });

  app.get("/api/v1/tasks", async(req,res)=>{
    try{
        const page = parseInt(req.query.currentPage);
    const size = parseInt(req.query.size);
    const result = await tasksCollection.find().skip(page*size).limit(size).toArray()
    const count = await tasksCollection.estimatedDocumentCount();
    res.send({result, count})
    }
    catch{
        console.log("error")
    }
  })

  app.listen(port, ()=>{
    console.log("app is running")
  })



