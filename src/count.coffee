debug = require('debug')('loopback:mixins:timestamp')

{ defaults } = require 'lodash'

module.exports = (Model, options) ->
  methods = options.methods

  addCounter = (method) ->
    Model.afterRemote method, (ctx, unused, next) ->
      regExp = /^__([^_]+)__([^_]+)$/

      if ctx.res._headerSent
        return next()

      done = (err, count) ->
        if not ctx.res._headerSent
          ctx.res.set 'Access-Control-Expose-Headers', 'X-Total-Count'
          ctx.res.set 'X-Total-Count', count
        next()
        return

      filter = {}

      if ctx.args and ctx.args.filter
        if typeof ctx.args.filter is 'object'
          filter = ctx.args.filter.where
        else
          filter = JSON.parse(ctx.args.filter).where

      matches = ctx.method.name.match(regExp)

      if matches?.length > 1
        [ input, method, relation ] = matches
        { keyTo, modelTo, modelThrough } = Model.relations[relation]

        model = modelThrough or modelTo

        def = Model.app.registry.modelBuilder.definitions[model.modelName]
        idName = def.idName()

        filter ?= {}
        filter[keyTo] = ctx.ctorArgs[idName]

        model.count filter, done
      else
        Model.count filter, done

      return
    return

  if Array.isArray methods
    methods.forEach addCounter

  return
