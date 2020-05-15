const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const Volunteer = require('./models/Volunteer');
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

app.post('/volunteer', function (req, res) {
    let name = req.body.name;
    let age = Number(req.body.age);
    let state = req.body.state;
    let skills = req.body.skills;
    let email = req.body.email;
    let phone = Number(req.body.phone);
    let medical = (req.body.medical) ? true : false;
    if (name == "" || age == "" || state == "" || skills == "" || email == "" || phone == "" || age<10 || !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) || !(/^\d{10}$/.test(phone))) {
        res.send("Your form did not validate, please fill it properly!");
    } else {
        let newVolunteer = new Volunteer();
        newVolunteer.name = name;
        newVolunteer.age = age;
        newVolunteer.state = state;
        newVolunteer.skills = skills;
        newVolunteer.email = email;
        newVolunteer.phone = phone;
        newVolunteer.medical = medical;
        newVolunteer.save(function(err, t) {
            if (err) {
                console.log(err);
                res.send('There was a problem while submitting your form, please try again later! Sorry for the inconvenience.'); 
            } else {
                res.send('Posted');   
            }
        });
    }
});

app.listen(port, function() {
     console.log(`Volunteer app listening at http://localhost:${port}`);
});