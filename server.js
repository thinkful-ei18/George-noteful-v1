
'use strict';
const express = require('express');
const morgan = require('morgan');

const app = express();
const { PORT } = require ('./config');
const { seeHereLogger } = require('./middlewares/ExportMiddleware.js');
const notesRouter = require('./router/notes.router.js');

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.json());
app.use(seeHereLogger);

app.use('/v1', notesRouter);

// Middleware - app level




//Listen for incoming connections
 
// INSERT EXPRESS APP CODE HERE...

// app.get('/v1/notes/', (req, res) => {
//   res.json(data);
//   console.log(data);
// });

//find ID



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
