var Chainscript = require('../lib');

var cs = new Chainscript({body: {content: {name: 'My Document'}}});

cs.script.body.content.name += ' V2';
cs.script.body.content.meta = {
  author: 'Stephan Florquin',
  time: Date.now()
};

cs
  .run()
  .then(function() {
    console.log(cs.toJSON());
  });
