const express = require('express');
const cors = require('cors');
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000


// middleware 
app.use(cors())
app.use(express.json())




// mongo db setup!!!


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e9onx31.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const brandCollection = client.db("BrandDB").collection("brand")
    const productCollection = client.db('ProductDB').collection("Product")
    const cartCollection = client.db('CartDB').collection('Cart')
    const productSlider = client.db('productSlider').collection('slider')
    

    // get product slider 
    app.get ('/productSlider', async (req, res) =>{
      const cursor = productSlider.find()
      const result = await cursor.toArray()
      res.send(result)
    })


    app.get('/products', async (req, res) => {
      const cursor = productCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/brands', async (req, res) => {
      const cursor = brandCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/update/:id', async (req, res) => {
      const id = req.params.id 
      const query = {_id: new ObjectId(id)}
      const result = await productCollection.findOne(query)
      res.send(result)
    })

    app.get('/details/:id', async (req, res) => {
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await productCollection.findOne(query)
      res.send(result)
    })


    app.get('/products/:name', async (req, res) => {
      const brandName = req.params.name
      const query = { brand: req.params.name }
      const result = productCollection.find(query)
      const product = await result.toArray()
      res.send(product)
    })


    app.get('/cart', async (req, res) => {
      
      const result = cartCollection.find()
      const data = await result.toArray()
      res.send(data) 
    })



     // get blogs 
     const blogCollection = client.db('BlogDB').collection('blog')
     app.get('/blog', async (req, res) => {
       const result = blogCollection.find()
       const blogs = await result.toArray()
       res.send(blogs)
     })


     app.get('/blog/:id', async (req, res) => {
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await blogCollection.findOne(query)
      res.send(result)
     })




    app.post('/products', async (req, res) => {
      const product = req.body
      const result = await productCollection.insertOne(product)
      res.send(result)
    })


    app.post('/cart', async (req, res) => {
      const product = req.body
      const result = await cartCollection.insertOne(product)
      res.send(result)
    })



    app.put('/products/:id', async (req, res) => {
      const id = req.params.id
      const product = req.body;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true}
      const newProduct = {
        $set: {
          brand: product.brand,
          description: product.description,
          name: product.name ,
          photo: product.photo ,
          price: product.price,
          rating: product.rating,
          type: product.type
        }
      }
     
      const result = await productCollection.updateOne(filter, newProduct, options)
      res.send(result)
    })


    app.delete('/cart/:id', async (req, res) => {
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await cartCollection.deleteOne(query)
      res.send(result)
    })



   


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
  res.send('SERVER IS RUNNING !!!')
})

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`)
})