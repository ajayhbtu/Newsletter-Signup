const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const request = require("request");

const { config } = require("./config.js");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


const listId = process.env.LIST_ID || config.LIST_ID;
const apiKey = process.env.API_KEY || config.API_KEY;

app.get("/", function (req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res){
  const lastName = req.body.lName;
  const email = req.body.email;
  const firstName = req.body.fName;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);
  

  const url = "https://us17.api.mailchimp.com/3.0/lists/" + listId;
  const options = {
    method: "POST",
    auth: "ajayhbtu:" + apiKey,
  };


  const request = https.request(url, options, function(response) {

    response.on("data", function(data) {
      if(response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
    });
  });

request.write(jsonData);
request.end();
});

app.post('/failure', function(req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is Running on port 3000.");
});
