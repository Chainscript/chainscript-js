var Chainscript = require('../lib');

Chainscript.load('chainscript:document:3940c155-d17d-421a-b34e-8bf5a458299e')
  .then(function(cs) {
    console.log(cs.toJSON());
    return cs
      .email('test@email.address')
      .run();
  }).then(function(cs) {
    console.log(cs.toJSON());
  })
  .catch(function(err) {
    console.error(err.message);
  });
