var Chainscript = require('../lib').Chainscript;

Chainscript.load('3940c155-d17d-421a-b34e-8bf5a458299e')
  .then(function(script) {
    console.log(script.toJSON());
    return script
      .email('stephan.florquin+test@gmail.com')
      .run();
  }).then(function(script) {
    console.log(script.toJSON());
  })
  .fail(function(err) {
    console.error(err.message);
  });
