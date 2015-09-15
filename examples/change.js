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
    return script
      .change(function(get, set) {
        set('meta.author', 'SF');
      })
      .run();
  })
  .then(function(script) {
    console.log(script.get('document.content'));
    return script
      .change(function(get, set, remove) {
        remove('meta.time');
      })
      .run();
  })
  .then(function(script) {
    console.log(script.get('document.content'));
    return script
      .change(function(get, set, remove) {
        remove('meta');
      })
      .run();
  })
  .then(function(script) {
    console.log(script.get('document.content'));
  })
  .fail(function(err) {
    console.error(err.message);
  });
