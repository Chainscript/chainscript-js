var Chainscript = require('../lib').Chainscript;

new Chainscript({document: 'My Document'})
  .snapshot()
  .run()
  .then(function(script) {
    console.log(script.toJSON());
  })
  .catch(function(err) {
    console.error(err.message);
  });
