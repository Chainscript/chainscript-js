var Chainscript = require('../lib').Chainscript;
var script = new Chainscript({document: 'My Document'});

script.run(function(err) {
  if (err) {
    console.log(err.message);
    return;
  }
  console.log(script.toJSON());
});
