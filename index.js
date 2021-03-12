const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongodb = require('mongodb')
const ObjectId = require('mongodb').ObjectID;
require('dotenv').config()

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rbbqn.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
app.use(bodyParser.json())
app.use(cors())
const port = 5000

app.get('/', (req, res) => {
    res.send('Hello World!')
})



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const volunteerCollection = client.db("volunteerNetwork").collection("volunteerOpportunitys");
    const regUserCollection = client.db("volunteerNetwork").collection("volunteerRegUser");
    app.post('/addAllEvents', (req, res) => {
        const allEvents = req.body;
        console.log(allEvents);
        volunteerCollection.insertMany(allEvents)
        .then((result) => {
            console.log(result.insertedCount);
            res.send(result.insertedCount)
        })
    })

    app.get('/allEvents', (req, res) => {
        volunteerCollection.find({})
        .toArray((err, documents) => {
            res.send(documents)
        })
    })

    app.post('/getEvent', (req, res) => {
        console.log(req.body.id);
        volunteerCollection.find({
            _id: mongodb.ObjectId(req.body.id)
            
        })
        .toArray((err, documents)=>{
            res.send(documents)
            if (err) {
                console.log(err);
            }
        })
        

    })


    app.post('/addRegVolunteer', (req, res) => {
        const volunteerUser = req.body;
        regUserCollection.insertOne(volunteerUser)
        .then((result) => {
            console.log(result.insertedCount);
            res.send(result.insertedCount > 0)
            
        })
    })

    app.get('/allRegUser', (req, res) => {
        // console.log(req.query.email);
        regUserCollection.find({email: req.query.email})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

    app.delete('/deleteRegistersUser/:id', (req, res) => {
        console.log(ObjectId(req.params.id));
        regUserCollection.deleteOne({_id: mongodb.ObjectId(req.params.id)})
        
        .then((result) => {
            console.log(result);
        })
    })

    app.get('/registerListTable', (req, res) => {
        regUserCollection.find({})
        .toArray((err, documents) => {
            res.send(documents)
        })
    })
    
    
});


app.listen(port, () => {
    console.log("sucessfully")
})