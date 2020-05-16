const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const Volunteer = require('./models/Volunteer');
const bodyParser = require('body-parser');
const port =  process.env.PORT || 3000  // for hosting on heroku

// Setting up the expres app
app.use('/static', express.static(path.join(__dirname, 'static'))); // Static files (like css, images) are served through /static route
app.engine('html', require('ejs').renderFile);  // ejs rendering but with .html extension
app.set('view engine', 'html'); // set our new html view engine
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// Setting up MongoDB
const mongoURL = process.env.MONGODB_URI || "mongodb://localhost/covid" // for hosting on heroku
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
// Index GET Route
app.get('/', function (req, res) {
    res.render('index');
});

// Volunteer Register Form GET Route
app.get('/volunteer', function (req, res) {
    res.render('volunteer');
});

// Search Volunteer GET Route
app.get('/contact', function (req, res) {
    // Build query object using the GET parameters
    let query = {};
    if(req.query.state) query.state = req.query.state;
    if(req.query.medical) query.medical = (req.query.medical=='yes')? true : false;
    // Find the query results and sort in reverse order of date registered.
    Volunteer.find(query).sort({ date: -1 }).exec(function (err, volunteers) {
        if (err) {
            console.log(err);
            res.render('confirm', {error: true, confirmation: "Sorry we couldn't fetch the results, please try again later! Sorry for the inconvenience."});
        } else {
            res.render('contact', {
                volunteers: volunteers
            });
        }
    });
});

// Volunteer Form Submission POST route
app.post('/volunteer', function (req, res) {
    // Get details from POST request parameters.
    let name = req.body.name;
    let age = req.body.age;
    let state = req.body.state;
    let skills = req.body.skills;
    let email = req.body.email;
    let phone = req.body.phone;
    let medical = (req.body.medical) ? true : false;
    if (name == "" || age == "" || state == "" || skills == "" || email == "" || phone == "") {     // All fields are required
        res.render('confirm', {error: true, confirmation: "Your form did not validate, please fill it properly! Remember, all fields are required!"});
    } else if(Number.isInteger(age) || Number(age)<10) {     // Number should be valid and atleast 10
        res.render('confirm', {error: true, confirmation: "Your form did not validate, please fill it properly! Remember, you have to be above 10 years old to volunteer."});
    } else if(Number.isInteger(phone) || !(/^\d{10}$/.test(phone))) {     // Phone number should be exactly 10 digits
        res.render('confirm', {error: true, confirmation: "Your form did not validate, please fill it properly! Remember, for the phone number, make sure to remove +91 or extra zeros, only the ten digits are needed."});
    } else if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {     // Email should be valid
        res.render('confirm', {error: true, confirmation: "Your form did not validate, please fill it properly! Remember, fill a valid email address so you can be contacted."});
    } else {
        let newVolunteer = new Volunteer();
        newVolunteer.name = name;
        newVolunteer.age = Number(age);
        newVolunteer.state = state;
        newVolunteer.skills = skills;
        newVolunteer.email = email;
        newVolunteer.phone = Number(phone);
        newVolunteer.medical = medical;
        // Save this new volunteer, now that its validated.
        newVolunteer.save(function(err, volunteer) {
            if (err) {
                console.log(err);
                res.render('confirm', {error: true, confirmation: 'There was a problem while submitting your form, please try again later! Sorry for the inconvenience.'}); 
            } else {
                res.render('confirm', {error: false, confirmation: 'Your entry was added! Thank you for volunteering!'});
            }
        });
    }
});

app.listen(port, function() {
     console.log(`Volunteer app listening at http://localhost:${port}`);
});