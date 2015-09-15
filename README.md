# Chainscript Javascript Client

## Example

### Creating a new script

```js
var Chainscript = require('chainscript-client');

// You pass the initial script
new Chainscript({document: {content: {name: 'My Document'}}})
  // Add a snapshot command
  .snapshot()
  // Add a notarize command
  .notarize()
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
var Chainscript = require('chainscript-client');

Chainscript.load('3940c155-d17d-421a-b34e-8bf5a458299e')
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

## API

### Chainscript

`Chainscript` **IS IMMUTABLE**. An instance is never modified after
initialization. Adding commands to a script returns a new instance.

#### new Chainscript(script)

Creates a new Chainscript from a JSON object.

#### Chainscript.load(uuid)

Loads an existing script. Returns a promise that resolves with an instance of
`Chainscript`.

#### Chainscript#get(path)

Returns the value at specified path, or `undefined` if the path doesn't exist.

Ex:

```js
var value = new Chainscript({document: {content: {name: 'My Document'}}})
  get('document.content.name'));

console.log(value); // My Document
```

#### Chainscript#snapshot()

Adds a `snapshot` command to a script. Returns a new instance of `Chainscript`.

#### Chainscript#update(updates)

Adds an `update` command to a script. Returns a new instance of `Chainscript`.

#### Chainscript#change(fn)

Adds an `update` command to a script that applies granular updates to the
document. Returns a new instance of `Chainscript`.

Ex:

```js
new Chainscript({document: {content: {name: 'My Document'}}})
  .change(function(get, set, remove) {
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
```

#### Chainscript#notarize()

Adds a `notarize` command to a script. Returns a new instance of `Chainscript`.

#### Chainscript#email(to)

Adds a `send_email` command to a script. Returns a new instance of
`Chainscript`.

#### Chainscript#toJSON()

Returns the script as a JSON object.

#### Chainscript#run()

Runs the Chainscript. Returns a promise that resolves with a new instance of
`Chainscript`.

#### Chainscript#clone()

Clones Chainscript. Returns a new instance of `Chainscript`.
