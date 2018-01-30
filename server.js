
'use strict';
const express = require('express');
const data = require('./db/notes');
const app = express();
const { PORT } = require ('./config');
const { seeHereLogger } = require('./middlewares/ExportMiddleware.js');
const simDB = require('./db/simDB');
const notes = simDB.initialize(data);

app.use(express.static('public'));
app.use(express.json());

// Middleware - app level
app.use(seeHereLogger);



//Listen for incoming connections
 
// INSERT EXPRESS APP CODE HERE...

// app.get('/v1/notes/', (req, res) => {
//   res.json(data);
//   console.log(data);
// });

//find ID

app.get('/v1/notes/:id', (req, res, next) => {
  const { id } = req.params;
  notes.find(id, (err, item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.json(item);
    } else {
      next();
    }
  });
  //res.json(data.find(item => item.id === parseInt(req.params.id, 10)));
});

//filter

app.get('/v1/notes/', (req, res, next) => { 
  const { searchTerm } = req.query;

  notes.filter(searchTerm, (err, list) => {
    if (err) {
      return next(err);
    }
    res.json(list);
  });
});

app.put('/v1/notes/:id', (req, res, next) => {
  const id = req.params.id;

  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateFields = ['title', 'content'];

  updateFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  notes.update(id, updateObj, (err, item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.json(item);
    } else {
      next();
    }
  });
});

app.get('/boom', (req, res, next) => {
  throw new Error('Boom!!');
});

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({ message: 'Not found'});
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});


//   res.json(newData);
//   console.log(res.json(newData));
// //   console.log(req.query);

app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.log(err);
});
