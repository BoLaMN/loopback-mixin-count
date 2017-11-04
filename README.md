# loopback-mixin-count

adds header X-Total-Count with count of total rows works with relation methods aswell

* npm install loopback-mixin-count --save

## Setup

```
  mixins:
    Count:
      methods: [ 'find', 'findOne', '__get__relatedModelNamePlural' ]
```

License: MIT
