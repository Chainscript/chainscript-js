var Chainscript = require('../lib').Chainscript;

Chainscript.load('chainscript:document:e1bdb650-1172-4d36-95c4-cef0f57c3a6f')
  .then(function(script) {
    console.log(script.toJSON());
    return script
      .email('stephan.florquin+test@gmail.com')
      .run();
  }).then(function(script) {
    console.log(script.toJSON());
  })
  .catch(function(err) {
    console.error(err.message);
  });
