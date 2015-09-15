var Chainscript = require('../lib');

new Chainscript({
  document: {
    content: {
      name: 'My Document'
    }
  },
  x_chainscript : {
    snapshots_enabled: true
  }
}).snapshot()
  .run()
  .then(function(script) {
    console.log(script.toJSON());
  })
  .fail(function(err) {
    console.error(err.message);
  });
