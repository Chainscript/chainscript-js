var Chainscript = require('../lib');

new Chainscript({body: {content: {name: 'My Document'}}}, true)
  .snapshot()
  .notarize()
  .run()
  .then(function(cs) {
    console.log(cs.toJSON());
  })
  .catch(function(err) {
    console.error(err.message);
  });
