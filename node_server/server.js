const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
const exec = require('child_process').exec;
const path = require('path');

const fs = require('fs');
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const Mul = 1024;

app.post('/download', (req, res) => {


  exec('transmission-remote -t all -i > status.txt',
        (error, stdout, stderr) => {
            console.log(stdout);
            console.log(stderr);
            if (error !== null) {
                console.log(`exec error: ${error}`);
            }
        });

  exec('grep Downloaded status.txt > down_status.txt',
  (error, stdout, stderr) => {
      console.log(stdout);
      console.log(stderr);
      if (error !== null) {
          console.log(`exec error: ${error}`);
      }
  });

  exec('grep Uploaded status.txt > up_status.txt',
  (error, stdout, stderr) => {
      console.log(stdout);
      console.log(stderr);
      if (error !== null) {
          console.log(`exec error: ${error}`);
      }
  });

  const file = fs.readFile('down_status.txt', (error, buffer) => {

    let string = "";
    for(var i=0;i<req.body.fileSize*Mul;i++)string+="@";
    res.send(string);

  });

});

app.get('/upload', (req, res) => {

  console.log('Inside Upload');

  const file = fs.readFile('down_status.txt', (error, buffer) => {
    console.log(buffer.toString());
    res.send('hello');
  });

});

app.listen(port, () => console.log(`Listening on port ${port}`));