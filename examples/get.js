var Chainscript = require('../lib');

new Chainscript({body: {content: {name: 'My Document'}}}, true)
  .snapshot()
  .run()
  .then(function(cs) {
    console.log(cs.get('body.content.name'));
  })
  .fail(function(err) {
    console.error(err.message);
  });
