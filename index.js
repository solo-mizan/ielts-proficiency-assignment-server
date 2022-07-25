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
        })
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