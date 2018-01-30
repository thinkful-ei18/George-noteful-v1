
'use strict';
const express = require('express');

const data = require('./db/notes');

const app = express();

const { PORT } = require ('./config');

app.use(express.static('public'));


// middlewar

// Middleware - app level

const { seeHereLogger } = require('./middlewares/ExportMiddleware.js');

app.use(seeHereLogger);

app.listen(process.env.PORT || 8082);


//Listen for incoming connections

app.listen(PORT, function() {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.log(err);
});
 
// INSERT EXPRESS APP CODE HERE...

// app.get('/v1/notes/', (req, res) => {
//   res.json(data);
//   console.log(data);
// });

app.get('/v1/notes/:id', (req, res) => {
  res.json(data.find(item => item.id === parseInt(req.params.id, 10)));
});


app.get('/v1/notes/', (req, res) => { 
  req.query.searchTerm ? 
    res.json(data.filter(item => item.title.includes(req.query.searchTerm)))
    : res.json(data);


  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    res.status(404).json({ message: 'Not found'});
  });


//   res.json(newData);
//   console.log(res.json(newData));
// //   console.log(req.query);

//when i search a term, I want that term to go through all other data in API, and match any matching strings
});
