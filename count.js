var debug, defaults;

debug = require('debug')('loopback:mixins:timestamp');

defaults = require('lodash').defaults;

module.exports = function(Model, options) {
  var addCounter, methods;
  methods = options.methods;
  addCounter = function(method) {
    Model.afterRemote(method, function(ctx, unused, next) {
      var def, done, filter, idName, input, keyTo, matches, model, modelThrough, modelTo, ref, regExp, relation;
      regExp = /^__([^_]+)__([^_]+)$/;
      if (ctx.res._headerSent) {
        return next();
      }
      done = function(err, count) {
        if (!ctx.res._headerSent) {
          ctx.res.set('Access-Control-Expose-Headers', 'X-Total-Count');
          ctx.res.set('X-Total-Count', count);
        }
        next();
      };
      filter = {};
      if (ctx.args && ctx.args.filter) {
        if (typeof ctx.args.filter === 'object') {
          filter = ctx.args.filter.where;
        } else {
          filter = JSON.parse(ctx.args.filter).where;
        }
      }
      matches = ctx.method.name.match(regExp);
      if ((matches != null ? matches.length : void 0) > 1) {
        input = matches[0], method = matches[1], relation = matches[2];
        ref = Model.relations[relation], keyTo = ref.keyTo, modelTo = ref.modelTo, modelThrough = ref.modelThrough;
        model = modelThrough || modelTo;
        def = Model.app.registry.modelBuilder.definitions[model.modelName];
        idName = def.idName();
        if (filter == null) {
          filter = {};
        }
        filter[keyTo] = ctx.ctorArgs[idName];
        model.count(filter, done);
      } else {
        Model.count(filter, done);
      }
    });
  };
  if (Array.isArray(methods)) {
    methods.forEach(addCounter);
  }
};
