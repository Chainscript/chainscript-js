var Chainscript = require('../lib');

var doc = {
  name: 'My Document'
};

var script = new Chainscript({document: {content: doc}});

doc.name = 'My Document V2';
doc.meta = {
  author: 'Stephan Florquin',
  time: Date.now()
};

script.delta(doc).run().then(function(s) {
  script = s;
  console.log(script.get('document.content'));
});
