const { MongoClient, ServerApiVersion, ObjectId, ObjectID } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// mongodb config
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.udusb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// middleware
app.use(cors());
app.use(express.json());

console.log(uri);

async function run() {
    try {
        await client.connect();

        const db = client.db('ielts-job-task');
        const userCollection = db.collection("users");
        const todoCollection = db.collection("todo");

        // store new user email
        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: user
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.send = (result);
        });

        // update user profile
        app.put('/profie/:email', async (req, res) => {
            const email = req.params.email;
            const body = req.body;
            const query = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: body
            };
            const result = await userCollection.updateOne(query, updateDoc, options);
            res.send(result);
        });

        // get user's existing data
        app.get('/user/:email', async (req, res) => {
            const email = req.params.email;
            console.log(email);
            const query = { email: email };
            const result = await userCollection.findOne(query);
            res.send(result);
        });

        // todo list section =>
        
        // get all todo list
        app.get('/list', async (req, res) => {
            const query = {};
            const cursor = todoCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        });

        // post a new todo list
        app.post('/list', async (req, res) => {
            const newItem = req.body;
            console.log(newItem);
            const result = await todoCollection.insertOne(newItem);
            res.send(result);
        });

        // isComplete update api 
        app.put('/list/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true }
            const updateDocument = {
                $set: {
                    isComplete: data.isComplete
                },
            };
            const result = await todoCollection.updateOne(filter, updateDocument, options);
            res.send(result);
        });
    }
    finally { }
}
run().catch(console.dir);

// server running check api
app.get('/', async (req, res) => {
    res.send('IELTS Proficiency Server is Running');
});

app.listen(port, () => {
    console.log('listening to port', port);
})