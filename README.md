# Chainscript Javascript Client

## Command line

### Install

```bash
$ npm install -g chainscript
```

### Usage

```bash
$ chainscript

  Usage: chainscript [options] <script | uuid>

  Options:

    -h, --help              output usage information
    -V, --version           output the version number
    -u, --update <updates>  Update script
    -s, --snapshot          Snapshot script
    -n, --notarize          Notarize script
    -e, --email <email>     Email
```

### Examples

#### Dry run

```bash
$ chainscript '{"body": {"content": {"title": "Hello, World!"}}}'
```

Output:

```json
{
  "body": {
    "content": {
      "title": "Hello, World!"
    },
    "x_meta": {
      "uuid": "chainscript:envelope:f9355225-8aaa-4313-8cb1-abff1fbe2052"
    }
  },
  "x_chainscript": {
    "validation": {
      "agent": "io.chainscript.agent",
      "version": "0.1.alpha",
      "result": "valid",
      "validated_on": "2015-09-16T13:50:49+00:00",
      "message": "Envelope was executed without a command."
    },
    "digest": "ce3249e52174914ee5fd98f4e74923947601b4d1"
  }
}
```

#### Snapshot

```bash
$ chainscript -s '{"body": {"content": {"title": "Hello, World!"}}}'
```

Output:

```json
{
  "body": {
    "content": {
      "title": "Hello, World!"
    },
    "x_meta": {
      "uuid": "chainscript:envelope:c586af82-568b-4920-8cd2-7963c54ff448"
    }
  },
  "x_chainscript": {
    "snapshots_enabled": true,
    "validation": {
      "agent": "io.chainscript.agent",
      "version": "0.1.alpha",
      "result": "success",
      "validated_on": "2015-09-16T13:52:34+00:00"
    },
    "digest": "8e16e37a945f5d15546a8a5e4f302fa2e392011e",
    "snapshot_url": "https://chainscript.firebaseio.com/snapshots/chainscript-envelope-c586af82-568b-4920-8cd2-7963c54ff448.json"
  }
}
```

#### Multiple commands

```bash
$ chainscript -s -n '{"body": {"content": {"title": "Hello, World!"}}}'
```

Output:

```json
{
  "body": {
    "content": {
      "title": "Hello, World!"
    },
    "x_meta": {
      "uuid": "chainscript:envelope:6efe306c-1d68-4762-ab93-51e49ee12915"
    }
  },
  "x_chainscript": {
    "snapshots_enabled": true,
    "validation": {
      "agent": "io.chainscript.agent",
      "version": "0.1.alpha",
      "result": "success",
      "validated_on": "2015-09-16T13:54:54+00:00"
    },
    "digest": "8cda8c896a89830611667008f90aa6ff914b7a60",
    "snapshot_url": "https://chainscript.firebaseio.com/snapshots/chainscript-envelope-6efe306c-1d68-4762-ab93-51e49ee12915.json",
    "transactions": {
      "chainscript:testnet3:tx:579781f31f217644d30490eb0de466f4c687f7cc2832221da8d128680dac535a": {
        "status": "broadcasted",
        "op_return": "8cda8c896a89830611667008f90aa6ff914b7a60",
        "blockchain": "testnet3",
        "reference": "chainscript:notarization:f6bc32a3-2b60-48b9-bb0c-5880736a293d",
        "broadcasted_on": "2015-09-16T13:54:54+00:00"
      }
    },
    "notarizations": {
      "chainscript:notarization:f6bc32a3-2b60-48b9-bb0c-5880736a293d": {
        "digest": "8cda8c896a89830611667008f90aa6ff914b7a60",
        "evidence": "chainscript:testnet3:tx:579781f31f217644d30490eb0de466f4c687f7cc2832221da8d128680dac535a",
        "notarized_at": "2015-09-16T13:54:54+00:00"
      }
    },
    "notarized": true
  }
}
```

#### Use existing script

Simply pass a Chainscript UUID instead of a script
(ex: chainscript:envelope:6efe306c-1d68-4762-ab93-51e49ee12915).

## API

### Install

```bash
$ npm install chainscript
```

### Creating a new script

