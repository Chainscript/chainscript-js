# Chainscript Client

## Example

### Creating a new script

```js
var Chainscript = require('chainscript-client').Chainscript;

// You pass the initial script
new Chainscript({document: 'My Document'})
  // Add a snapshot command
  .snapshot()
  // Add a send mail command
  .email('stephan.florquin+test@gmail.com')
  // Run the script (returns a promise)
  .run()
  .then(function(script) {
    console.log(script.toJSON());
  })
  .fail(function(err) {
    console.error(err.message);
  });
```

### Starting from an existing script

```js
var Chainscript = require('chainscript-client').Chainscript;

Chainscript.load('chainscript:document:e1bdb650-1172-4d36-95c4-cef0f57c3a6f')
  .then(function(script) {
    console.log(script.toJSON());
    // You can add commands to the loaded script and run the script
    return script
      .email('stephan.florquin+test@gmail.com')
      .run();
  }).then(function(script) {
    // New script executed with added commands
    console.log(script.toJSON());
  })
  .fail(function(err) {
    console.error(err.message);
  });
```
