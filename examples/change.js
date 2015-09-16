var Chainscript = require('../lib');

new Chainscript({body: {content: {name: 'My Document'}}})
  .change(function(content) {
    content.name += ' V2';
    content.meta = {
      author: 'Stephan Florquin',
      time: Date.now()
    };
  })
  .run()
  .then(function(script) {
    console.log(script.get('body.content'));
    return script
      .change(function(content) {
        content.meta.author = 'SF';
      })
      .run();
  })
  .then(function(script) {
    console.log(script.get('body.content'));
    return script
      .change(function(content) {
        delete content.meta.time;
      })
      .run();
  })
  .then(function(script) {
    console.log(script.get('body.content'));
    return script
      .change(function(content) {
        delete content.meta;
      })
      .run();
  })
  .then(function(script) {
    console.log(script.get('body.content'));
  })
  .fail(function(err) {
    console.error(err.message);
  });
