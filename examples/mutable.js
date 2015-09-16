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
    console.log(cs.toJSON().body.content);
    cs.script.body.content.meta.genre = 'comedy';
    return cs.run();
  })
  .then(function() {
    console.log(cs.toJSON().body.content);
    delete cs.script.body.content.meta.time;
    return cs.run();
  })
  .then(function() {
    console.log(cs.toJSON().body.content);
  });
