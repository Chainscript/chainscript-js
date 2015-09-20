# Chainscript Javascript Client

Notarization: [1NryTMGRZuBruTeZ6RXLVR8xBWGJWNtDcx](chainscript.json)

## Command line

### Install

```bash
$ npm install -g chainscript
```

### Usage

```bash
$ chainscript --help

  Usage: chainscript [options] [script | uuid]

  Options:

    -h, --help                    output usage information
    -V, --version                 output the version number
    -u, --update <updates>        Update script
    -U, --update-key <key:value>  Update specific content key
    -s, --snapshot                Snapshot script
    -n, --notarize                Notarize script
    -e, --email <address>         Email
    --subject <subject>           Email subject
    -g, --get <path>              Output value at path
    -S, --sign <wif>              Sign the digest
    --command-auditing <bool>     Enable or disable command auditing
    --revision-auditing <bool>    Enable or disable revision auditing
    -K, --gen-key                 Generate and print a key pair and address
    -T, --testnet                 Use testnet
    --execute-url <url>           Set execute url
    --snapshots-url <url>         Set snapshots url
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

#### Chainscript#email(to, [subject])

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
$ cshashfiles --help

  Usage: cshashfiles [options] [path...] [-- chainscript args]

  Options:

    -h, --help              output usage information
    -V, --version           output the version number
    -a, --algorithm <name>  hash algorithm (default sha256)
    -r, --root <path>       JSON root path

$ csverifyfiles --help

  Usage: csverifyfiles [options] [-- chainscript args]

  Options:

    -h, --help         output usage information
    -V, --version      output the version number
    -r, --root <path>  JSON root path
```

They can be used to verify files recusively.

### Example

Insert hashes of files into Chainscript and snapshot it (normally you would also
sign it):

```bash
$ cshashfiles -r content.files -- -U name:chainscript -U version:0.1.0 -s
```

As you can see, if `--` is present, `chainscript` will be executed with
`cshashfiles`'s output with the arguments after `--`.

You can have `.csignore` files to specify files that shouldn't be hashed. It
works juste like `.gitignore`. If there are no `.csignore` files, it will use
`.gitignore` files if present.

