var Chainscript = require('../lib');

new Chainscript({body: {content: {name: 'My Document'}}}, true)
  .update({time: Date.now()})
  .run()
  .then(function(cs) {
    console.log(cs.toJSON());
  })
  .catch(function(err) {
    console.error(err.message);
  });
