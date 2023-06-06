// Setup empty JS object to act as endpoint for all routes
let projectData = {};

// Require Express to run server and routes
const express = require('express');
// Start up an instance of app
const app = express();
/* Middleware*/
const bodyParser = require('body-parser');
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());
// Initialize the main project folder
app.use(express.static('website'));


// Setup Server
const port = 8000;
const server = app.listen(port, listening);
function listening() {
  console.log(`server is running on localhost: ${port}`);
}

//Setup post route and variable to hold the data
app.post('/postdata', addData);
function addData(req, res) {
  Object.assign(projectData, req.body);
  res.sendStatus(200);
}

//Setup get route
app.get('/getdata', function (req, res) {
  res.send(projectData);
});