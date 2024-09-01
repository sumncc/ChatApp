const express = require('express')
const bodyParser = require('body-parser')
const { Socket } = require('dgram')

const punycode = require('punycode');
//app
var app = express()
app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

var http= require('http').Server(app)
var io = require('socket.io')(http)

var server = http.listen(3000, () => {
    console.log('server is listening on port', server.address().port)
})

//mongoose
const mongoose = require('mongoose')
var Message = require('./models/Message');
const uri = "mongodb+srv://user:Rejban1983@cluster0.1tuiq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
mongoose.connect(uri,clientOptions).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});


//Socket 
io.on('connection', (socket)=>{
    console.log(' a user is connected')
    
})


//REST API

app.get('/messages', async (req, res) => {
    try {
      const messages = await Message.find(); // Fetch all posts
      res.json(messages);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  app.get('/messages/:user', async (req, res) => {
    try {
      const user  = req.params.user
      const messages = await Message.find({name : user}); // Fetch all posts
      res.json(messages);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  app.post('/messages', async (req, res) => {
    try {
      const { name, message } = req.body;
  
      if (!name || !message) {
        return res.status(400).json({ message: 'Name and message are required' });
      }

      const newMessage = new Message({
        name,
        message
      });
  
      const savedMessage = await newMessage.save();
      const censored = await Message.findOne({ message: 'badword' })

      if (censored) 
          await Message.findByIdAndDelete({ _id: censored.id })
      else
         {
            io.emit('message',savedMessage )
            res.status(201).json(savedMessage);
         }
  
      

      
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
