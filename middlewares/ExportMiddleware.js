'use strict';

function seeHereLogger(req, res, next) {
  const now = new Date();
  console.log(`${now.toLocaleString()} ${req.method} ${req.url}`);
  next();
}

module.exports = { seeHereLogger };

