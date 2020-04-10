require('dotenv').config();

const express = require('express');
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


mongoose
  .connect(`${process.env.DB_URL}`, { useNewUrlParser: true })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });


const app = express();


app.use(bodyParser.urlencoded({ extended: false }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));


const routes = require('./routes/routes');
app.use('/', routes);

module.exports = app;
