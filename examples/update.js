var Chainscript = require('../lib');

new Chainscript({document: {content: {name: 'My Document'}}})
  .update({time: Date.now()})
  .run()
  .then(function(script) {
    console.log(script.toJSON());
  })
  .fail(function(err) {
    console.error(err.message);
  });
