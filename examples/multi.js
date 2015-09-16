var Chainscript = require('../lib');

new Chainscript({body: {content: {name: 'My Document'}}})
  .snapshot()
  .email('stephan.florquin+test@gmail.com')
  .run()
  .then(function(script) {
    console.log(script.toJSON());
  })
  .fail(function(err) {
    console.error(err.message);
  });
