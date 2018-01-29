'use strict';
const express = require('express');

const data = require('./db/notes');

const app = express();

app.use(express.static('public'));

//Listen for incoming connections

app.listen(8080, function() {
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

//   res.json(newData);
//   console.log(res.json(newData));
// //   console.log(req.query);

//when i search a term, I want that term to go through all other data in API, and match any matching strings
});
