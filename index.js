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
    const headlineCollection = client.db("lob").collection("headline");
    const usersCollection = client.db("lob").collection("users");

    // get users
    app.get("/users", async (req, res) => {
      const users = await usersCollection.find().toArray();
      res.send(users);
    });

    app.get("/users/admin/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await usersCollection.findOne(query);
      res.send({ isAdmin: user?.role === "admin" });
    });

    // users create
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    // make a admin
    app.put("/users/admin/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          role: "admin",
        },
      };
      const result = await usersCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    app.put("/user/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      const token = jwt.sign(
        { email: email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );
      res.send({ result, token });
    });

    // Headline and start
    app.get("/headline/search", async (req, res) => {
      const prntCtgrId = req.query.parentCtgId;
      const cursor = headlineCollection.find({ parentCtgId: prntCtgrId });
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/headline/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await headlineCollection.findOne(query);
      res.send(result);
    });

    app.put("/headline/:id", async (req, res) => {
      const id = req.params.id;
      const updateHeadline = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          lawHeadline: updateHeadline.lawHeadline,
          preamble: updateHeadline.preamble,
        },
      };
      const result = await headlineCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    app.post("/headline", async (req, res) => {
      const newHeadLine = req.body;
      const result = await headlineCollection.insertOne(newHeadLine);
      res.send(result);
    });

    app.delete("/headline/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await headlineCollection.deleteOne(query);
      res.send(result);
    });
    // Headline and end

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

    app.get("/parentcategory/search", async (req, res) => {
      const grandCtgrId = req.query.grandCtgId;
      const cursor = parentCtgCollection.find({ grandCtgId: grandCtgrId });
      const result = await cursor.toArray();
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

    app.get("/childcategory/search", async (req, res) => {
      const parentCtgrId = req.query.parentCtgId;
      const cursor = childCtgCollection.find({ parentCtgId: parentCtgrId });
      const result = await cursor.toArray();
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

    app.put("/childcategory/:id", async (req, res) => {
      const id = req.params.id;
      const updateChildCtg = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          sectionsName: updateChildCtg.sectionsName,
          sectionsDetails: updateChildCtg.sectionsDetails,
        },
      };
      const result = await childCtgCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
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
