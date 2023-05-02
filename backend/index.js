const express = require('express')
const app = express()
const path = require('path');
const port = 3000;
const connectdb = require('./db');
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const user = require('./modules/Chatschema');
const userList = [];
let joinedRooms = {};


const Conversation = require('./modules/Conversationschema');
connectdb();
//code for set socket.io
const io = new Server(server, {
  cors: {
    origin: ["http://127.0.0.1:5173","http://localhost:5173"],
    methods: ["POST", "GET","PATCH","DELETE","PUT"]
  }
})

io.on('connection', (socket) => {

  socket.on("user-connect", (id) => {
    if (!userList.includes(id)) {
      userList.push(id);
    }

    console.log(userList);
    //userList[id] = socket.id
    //console.log(`userlist ${userList}`)
    console.log(`userid connected with ${id}`)
    socket.emit("user_List", userList);
  })

  socket.on("join_room", (data) => {
    const { name, receiverName, roomId, id } = data;
    Conversation.findOne({
      $or: [
        { client1: name, client2: receiverName },
        { client1: receiverName, client2: name }
      ]
    }).then(conversation => {
      if (conversation) {
        // Previous conversation exists
        socket.join(roomId);
        console.log(`previous user ${socket.id} join in ${roomId} room`)
        //socket.emit('previous conversation', roomId);
      } else {
        // Previous conversation does not exist
        const newRoom = roomId;
        socket.join(newRoom);
        console.log(`user ${socket.id} join in ${newRoom} room`)
        const conversationDetail = { name, receiverName, newRoom }
        //const conversastionData = new Conversation(conversationDetail);
        Conversation.collection.insert(conversationDetail)
          .then(resp => { console.log("succesfully inserted") })
          .catch(cat => { console.log(cat) })
        // .then(() => {
        //   socket.emit('new conversation', newRoom);
        // });
      }
    });
  })
  socket.on('leave_room', () => {
    let room = joinedRooms[socket.id];
    socket.leave(room);
    delete joinedRooms[socket.id];
    console.log(joinedRooms)
  });

  socket.emit("user_List", userList);
  //console.log(`user connected with ${socket.id}`);

  // socket.on("join_room", (data) => {
  //   socket.join(data.roomId)
  //   console.log(`user ${socket.id} join in ${data.roomId} room`)
  // })
  socket.on("send_sms", (data) => {
    console.log(data)
    user.insertMany(data);
    io.to(data.room).emit("received_data", data)


    socket.in(data.receiverId).emit("message_received", data);
  })


  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});





app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*", "http://127.0.0.1:5173");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE');
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With, Content-Type, Accept,Authorization"
  );
  next();
})
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(express.json());
app.use('/api', require("./routes/Createuser"));
app.use('/api', require("./routes/Loginuser"));
app.use('/api', require("./routes/Forgotpassword"));
app.use('/api', require("./routes/Showusers"));
app.use('/api', require("./routes/Updateuser"))
app.use('/api', require("./routes/Fetchuser"))
app.use('/api', require("./routes/Chatuser"))
app.use('/api', require("./routes/FetchMessage"))
app.use('/api', require("./routes/Fetchreceivers"))
app.use('/api', require("./routes/sendlink"))
app.use('/api', require("./routes/Lastmessage"))
app.use("/images", express.static("uploads"));
server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})