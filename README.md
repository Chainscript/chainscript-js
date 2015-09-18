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

    -h, --help                  output usage information
    -V, --version               output the version number
    -u, --update <updates>      Update script
    -s, --snapshot              Snapshot script
    -n, --notarize              Notarize script
    -e, --email <address>       Email
    -S, --sign <wif>            Sign the digest
    --command-auditing <bool>   Enable or disable command auditing
    --revision-auditing <bool>  Enable or disable revision auditing
    -K, --gen-key               Generate and print a key pair and address
    -T, --testnet               Use testnet
    --execute-url <url>         Set execute url
    --snapshots-url <url>       Set snapshots url
```

### Examples

#### Dry run

```bash
$ chainscript '{"content": "Hello, World"}'
```

Or, simply:

```bash
$ chainscript "Hello, World"
```

Output:

```json
{
  "body": {
    "content": "Hello, World",
    "x_meta": {
      "uuid": "chainscript:envelope:374835af-8110-462c-a67d-804d65f2e1e9",
      "content_digest": "f4576163aceca4d8ff5113640f78837e73df7508"
    }
  },
  "x_chainscript": {
    "validation": {
      "agent": "io.chainscript.agent",
      "version": "0.1.alpha",
      "result": "valid",
      "validated_on": "2015-09-18T21:02:31+00:00",
      "message": "Envelope was executed without a command."
    },
    "hash": "c3317d755e89ed12e7156dd0ceb5bb1eaef3a068"
  }
}
```

#### Snapshot

```bash
$ chainscript -s "Hello, World"
```

Output:

```json
{
  "body": {
    "content": "Hello, World",
    "x_meta": {
      "uuid": "chainscript:envelope:4d82dc1a-514a-4272-ba54-cfee368a6005",
      "content_digest": "f4576163aceca4d8ff5113640f78837e73df7508"
    }
  },
  "x_chainscript": {
    "validation": {
      "agent": "io.chainscript.agent",
      "version": "0.1.alpha",
      "result": "success",
      "validated_on": "2015-09-18T21:02:52+00:00"
    },
    "hash": "cb837da586dbb2f5963129c51f9a2633d1b788e6",
    "snapshots_enabled": true,
    "snapshot_url": "https://chainscript.firebaseio.com/snapshots/chainscript-envelope-4d82dc1a-514a-4272-ba54-cfee368a6005.json"
  }
}
```

#### Multi Command Awesomeness

Snapshot a script, sign it, notarize it, then email it. Like a boss.

```bash
$ chainscript -sn \
  -S Kx5CcMYfJchiTt7H16BeorBJEvoCbHuCzSBynH6d4Zgdh8Uk384B \
  -e test@email.address \
  "Hello, World"
