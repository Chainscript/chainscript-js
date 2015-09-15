var Chainscript = require('../lib');

new Chainscript({document: {content: {name: 'My Document'}}})
  .run()
  .then(function(script) {
    console.log(script.toJSON());
  })
  .fail(function(err) {
    console.error(err.message);
  });
