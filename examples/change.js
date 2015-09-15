var Chainscript = require('../lib');

new Chainscript({document: {content: {name: 'My Document'}}})
  .change(function(doc) {
    doc.name += ' V2';
    doc.meta = {
      author: 'Stephan Florquin',
      time: Date.now()
    };
  })
  .run()
  .then(function(script) {
    console.log(script.get('document.content'));
    return script
      .change(function(doc) {
        doc.meta.author = 'SF';
      })
      .run();
  })
  .then(function(script) {
    console.log(script.get('document.content'));
    return script
      .change(function(doc) {
        delete doc.meta.time;
      })
      .run();
  })
  .then(function(script) {
    console.log(script.get('document.content'));
    return script
      .change(function(doc) {
        delete doc.meta;
      })
      .run();
  })
  .then(function(script) {
    console.log(script.get('document.content'));
  })
  .fail(function(err) {
    console.error(err.message);
  });
