const express = require('express')
const app = express()
const port =  process.env.PORT || 3000  // for hosting on heroku

app.get('/', function(req, res) {
    res.send('Hello World!');
});

app.listen(port, function() {
     console.log(`Example app listening at http://localhost:${port}`);
});