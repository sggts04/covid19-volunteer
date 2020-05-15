const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const port =  process.env.PORT || 3000  // for hosting on heroku

// Setting up the expres app
app.use('/static', express.static(path.join(__dirname, 'static')));
app.engine('html', require('ejs').renderFile);  // ejs rendering but with .html extension
app.set('view engine', 'html'); // set our new html view engine
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// Setting up MongoDB
const mongoURL = process.env.MONGODB_URI || "mongodb://localhost/covid"
mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
let db = mongoose.connection;

db.once('open', function () {
    console.log('Connected to MongoDB');
});

db.on('error', function (err) {
    console.log(err);
});

//Routes
app.get('/', function (req, res) {
    res.render('index');
});

app.get('/volunteer', function (req, res) {
    res.render('volunteer');
});

app.get('/contact', function (req, res) {
    res.render('contact');
});

app.listen(port, function() {
     console.log(`Example app listening at http://localhost:${port}`);
});