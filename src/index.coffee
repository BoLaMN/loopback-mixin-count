'use strict'

count = require './count'

module.exports = (app) ->
  app.loopback.modelBuilder.mixins.define 'Count', count

  return