```

Output:

```json
{
  "body": {
    "content": "Hello, World",
    "x_meta": {
      "uuid": "chainscript:envelope:f13ff6eb-d017-45a3-a2e8-5f7ca07da4a6",
      "content_digest": "f4576163aceca4d8ff5113640f78837e73df7508",
      "signatures": {
        "1HvXn4RGQYhBSbECs29LohXJAgmNUcsXYT": {
          "digest": "f4576163aceca4d8ff5113640f78837e73df7508",
          "signature": "IE4EJFFWe+Apt437VBt6vq+wkTShKCwsPRD8odc9j6dXDb4zSdMA+5sCBaIECUw4cfTekI+T8jeMqAtnM+D2C0w="
        }
      },
      "revision": 1,
      "previous_hash": "ab79fa61295dcb6786a9692eeaac0ce9ae52840c"
    }
  },
  "x_chainscript": {
    "validation": {
      "agent": "io.chainscript.agent",
      "version": "0.1.alpha",
      "result": "success",
      "validated_on": "2015-09-18T21:03:20+00:00"
    },
    "hash": "7d7eeab07f76219627767037c3d1188355368969",
    "snapshots_enabled": true,
    "snapshot_url": "https://chainscript.firebaseio.com/snapshots/chainscript-envelope-f13ff6eb-d017-45a3-a2e8-5f7ca07da4a6.json",
    "transactions": {
      "chainscript:testnet3:tx:bbefa269768a9aeb00ab75d50d2e4774767ee5941d90924e6e08a26a4eeb0a6c": {
        "status": "broadcasted",
        "op_return": "7d7eeab07f76219627767037c3d1188355368969",
        "blockchain": "testnet3",
        "reference": "chainscript:notarization:b609d1c2-84a2-47f6-9eed-98fc7ab15d22",
        "broadcasted_on": "2015-09-18T21:03:20+00:00"
      }
    },
    "notarizations": {
      "chainscript:notarization:b609d1c2-84a2-47f6-9eed-98fc7ab15d22": {
        "hash": "7d7eeab07f76219627767037c3d1188355368969",
        "evidence": "chainscript:testnet3:tx:bbefa269768a9aeb00ab75d50d2e4774767ee5941d90924e6e08a26a4eeb0a6c",
        "notarized_at": "2015-09-18T21:03:20+00:00"
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

#### Chainscript#set(path, value)

Sets the value of a key at the specified path. Returns a new instance of
`Chainscript` if immutable, otherwise returns the instance.

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

Adds a sign_content command to the script. The private key must be in WIF
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
$ cshashrec src bin -r content.hashes -a sha256 | chainscript -s
```

Output:

```json
{
  "body": {
    "content": {
      "hashes": {
        "algorithm": "sha256",
        "files": {
          "31f6cc73b41939df310b97b25458da961ee67ba68021b82ab3c79fad987605ba": "src/Chainscript.js",
          "23949145cec009c2606323be55f9774af456677d824150f348d0b9265ea5312b": "src/index.js",
          "aad9233e3bb695fa40c2861164801fbb2acf346768e33d359f892af29c3711e9": "src/utils/hashFile.js",
          "0d1242271705df458fd96b57ebd9e51d41c1f6ab46a500041552666dd237dccc": "src/utils/hashFiles.js",
          "09b6784a6b00944dec9a56c3061a46b9864573f40b04179fc686937af73390f6": "src/utils/readPackageSync.js",
          "beacaa56259b080c5bf68a4f3c4a6cc0ea77a19bc289e8965f01a4becaebe176": "src/utils/verifyFiles.js",
          "1324dfbde390123b01c8fb56ff6a3b2c3f5003902cc316404b2dc0a0b3ca96b2": "bin/cshashrec",
          "15aaf7bccfa61a08d89429637345848d4422c80d9dd433968b2641db4af997cd": "bin/chainscript",
          "1e564fe0d0fb0019566d2023b44c28d0e6c69797ce0b5c9727bb0df67facd8d2": "bin/csverifyrec"
        }
      }
    },
    "x_meta": {
      "uuid": "chainscript:envelope:14f1ab16-5185-400d-b7c6-b2b7c3872cfc",
      "content_digest": "35140ba89a271419a259122506263a376c482b34"
    }
  },
  "x_chainscript": {
    "validation": {
      "agent": "io.chainscript.agent",
      "version": "0.1.alpha",
      "result": "success",
      "validated_on": "2015-09-18T21:05:19+00:00"
    },
    "hash": "26f2eb1b89c4ec42eae8c9eebe7293c6d85e237f",
    "snapshots_enabled": true,
    "snapshot_url": "https://chainscript.firebaseio.com/snapshots/chainscript-envelope-14f1ab16-5185-400d-b7c6-b2b7c3872cfc.json"
  }
}
```

Verify files:

```bash
$ chainscript chainscript:envelope:14f1ab16-5185-400d-b7c6-b2b7c3872cfc \
  | csverifyrec -r body.content.hashes
```

Output:

```json
Success
```

Update the hashes:

```bash
chainscript chainscript:envelope:14f1ab16-5185-400d-b7c6-b2b7c3872cfc \
  -u "`cshashrec src bin -r hashes`" -s
```

Output:

```json
{
  "body": {
    "content": {
      "hashes": {
        "algorithm": "md5",
        "files": {
          "1639f445d205268154f8ad3e497a7317": "src/Chainscript.js",
          "30dde352b3a3d137036c55d12fee8d74": "src/index.js",
          "d5542347814e4ef9ea5968281f956c40": "src/utils/hashFile.js",
          "02f2224b41ae0313cd3aa41eefb26f38": "src/utils/hashFiles.js",
          "380ae8f8bca3c42f90fcc6457da81fad": "src/utils/readPackageSync.js",
          "212b7f215310dfea91a27c3555cc8f2c": "src/utils/verifyFiles.js",
          "6b4a74a6b29625aefc816a7a7f9f235a": "bin/chainscript",
          "761dc68206dccb6095f22567ea7838af": "bin/cshashrec",
          "8e15d28e15b7801efd1c983340ff49b9": "bin/csverifyrec"
        }
      }
    },
    "x_meta": {
      "content_digest": "35140ba89a271419a259122506263a376c482b34",
      "uuid": "chainscript:envelope:14f1ab16-5185-400d-b7c6-b2b7c3872cfc",
      "revision": 1,
      "previous_hash": "26f2eb1b89c4ec42eae8c9eebe7293c6d85e237f"
    }
  },
  "x_chainscript": {
    "hash": "f40f6928f223f4164e1a4be4f52373c6fec2987c",
    "snapshot_url": "https://chainscript.firebaseio.com/snapshots/chainscript-envelope-14f1ab16-5185-400d-b7c6-b2b7c3872cfc.json",
    "snapshots_enabled": true,
    "validation": {
      "agent": "io.chainscript.agent",
      "result": "success",
      "validated_on": "2015-09-18T21:07:23+00:00",
      "version": "0.1.alpha"
    }
  }
}
```
