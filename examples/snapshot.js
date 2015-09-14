var Chainscript = require('../lib').Chainscript;

new Chainscript({document: 'My Document'})
  .snapshot()
  .run(function(err, script) {
    if (err) {
      console.log(err.message);
      return;
    }
    console.log(script.toJSON());
  });
