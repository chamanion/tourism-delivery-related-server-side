const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tr3su.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri)


    async function run() {
        try {
           
        await client.connect()
        console.log('database is connected')
        const database = client.db("Online_Service");
        const serviceCollection = database.collection("Services");


        // GET API
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

         // GET Single Service
         app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id);
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.json(service);
        })

    //  POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post api', service);

            const result = await serviceCollection.insertOne(service);
            console.log(result);
            res.json(result)
        });

            // DELETE API
            app.delete('/services/:id', async (req, res) => {
                const id = req.params.id;
                const query = { _id: ObjectId(id) };
                const result = await serviceCollection.deleteOne(query);
                res.json(result);
            })
       
     
        }
        finally {
            // await client.close();
        }
    }
    
    run().catch(console.dir);




    app.get('/', (req, res) => {
        res.send('Delivery Service server is running');
    });
    
    app.listen(port, () => {
        console.log('Server running at port', port);
    })