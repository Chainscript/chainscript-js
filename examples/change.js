var Chainscript = require('../lib');

new Chainscript({document: {content: {name: 'My Document'}}})
  .change(function(get, set) {
    set('name', get('name') + ' V2');
    set('meta.author', 'Stephan Florquin');
    set('meta.time', Date.now());
  })
  .run()
  .then(function(script) {
    console.log(script.get('document.content'));
  })
  .fail(function(err) {
    console.error(err.message);
  });
