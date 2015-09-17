# Chainscript Javascript Client

## Command line

### Install

```bash
$ npm install -g chainscript
```

### Usage

```bash
$ chainscript --help

  Usage: chainscript [options] <script | uuid>

  Options:

    -h, --help                         output usage information
    -V, --version                      output the version number
    -u, --update <updates>             Update script
    -s, --snapshot                     Snapshot script
    -n, --notarize                     Notarize script
    -e, --email <address>              Email
    -S, --sign <wif>                   Sign the hash
    --command-auditing <bool>          Enable or disable command auditing
    --revision-auditing <bool>         Enable or disable revision auditing
    -K, --gen-key                      Generate and print a key pair and address
    -T, --testnet                      Use testnet
```

### Examples

#### Dry run

```bash
$ chainscript '{"content": "Hello, World!"}'
```

Or, simply:

```bash
$ chainscript "Hello, World!"
```

Output:

```json
{
  "body": {
    "content": "Hello, World!",
    "x_meta": {
      "uuid": "chainscript:envelope:70b7094d-6391-4bee-95b9-a554a00be417"
    }
  },
  "x_chainscript": {
    "validation": {
      "agent": "io.chainscript.agent",
      "version": "0.1.alpha",
      "result": "valid",
      "validated_on": "2015-09-16T21:00:02+00:00",
      "message": "Envelope was executed without a command."
    },
    "hash": "1743420f00b7b1ec478844a7fcd4a9030066059b"
  }
}
```

#### Snapshot

```bash
$ chainscript -s '{"content": "Hello, World!"}'
```

Output:

```json
{
  "x_chainscript": {
    "snapshots_enabled": true,
    "validation": {
      "agent": "io.chainscript.agent",
      "version": "0.1.alpha",
      "result": "success",
      "validated_on": "2015-09-16T21:00:30+00:00"
    },
    "hash": "7903464ac9c9d1fa268efc9e8264b476483251c5",
    "snapshot_url": "https://chainscript.firebaseio.com/snapshots/chainscript-envelope-d7fee738-958f-42bb-9e43-2fa00d071bef.json"
  },
  "body": {
    "content": "Hello, World!",
    "x_meta": {
      "uuid": "chainscript:envelope:d7fee738-958f-42bb-9e43-2fa00d071bef"
    }
  }
}
```

#### Multi Command Awesomeness

Snapshot a script, sign it, notarize it, then email it. Like a boss.

```bash
$ chainscript -sn \
  -S Kx5CcMYfJchiTt7H16BeorBJEvoCbHuCzSBynH6d4Zgdh8Uk384B \
  -e test@email.address \
  '{"content": "Hello, World!"}'
```

Output:

```json
{
  "body": {
    "content": "Hello, World!",
    "x_meta": {
      "uuid": "chainscript:envelope:db138976-72a3-4eea-b534-9a8ab0e4ae7b"
    }
  },
  "x_chainscript": {
    "validation": {
      "agent": "io.chainscript.agent",
      "version": "0.1.alpha",
      "result": "success",
      "validated_on": "2015-09-16T21:03:57+00:00"
    },
    "hash": "08ded1c29581d66ba5bbe1fbca5906b0eb2449b6",
    "snapshots_enabled": true,
    "snapshot_url": "https://chainscript.firebaseio.com/snapshots/chainscript-envelope-db138976-72a3-4eea-b534-9a8ab0e4ae7b.json",
    "signatures": {
      "1HvXn4RGQYhBSbECs29LohXJAgmNUcsXYT": {
        "hash": "08ded1c29581d66ba5bbe1fbca5906b0eb2449b6",
        "signature": "ICGirBtu/gycrw0gQnlMJsw7waSlZqYrGppj3tkHhDqef2XOtUIAh8XDi8KdzJfz/OeqCqpTxv64kJXhhw0AfG0="
      }
    },
    "signatures_valid": true,
    "transactions": {
      "chainscript:testnet3:tx:8895f3e890d36dfdae6ba67d4169f3125a67f1d7d6a7fed36a22fe3909228919": {
        "status": "broadcasted",
        "op_return": "08ded1c29581d66ba5bbe1fbca5906b0eb2449b6",
        "blockchain": "testnet3",
        "reference": "chainscript:notarization:0fea9345-27f1-4f44-875d-35f2e89f178c",
        "broadcasted_on": "2015-09-16T21:03:57+00:00"
      }
    },
    "notarizations": {
      "chainscript:notarization:0fea9345-27f1-4f44-875d-35f2e89f178c": {
        "hash": "08ded1c29581d66ba5bbe1fbca5906b0eb2449b6",
        "evidence": "chainscript:testnet3:tx:8895f3e890d36dfdae6ba67d4169f3125a67f1d7d6a7fed36a22fe3909228919",
        "notarized_at": "2015-09-16T21:03:57+00:00"
      }
    },
    "notarized": true
  }
}
```

