# Chainscript Javascript Client

Notarization: [`chainscript:envelope:6c1bffc7-d18e-4cb6-b133-4f86a9dfb1ff`](http://agent.chainscript.io/?chainscript:envelope:6c1bffc7-d18e-4cb6-b133-4f86a9dfb1ff) :heavy_check_mark:

Address: 1NryTMGRZuBruTeZ6RXLVR8xBWGJWNtDcx

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
$ cshashrec --help

  Usage: cshashrec [options] [path...] [-- chainscript args]

  Options:

    -h, --help              output usage information
    -V, --version           output the version number
    -a, --algorithm <name>  hash algorithm (default md5)
    -r, --root <path>       JSON root path

$ csverifyrec --help

  Usage: csverifyrec [options] [-- chainscript args]

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
$ cshashrec src bin -r content.hashes -a sha256 --  -U name:chainscript -U version:0.1.0 -s
```

As you can see, if `--` is present, `chainscript` will be executed with
`cshashrec`'s output with the arguments after `--`.

Output:

```json
{
  "body": {
    "content": {
      "hashes": {
        "algorithm": "sha256",
        "files": {
          "7ba8589465d0a82cf1b4a1064787f02efb915128493ae56a865887660e00507d": "src/Chainscript.js",
          "23949145cec009c2606323be55f9774af456677d824150f348d0b9265ea5312b": "src/index.js",
          "ba1f2a91227553135b30eb02c5a1430d8d684967a81faa004a05692e661e93ef": "src/utils/clone.js",
          "33b32aa8288a4757ab3f2fdc0c79f3f800e9697cc08eed094bd2a80cabdf891e": "src/utils/deepEquals.js",
          "aad9233e3bb695fa40c2861164801fbb2acf346768e33d359f892af29c3711e9": "src/utils/hashFile.js",
          "2d26c8203b69c4f183d9b0ca445279d88da516c2b2dc82218d400e0cfb05bf22": "src/utils/hashFiles.js",
          "09b6784a6b00944dec9a56c3061a46b9864573f40b04179fc686937af73390f6": "src/utils/readPackageSync.js",
          "830b2cda114bfdb7e7d1da8bbc3182ff477f9df9623d063c6ee681297ab7c574": "src/utils/verifyFiles.js",
          "4b6f137489985c4d6b40ea31fadfd145a5d10dcea1df1ea5c33d4c833f8b78fe": "bin/csverifyrec",
          "09b72b9eda9c36aa6979465ed39d8e9ea60b2847900fd4bbcc5d71f5b434df22": "bin/chainscript",
          "4da7b41223f7b43675d5a5d303e5502aa9227376e2ef1fb224286e0ed0af6152": "bin/cshashrec"
        }
      },
      "name": "chainscript",
      "version": "0.1.0"
    },
    "x_meta": {
      "uuid": "chainscript:envelope:8798b84e-8eb0-4f20-88a0-328b20a10aa5",
      "content_digest": "ef22b069fe02f1b7d7e8690bb314dd53864d6329",
      "revision": 1,
      "previous_hash": "447817723d2871df4193ce0eaf790ce083a587cd"
    }
  },
  "x_chainscript": {
    "validation": {
      "agent": "io.chainscript.agent",
      "version": "0.1.alpha",
      "result": "success",
      "validated_on": "2015-09-19T14:58:34+00:00"
    },
    "hash": "78944d58bb3fcb3c8281fe4b953830c7b8c50b34",
    "snapshots_enabled": true,
    "snapshot_url": "https://chainscript.firebaseio.com/snapshots/chainscript-envelope-8798b84e-8eb0-4f20-88a0-328b20a10aa5.json"
  }
}
```

Verify files:

```bash
$ csverifyrec -r body.content.hashes -- chainscript:envelope:8798b84e-8eb0-4f20-88a0-328b20a10aa5
```

As you can see, if `--` is present, `cshashrec` will be executed with
`chainscript`'s output with the arguments after `--`.

Output:

```json
Success
```

Update the hashes:

```bash
$ cshashrec src bin -r hashes -a sha256 -- -u @ -U version:0.1.1 -s chainscript:envelope:8798b84e-8eb0-4f20-88a0-328b20a10aa5
```

As you can see, you can use the special value `@` in `chainscript`'s arguments
to replace it with the output of `cshashrec`.

Output:

```json
{
  "body": {
    "content": {
      "hashes": {
        "algorithm": "sha256",
        "files": {
          "7ba8589465d0a82cf1b4a1064787f02efb915128493ae56a865887660e00507d": "src/Chainscript.js",
          "23949145cec009c2606323be55f9774af456677d824150f348d0b9265ea5312b": "src/index.js",
          "ba1f2a91227553135b30eb02c5a1430d8d684967a81faa004a05692e661e93ef": "src/utils/clone.js",
          "33b32aa8288a4757ab3f2fdc0c79f3f800e9697cc08eed094bd2a80cabdf891e": "src/utils/deepEquals.js",
          "aad9233e3bb695fa40c2861164801fbb2acf346768e33d359f892af29c3711e9": "src/utils/hashFile.js",
          "2d26c8203b69c4f183d9b0ca445279d88da516c2b2dc82218d400e0cfb05bf22": "src/utils/hashFiles.js",
          "09b6784a6b00944dec9a56c3061a46b9864573f40b04179fc686937af73390f6": "src/utils/readPackageSync.js",
          "830b2cda114bfdb7e7d1da8bbc3182ff477f9df9623d063c6ee681297ab7c574": "src/utils/verifyFiles.js",
          "09b72b9eda9c36aa6979465ed39d8e9ea60b2847900fd4bbcc5d71f5b434df22": "bin/chainscript",
          "4da7b41223f7b43675d5a5d303e5502aa9227376e2ef1fb224286e0ed0af6152": "bin/cshashrec",
          "7ff74a85c22c993cd1fbfb645bca27d17760cdf9edfb6b5d574e46738d0ecf63": "bin/csverifyrec"
        }
      },
      "name": "chainscript",
      "version": "0.1.1"
    },
    "x_meta": {
      "content_digest": "ef22b069fe02f1b7d7e8690bb314dd53864d6329",
      "previous_hash": "78944d58bb3fcb3c8281fe4b953830c7b8c50b34",
      "revision": 2,
      "uuid": "chainscript:envelope:8798b84e-8eb0-4f20-88a0-328b20a10aa5"
    }
  },
  "x_chainscript": {
    "hash": "a6d4cef3b663673dffcf3a817bd158b73a64e4cf",
    "snapshot_url": "https://chainscript.firebaseio.com/snapshots/chainscript-envelope-8798b84e-8eb0-4f20-88a0-328b20a10aa5.json",
    "snapshots_enabled": true,
    "validation": {
      "agent": "io.chainscript.agent",
      "result": "success",
      "validated_on": "2015-09-19T15:01:41+00:00",
      "version": "0.1.alpha"
    }
  }
}
```
