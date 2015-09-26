var Chainscript = require('../lib');

new Chainscript({
  body: {
    content: {
      name: 'My Document'
    }
  },
  x_chainscript : {
    snapshots_enabled: true
  }
}, true).snapshot()
  .run()
  .then(function(cs) {
    console.log(cs.toJSON());
  })
  .catch(function(err) {
    console.error(err.message);
  });
