var Chainscript = require('../lib');

var script = new Chainscript(
  {body: {content: {name: 'My Document'}}},
  false
);

script.content.name += ' V2';
script.content.meta = {
  author: 'Stephan Florquin',
  time: Date.now()
};

script
  .run()
  .then(function() {
    console.log(script.toJSON());
  });
