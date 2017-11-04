'use strict';
var count;

count = require('./count');

module.exports = function(app) {
  app.loopback.modelBuilder.mixins.define('Count', count);
};
