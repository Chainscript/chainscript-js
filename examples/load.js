var Chainscript = require('../lib').Chainscript;

Chainscript.load(
  'chainscript:document:e1bdb650-1172-4d36-95c4-cef0f57c3a6f',
  function(err, script) {
    if (err) {
      console.log(err.message);
      return;
    }
    script
      .email('stephan.florquin+test@gmail.com')
      .run(function(err, script) {
        if (err) {
          console.log(err.message);
          return;
        }
        console.log(script.toJSON());
      });
  }
);
