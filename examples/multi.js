var Chainscript = require('../lib');

new Chainscript({body: {content: {name: 'My Document'}}}, true)
  .snapshot()
  .email('test@email.address')
  .run()
  .then(function(cs) {
    console.log(cs.toJSON());
  })
  .fail(function(err) {
    console.error(err.message);
  });