#### Use existing script

Simply pass a Chainscript UUID instead of a script
(ex: `chainscript:envelope:6efe306c-1d68-4762-ab93-51e49ee12915`).

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
  .email('test@email.address')
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
      .email('test@email.address')
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

#### Chainscript#sign(wif)

Adds a signature of the hash to a script. The private key must be in WIF
format. Returns a new instance of `Chainscript` if immutable, otherwise
returns the instance.

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

## Extras

There are two extra bundled executables:

```bash
$ cshashrec --help

  Usage: cshashrec [options] [...path]

  Options:

    -h, --help              output usage information
    -V, --version           output the version number
    -a, --algorithm <name>  hash algorithm (default md5)
    -r, --root <path>       JSON root path

$ csverifyrec --help

  Usage: csverifyrec [options]

  Options:

    -h, --help         output usage information
    -V, --version      output the version number
    -r, --root <path>  JSON root path
```

They can be used to verify files recusively.

### Example

Insert hashes of files into Chainscript (normally you would also sign it):

```bash
$ cshashrec src -r hashes -a sha256 | chainscript -s
```

Output:

```json
{
  "body": {
    "content": {
      "hashes": {
        "algorithm": "sha256",
        "files": {
          "edb4f912b789246dc16c37e842d80543df79a307fe59088534b63a3a1dba0164": "src/Chainscript.js",
          "23949145cec009c2606323be55f9774af456677d824150f348d0b9265ea5312b": "src/index.js",
          "aad9233e3bb695fa40c2861164801fbb2acf346768e33d359f892af29c3711e9": "src/utils/hashFile.js",
          "1855a8034b683ee1a3a73ae1364362e3a73cc92ba709f0a5b096095e2f582943": "src/utils/hashFiles.js",
          "83a669de48331cb7f965c16c494cccac9815b67335a80b38714d74c89212d055": "src/utils/verifyFiles.js"
        }
      }
    },
    "x_meta": {
      "uuid": "chainscript:envelope:3bc3ea98-dc4f-4f1c-9def-a24331aa4b96",
      "content_digest": "680ac249316d5f865b8d598f9da9a0b0e12a499c"
    }
  },
  "x_chainscript": {
    "validation": {
      "agent": "io.chainscript.agent",
      "version": "0.1.alpha",
      "result": "success",
      "validated_on": "2015-09-17T22:07:37+00:00"
    },
    "hash": "a81586b16ab7ee5d3d2f0356e62657ed758f5a53",
    "snapshots_enabled": true,
    "snapshot_url": "https://chainscript.firebaseio.com/snapshots/chainscript-envelope-3bc3ea98-dc4f-4f1c-9def-a24331aa4b96.json"
  }
}
```

Verify files:

```bash
$ chainscript chainscript:envelope:3bc3ea98-dc4f-4f1c-9def-a24331aa4b96 \
  | csverifyrec -r hashes
```

Output:

```json
Success
``json
