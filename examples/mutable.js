var Chainscript = require('../lib');

var script = new Chainscript(
  {document: {content: {name: 'My Document'}}},
  false
);

script
  .change(function(doc) {
    doc.name += ' V2';
    doc.meta = {
      author: 'Stephan Florquin',
      time: Date.now()
    };
  })
  .run()
  .then(function() {
    console.log(script.get('document.content'));
  })
  .fail(function(err) {
    console.error(err.message);
  });