```js
var Chainscript = require('chainscript-client');

// You pass the initial script
new Chainscript({body: {content: {name: 'My Document'}}})
  // Add a snapshot command
  .snapshot()
  // Add a notarize command
  .notarize()
  // Add a send mail command
  .email('stephan.florquin+test@gmail.com')
  // Run the script (returns a promise)
  .run()
  .then(function(cs) {
    console.log(cs.toJSON());
  })
  .fail(function(err) {
    console.error(err.message);
  });
```

### Starting from an existing script

```js
var Chainscript = require('chainscript-client');

Chainscript.load('chainscript:document:3940c155-d17d-421a-b34e-8bf5a458299e')
  .then(function(cs) {
    console.log(cs.toJSON());
    // You can add commands to the loaded script and run the script
    return cs
      .email('stephan.florquin+test@gmail.com')
      .run();
  }).then(function(cs) {
    // New script executed with added commands
    console.log(cs.toJSON());
  })
  .fail(function(err) {
    console.error(err.message);
  });
```

## Reference

### Chainscript

#### new Chainscript(script, immutable = false)

Creates a new Chainscript from a JSON object.

If `immutable` is `true`, **THE INSTANCE IS IMMUTABLE**. It is never modified
after initialization. Adding commands to a script returns a new instance.

#### Chainscript.load(uuid, immutable = false)

Loads an existing script. Returns a promise that resolves with an instance of
`Chainscript`.

#### Chainscript#get(path)

Returns the value at specified path, or `undefined` if the path doesn't exist.

Ex:

```js
var value = new Chainscript({body: {content: {name: 'My Document'}}})
  .get('body.content.name'));

console.log(value); // My Document
```

#### Chainscript#snapshot()

Adds a `snapshot` command to a script. Returns a new instance of `Chainscript`
if immutable, otherwise returns the instance.

#### Chainscript#update(updates)

Adds an `update` command to a script. Returns a new instance of `Chainscript`
if immutable, otherwise returns the instance.

#### Chainscript#notarize()

Adds a `notarize` command to a script. Returns a new instance of `Chainscript`
if immutable, otherwise returns the instance.

#### Chainscript#email(to)

Adds a `send_email` command to a script. Returns a new instance of `Chainscript`
if immutable, otherwise returns the instance.

#### Chainscript#change(fn)

Adds an `update` command to a script that applies granular updates to the
content. Returns a new instance of `Chainscript` if immutable, otherwise
returns the instance.

Ex:

```js
new Chainscript({body: {content: {name: 'My Document', val: true}}})
  .change(function(content) {
    delete content.val;
    content.name += ' V2';
    content.meta = {
      author: 'Stephan Florquin',
      time: Date.now()
    };
  })
  .run()
  .then(function(cs) {
    console.log(cs.get('body.content'));
  })
  .fail(function(err) {
    console.error(err.message);
  });
```

#### Chainscript#delta(content)

Adds an `update` command to a script that applies the necessary changes to
update the current content to the given content. Returns a new instance of
`Chainscript` if immutable, otherwise returns the instance.

Ex:
```js
var content = {
  name: 'My Document'
};

var cs = new Chainscript({body: {content: content}});

content.name = 'My Document V2';
content.meta = {
  author: 'Stephan Florquin',
  time: Date.now()
};

cs.delta(content).run().then(function() {
  console.log(cs.get('body.content'));
});
```

#### Chainscript#toJSON()

Returns the script as a JSON object.

#### Chainscript#run()

Runs the Chainscript. Returns a promise that resolves with a new instance of
`Chainscript` if immutable, otherwise with the instance.

#### Chainscript#clone()

Clones Chainscript. Returns a new instance of `Chainscript`.

#### Mutable extensions

This only applies when `immutable` is `false` (the default value).

You may change the script directly via `Chainscript#script`. If you  change the
body content directly, an update command will be issued if needed **before
other commands** when you call `run`.

```js
var cs = new Chainscript({body: {content: {name: 'My Document'}}});

cs.script.body.content.name += ' V2';
cs.script.body.content.meta = {
  author: 'Stephan Florquin',
  time: Date.now()
};

script
  .run()
  .then(function() {
    console.log(script.toJSON());
  });
```
