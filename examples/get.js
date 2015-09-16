var Chainscript = require('../lib');

new Chainscript({body: {content: {name: 'My Document'}}})
  .snapshot()
  .run()
  .then(function(script) {
    console.log(script.get('body.content.name'));
  })
  .fail(function(err) {
    console.error(err.message);
  });
