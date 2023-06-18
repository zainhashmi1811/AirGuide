const mongoose = require('mongoose')
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const socketIO = require('socket.io');
require("./model")
const connect = require("./db/db")
dotenv.config();
const common = require('./routes/common');
const user = require('./routes/user');
const { driverLocation } = require('./utils/locationTrack');
const TcPp = mongoose.model('TcPp');
connect()
const server = require('http').createServer(app);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(common)
app.use(user)

const contentSeeder = [
  {
    content:
      "Lorem ipsum dolor sit amet.Ea iste consectetur qui harum libero exercitationem harum et quam earum At cupiditate perferendis qui aspernatur vero!",
  },
  {
    content:
      "Lorem ipsum dolor sit amet.Ea iste consectetur qui harum libero exercitationem harum et quam earum At cupiditate perferendis qui aspernatur vero!",
  },
  {
    content:
      "Lorem ipsum dolor sit amet.Ea iste consectetur qui harum libero exercitationem harum et quam earum At cupiditate perferendis qui aspernatur vero!",
  },
];

var abc;
const dbSeed = async () => {
  const findTcPp = await TcPp.find()
  if (findTcPp.length < 1) {
    const updateTcPp = new TcPp({ privacyPolicy: contentSeeder[0]?.content, termCondition: contentSeeder[1]?.content, aboutUs: contentSeeder[2]?.content })
    await updateTcPp.save()
    if (updateTcPp) {
      abc = await TcPp.find();
    }
  } else {
    abc = await TcPp.find();
  }
};

dbSeed()
app.set("views", "./views");
app.set("view engine", "pug");
app.get("/privacy_policy*", (req, res, next) => {
  res.render("index", {
    title: "Privacy Policy",
    heading: "Privacy Policy",
    paragraph: abc[0]?.privacyPolicy,
  });
});
app.get("/terms_and_conditions*", (req, res, next) => {
  res.render("index", {
    title: "Terms And Conditions",
    heading: "Terms And Conditions",
    paragraph: abc[0]?.termCondition,
  });
});
app.get("/about_us*", (req, res, next) => {
  res.render("index", {
    title: "About Us",
    heading: "About Us",
    paragraph: abc[0]?.aboutUs,
  });
});

const io = socketIO(server);
io.on('connection', (socket) => {
  console.log("socket running", socket?.id)
  //Driver Data 
  socket.on('driverLocation', async (object) => {
    const room = object?.driverId + "room" + object?.userId
    socket.join(room);
    driverLocation(object, function (response) {
      if (response.length > 0) {
        io.to(room).emit('response', { object_type: "driverLocation", message: "Driver data found", data: response[0] });
      } else {
        io.to(room).emit('response', { object_type: "driverLocation", message: "Driver not found", data: [] });
      }
    });
  })
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, (req, res) => {
  console.log(`Server running on ${PORT}`);
});
exports.dbSeed = dbSeed;
