var Chainscript = require('../lib').Chainscript;

new Chainscript({document: 'My Document'})
  .run()
  .then(function(script) {
    console.log(script.toJSON());
  })
  .fail(function(err) {
    console.error(err.message);
  });
