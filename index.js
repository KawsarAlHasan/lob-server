const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zoxi4qf.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const grandCtgCollection = client.db("lob").collection("grandcategory");
    const parentCtgCollection = client.db("lob").collection("parentcategory");
    const childCtgCollection = client.db("lob").collection("childcategory");

    // start
    // category start
    // grand category start
    app.get("/grandcategory", async (req, res) => {
      const result = await grandCtgCollection.find().toArray();
      res.send(result);
    });

    app.get("/grandcategory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await grandCtgCollection.findOne(query);
      res.send(result);
    });

    app.post("/grandcategory", async (req, res) => {
      const newGrandCategory = req.body;
      const result = await grandCtgCollection.insertOne(newGrandCategory);
      res.send(result);
    });

    app.delete("/grandcategory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await grandCtgCollection.deleteOne(query);
      res.send(result);
    });
    // grand category end

    // parent category start
    app.get("/parentcategory", async (req, res) => {
      const result = await parentCtgCollection.find().toArray();
      res.send(result);
    });

    app.get("/parentcategory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await parentCtgCollection.findOne(query);
      res.send(result);
    });

    app.post("/parentcategory", async (req, res) => {
      const newParentCategory = req.body;
      const result = await parentCtgCollection.insertOne(newParentCategory);
      res.send(result);
    });

    app.delete("/parentcategory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await parentCtgCollection.deleteOne(query);
      res.send(result);
    });
    // parent category end

    // child category start
    app.get("/childcategory", async (req, res) => {
      const result = await childCtgCollection.find().toArray();
      res.send(result);
    });

    app.get("/childcategory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await childCtgCollection.findOne(query);
      res.send(result);
    });

    app.post("/childcategory", async (req, res) => {
      const newChildCategory = req.body;
      const result = await childCtgCollection.insertOne(newChildCategory);
      res.send(result);
    });

    app.delete("/childcategory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await childCtgCollection.deleteOne(query);
      res.send(result);
    });
    // child category end
    // category end
    // end
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("welcome to Laws of Bangladesh");
});

app.listen(port, () => {
  console.log(`Laws of Bangladesh website app listening on port ${port}`);
});