The hashes use the [multihash](https://github.com/jbenet/multihash) format,
encoded in base58.

Output:

```json
{
  "body": {
    "content": {
      "files": {
        "QmXBCz6JRonwZVKpPASEc6DyDMUGttnfpY8Dz9PKZkKvfZ": "README.md",
        "QmbBL67vdc2Zb5C47jeiwpKmLqwqrexjBykh4LBG7yPAt3": "chainscript.json",
        "QmWWatxoogH1xZThBfnA2ZWfvHGt7pQJRiWtS5fsj4rh1H": "package.json",
        "QmUJbYrzH7a4K1wrQXjby8hA9242gTDpsxp8Kp7JtU3m7h": "webpack.base.config.js",
        "QmRf9FXaSqkw3rCP3asKoc6L11KY8kzxWMqGwf3zxAZk3M": "webpack.dev.config.js",
        "QmR3uUQvGHukzSmzMXUcQnMrsnfwmkmEkeSkKwX6VfRvsL": "webpack.prod.config.js",
        "QmdF1tqX9nb3kXaqToz7mdHt5hX9Yb3YHVYKYmsrb4DXa3": "bin/chainscript",
        "QmUzqFGm6JBRkrxjefefMuWyJzjn1uMY5rGgrYHkz8bQot": "bin/cshashfiles",
        "QmWxBC8MjsFohGR6UmBU2wp5RGwJkmCaVowJNwFsepeymt": "bin/csverifyfiles",
        "QmdYdpXFhSU3kWpbGdMceNbJiec2YSrW7egF7qUP249JM7": "test/Chainscript.js",
        "QmVtqeJFqZkvsfvrQovfTzH2ZQoBk42XeP7sJ31LqV6aAa": "examples/change.js",
        "QmXWxAu2ZWsjPZDCeFKeeDQTcEhZ3jJF1YJZMT4VPLji7N": "examples/delta.js",
        "QmdMirRApJmtobJAVQJ6QaQLsTLM8KNjb7hGbCQjPJEfGb": "examples/get.js",
        "QmUZi6TVRF4bqDqgAyA8onBs2mGeys8gdqDAcHnFqqE38T": "examples/load.js",
        "QmXr7c58PizwhjyZD4DHhep71Ppjs5Dc4xBd37JdeWDae7": "examples/multi.js",
        "QmW1DmK7CrbmFdzmJ68NdVSiSDDxfNwj6bFk2pdGMhf5y8": "examples/mutable.js",
        "QmTMM4hm7e8KAv18WfewV3WA3nR4hnSsthotYPxWEExicx": "examples/notarize.js",
        "QmRd9asTK4Te5Kno3jrdgUuzCmzToDxUvrsX7ccBWAxL8e": "examples/run.js",
        "QmVgJjGP9dCqiuJY6v2z6Mc3Tz1UgZhU67UBuycaSPLp1P": "examples/snapshot.js",
        "QmQZeAxcag8Jz87WrcFZWajQeDjqqvbEgY7xL3ZggM339n": "examples/update.js",
        "QmPH2SKanZ1Qh9KaT2xcaQMVGZZv3d8vqUqaxr8DMPgpPJ": "examples/browser/index.html",
        "QmPgHLVhYeRKAEFPX6wUSuYfMEUkU3KSzhP2NSQist5ReK": "lib/Chainscript.js",
        "QmSVTAZVXA3VY6tBpoHMQZkG6wnaZFekWQ6EBc4FZdcQNF": "lib/index.js",
        "QmWrjrVmDLes2nM8Y8JJUYJggGQexg8UUcvfKKaw5WGEhm": "lib/utils/clone.js",
        "QmQAxwciMb9xad8grgZPbxktZztZffg6X4xxrZv25tbqEZ": "lib/utils/deepEquals.js",
        "QmcU6P6xB44iKgxgmFK2zYpGwMqezAjacFpHtB9Uw2NKKn": "lib/utils/hashFile.js",
        "QmcGcAGx2QVPrkwGe7SjpKUsdxjPNMUraQ1xyJwqVeQ3rX": "lib/utils/hashFiles.js",
        "QmfMQuAiM44QUbV1B6TgfVBdsMp6mjGohnp26X9w5oYRHz": "lib/utils/readPackageSync.js",
        "QmWKn8qFbhtE45VRoAGWaCXPvUN2TS18wp1EaLyAfBCE46": "lib/utils/verifyFiles.js",
        "QmWfMk1nqjYzRUrBknehM5pvWfZ5L5wELJW3EfPtJLrDt8": "src/Chainscript.js",
        "QmQjYNaJM7jmfZcg1uDnxdhEYqfnyEaULUe1K5n3FHYQFk": "src/index.js",
        "QmasC73FhU2dySe5ybUDpaD6KPYeqFXUrTgNPKqJpkncfG": "src/utils/clone.js",
        "QmRpTxWxZocrvu1ndTmJS4pRDw9zREXKH8badyskmRgAcM": "src/utils/deepEquals.js",
        "QmVBv94bcG9VAD79SPMtiQ6ajp5wgdMvCQWJR9DRRAmzGZ": "src/utils/hashFile.js",
        "QmVfws9ydJ4VgsvLDQujNb7QWzsEbhqHnFcWLio12iwR9n": "src/utils/hashFiles.js",
        "QmNzZkoog5nRbf4p27ieEdZHbitXdFDRuDJGnPYwgoH3z5": "src/utils/readPackageSync.js",
        "QmWPiPb3vSj9pGnkyQj5osWhHZjzh5NyF1ftwmhsMZK18t": "src/utils/verifyFiles.js"
      },
      "name": "chainscript",
      "version": "0.1.0"
    },
    "x_meta": {
      "uuid": "chainscript:envelope:3f91cb19-0a11-462a-89ef-97894d24f70e",
      "content_digest": "bfcf0994fa585dd8b9515fbdfbe7fe14e12f2c06",
      "revision": 1,
      "previous_hash": "0e37791dd0086e5b17b097c57ad62e1010cc9235"
    }
  },
  "x_chainscript": {
    "validation": {
      "agent": "io.chainscript.agent",
      "version": "0.1.alpha",
      "result": "success",
      "validated_on": "2015-09-20T12:22:06+00:00"
    },
    "hash": "087de94c8d117e687d3a7ebae53ff72100dcb18e",
    "snapshots_enabled": true,
    "snapshot_url": "https://chainscript.firebaseio.com/snapshots/chainscript-envelope-3f91cb19-0a11-462a-89ef-97894d24f70e.json"
  }
}
```

Verify files:

```bash
$ csverifyfiles -r body.content.files -- chainscript:envelope:3f91cb19-0a11-462a-89ef-97894d24f70e
```

As you can see, if `--` is present, `cshashfiles` will be executed with
`chainscript`'s output with the arguments after `--`.

Output:

```json
Success
```

Update the hashes:

```bash
$ cshashfiles -r files -- -u @ -U version:0.1.1 -s chainscript:envelope:3f91cb19-0a11-462a-89ef-97894d24f70e
```

As you can see, you can use the special value `@` in `chainscript`'s arguments
to replace it with the output of `cshashfiles`.

Output:

```json
{
  "body": {
    "content": {
      "files": {
        "QmTwnmiWb72rbpYj5orkx3vNXwxpqPb95U3fN9gA8fazqN": "README.md",
        "QmbBL67vdc2Zb5C47jeiwpKmLqwqrexjBykh4LBG7yPAt3": "chainscript.json",
        "QmWWatxoogH1xZThBfnA2ZWfvHGt7pQJRiWtS5fsj4rh1H": "package.json",
        "QmUJbYrzH7a4K1wrQXjby8hA9242gTDpsxp8Kp7JtU3m7h": "webpack.base.config.js",
        "QmRf9FXaSqkw3rCP3asKoc6L11KY8kzxWMqGwf3zxAZk3M": "webpack.dev.config.js",
        "QmR3uUQvGHukzSmzMXUcQnMrsnfwmkmEkeSkKwX6VfRvsL": "webpack.prod.config.js",
        "QmdF1tqX9nb3kXaqToz7mdHt5hX9Yb3YHVYKYmsrb4DXa3": "bin/chainscript",
        "QmUzqFGm6JBRkrxjefefMuWyJzjn1uMY5rGgrYHkz8bQot": "bin/cshashfiles",
        "QmWxBC8MjsFohGR6UmBU2wp5RGwJkmCaVowJNwFsepeymt": "bin/csverifyfiles",
        "QmdYdpXFhSU3kWpbGdMceNbJiec2YSrW7egF7qUP249JM7": "test/Chainscript.js",
        "QmVtqeJFqZkvsfvrQovfTzH2ZQoBk42XeP7sJ31LqV6aAa": "examples/change.js",
        "QmXWxAu2ZWsjPZDCeFKeeDQTcEhZ3jJF1YJZMT4VPLji7N": "examples/delta.js",
        "QmdMirRApJmtobJAVQJ6QaQLsTLM8KNjb7hGbCQjPJEfGb": "examples/get.js",
        "QmXr7c58PizwhjyZD4DHhep71Ppjs5Dc4xBd37JdeWDae7": "examples/multi.js",
        "QmUZi6TVRF4bqDqgAyA8onBs2mGeys8gdqDAcHnFqqE38T": "examples/load.js",
        "QmW1DmK7CrbmFdzmJ68NdVSiSDDxfNwj6bFk2pdGMhf5y8": "examples/mutable.js",
        "QmTMM4hm7e8KAv18WfewV3WA3nR4hnSsthotYPxWEExicx": "examples/notarize.js",
        "QmRd9asTK4Te5Kno3jrdgUuzCmzToDxUvrsX7ccBWAxL8e": "examples/run.js",
        "QmVgJjGP9dCqiuJY6v2z6Mc3Tz1UgZhU67UBuycaSPLp1P": "examples/snapshot.js",
        "QmQZeAxcag8Jz87WrcFZWajQeDjqqvbEgY7xL3ZggM339n": "examples/update.js",
        "QmPH2SKanZ1Qh9KaT2xcaQMVGZZv3d8vqUqaxr8DMPgpPJ": "examples/browser/index.html",
        "QmPgHLVhYeRKAEFPX6wUSuYfMEUkU3KSzhP2NSQist5ReK": "lib/Chainscript.js",
        "QmSVTAZVXA3VY6tBpoHMQZkG6wnaZFekWQ6EBc4FZdcQNF": "lib/index.js",
        "QmWrjrVmDLes2nM8Y8JJUYJggGQexg8UUcvfKKaw5WGEhm": "lib/utils/clone.js",
        "QmQAxwciMb9xad8grgZPbxktZztZffg6X4xxrZv25tbqEZ": "lib/utils/deepEquals.js",
        "QmcU6P6xB44iKgxgmFK2zYpGwMqezAjacFpHtB9Uw2NKKn": "lib/utils/hashFile.js",
        "QmcGcAGx2QVPrkwGe7SjpKUsdxjPNMUraQ1xyJwqVeQ3rX": "lib/utils/hashFiles.js",
        "QmfMQuAiM44QUbV1B6TgfVBdsMp6mjGohnp26X9w5oYRHz": "lib/utils/readPackageSync.js",
        "QmWKn8qFbhtE45VRoAGWaCXPvUN2TS18wp1EaLyAfBCE46": "lib/utils/verifyFiles.js",
        "QmWfMk1nqjYzRUrBknehM5pvWfZ5L5wELJW3EfPtJLrDt8": "src/Chainscript.js",
        "QmQjYNaJM7jmfZcg1uDnxdhEYqfnyEaULUe1K5n3FHYQFk": "src/index.js",
        "QmasC73FhU2dySe5ybUDpaD6KPYeqFXUrTgNPKqJpkncfG": "src/utils/clone.js",
        "QmVBv94bcG9VAD79SPMtiQ6ajp5wgdMvCQWJR9DRRAmzGZ": "src/utils/hashFile.js",
        "QmRpTxWxZocrvu1ndTmJS4pRDw9zREXKH8badyskmRgAcM": "src/utils/deepEquals.js",
        "QmVfws9ydJ4VgsvLDQujNb7QWzsEbhqHnFcWLio12iwR9n": "src/utils/hashFiles.js",
        "QmWPiPb3vSj9pGnkyQj5osWhHZjzh5NyF1ftwmhsMZK18t": "src/utils/verifyFiles.js",
        "QmNzZkoog5nRbf4p27ieEdZHbitXdFDRuDJGnPYwgoH3z5": "src/utils/readPackageSync.js"
      },
      "name": "chainscript",
      "version": "0.1.1"
    },
    "x_meta": {
      "content_digest": "70a1a268faccb5fa7282a4b094e6ede6e8cef55d",
      "previous_hash": "87a6ba2d56e44d8e6040d786034738b01c1c6667",
      "revision": 3,
      "uuid": "chainscript:envelope:3f91cb19-0a11-462a-89ef-97894d24f70e"
    }
  },
  "x_chainscript": {
    "hash": "ae698a67cd302288d55405f0b21623b083c9a4d2",
    "snapshot_url": "https://chainscript.firebaseio.com/snapshots/chainscript-envelope-3f91cb19-0a11-462a-89ef-97894d24f70e.json",
    "snapshots_enabled": true,
    "validation": {
      "agent": "io.chainscript.agent",
      "result": "success",
      "validated_on": "2015-09-20T12:26:02+00:00",
      "version": "0.1.alpha"
    }
  }
}
```
