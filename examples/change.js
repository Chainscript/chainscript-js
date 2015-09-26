var Chainscript = require('../lib');

new Chainscript({body: {content: {name: 'My Document'}}}, true)
  .change(function(content) {
    content.name += ' V2';
    content.meta = {
      author: 'Stephan Florquin',
      time: Date.now()
    };
  })
  .run()
  .then(function(cs) {
    console.log(cs.get('body.content'));
    return cs
      .change(function(content) {
        content.meta.author = 'SF';
      })
      .run();
  })
  .then(function(cs) {
    console.log(cs.get('body.content'));
    return cs
      .change(function(content) {
        delete content.meta.time;
      })
      .run();
  })
  .then(function(cs) {
    console.log(cs.get('body.content'));
    return cs
      .change(function(content) {
        delete content.meta;
      })
      .run();
  })
  .then(function(cs) {
    console.log(cs.get('body.content'));
  })
  .catch(function(err) {
    console.error(err.message);
  });
