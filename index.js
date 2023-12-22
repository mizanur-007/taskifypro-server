const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: ["https://taskifypro-server.vercel.app", "https://taskswift-cd0f1.firebaseapp.com","http://localhost:5173"],
}))
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
        const email = req.query.email;
        const status = req.query.status;
        const query = {creator_email: email}
        if (status) {
          query.status = status;
      }
    const result = await tasksCollection.find(query).toArray()
    const count = await tasksCollection.estimatedDocumentCount();
    res.send({result, count})
    }
    catch{
        console.log("error")
    }
  })

  
  //update a doc
  app.patch('/api/v1/update/:id',async(req,res)=>{
    const id = req.params.id;
    const updatedStatus = req.body;
    console.log(updatedStatus,id)
    const query = {_id: new ObjectId(id)};
    const option = {upsert: true }
    const updatedDoc = {
      $set:{
        status: updatedStatus.status
      }
    }
    const result = await tasksCollection.updateOne(query,updatedDoc,option);
    res.send(result)
  })

    //add a task
    app.post('/api/v1/tasks', async(req,res)=>{
      try{
        const data = req.body;
        const result = await tasksCollection.insertOne(data);
  res.send(result)
      }
      catch{
        console.log(error)
      }
    })

  app.listen(port, ()=>{
    console.log("app is running")
  })



