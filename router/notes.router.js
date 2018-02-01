'use strict';

const express = require('express');
const router = express.Router();
const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);

router.get('/notes/:id', (req, res, next) => {
  const { id } = req.params;
  // notes.find(id, (err, item) => {
  //   if (err) {
  //     return next(err);
  //   }
  //   if (item) {
  //     res.json(item);
  //   } else {
  //     next();
  //   }

  notes.find(id)
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch(err => next(err));
});
//res.json(data.find(item => item.id === parseInt(req.params.id, 10)));

//filter

router.get('/notes/', (req, res, next) => {
  const { searchTerm } = req.query;

  // notes.filter(searchTerm, (err, list) => {
  //   if (err) {
  //     return next(err);
  //   }
  //   res.json(list);
  // });

  notes.filter(searchTerm)
    .then(list => {
      if (list) {
        res.json(list);
      } else {
        next();
      }
    })
    .catch(err => next(err));
});


router.put('/notes/:id', (req, res, next) => {
  const id = req.params.id;

  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateFields = ['title', 'content'];

  updateFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  // notes.update(id, updateObj, (err, item) => {
  //   if (err) {
  //     return next(err);
  //   }
  //   if (item) {
  //     res.json(item);
  //   } else {
  //     next();
  //   }

  notes.update(id, updateObj)
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    }).catch(err => next(err));
});

router.post('/notes', (req, res, next) => {
  const { title, content } = req.body;

  const newItem = { title, content };
  /***** Never trust users - validate input *****/
  if (!newItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  notes.create(newItem, (err, item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
    } else {
      next();
    }
  });
});

module.exports = router;