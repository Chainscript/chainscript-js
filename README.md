# Chainscript Javascript Client

Notarisation: [1NryTMGRZuBruTeZ6RXLVR8xBWGJWNtDcx](chainscript.json)

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
    -a, --algorithm <name>  hash algorithm (default sha256)
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
$ cshashrec -r content.files -- -U name:chainscript -U version:0.1.0 -s
```

As you can see, if `--` is present, `chainscript` will be executed with
`cshashrec`'s output with the arguments after `--`.

You can have `.csignore` files to specify files that shouldn't be hashed. It
works juste like `.gitignore`. If there are no `.csignore` files, it will use
`.gitignore` files if present.

Output:

```json
{
  "body": {
    "content": {
      "files": {
        "122072cf1a0f96b94884a5c15e61b6439e48a63ca57ae96e665114bb8dd6d06fa45d": "README.md",
        "12202c78b45c0ce6f25f535c05c41c01547c41e347c19af414e0fc968caa25283b36": "chainscript.json",
        "12203a342d4c496d9a656b76cd062fbfddf8262f0dfa28a2ac67afad3d888569a572": "package.json",
        "1220589f633aff60e912ce5d959e4f6f55f667f93f703b83577d94623c4d134217d4": "webpack.base.config.js",
        "1220314fc9a01b49ac22a547f02725a8324a0c1d3487c764f3879e73a91fd7df4cc4": "webpack.dev.config.js",
        "12202848e170c19a2cd9df159cf05bb7b579636849b5d91323922f395ae7ada3edbb": "webpack.prod.config.js",
        "1220dd6dc5e409dac666d3360200a2b3014512b8663a9b65e9b8d06b8675a19f6344": "bin/chainscript",
        "122062ee1b5ec5d310f25120ad3317b5e150bf86dc5121e81ccaaaab26ed6d0faffb": "bin/cshashrec",
        "12207ff74a85c22c993cd1fbfb645bca27d17760cdf9edfb6b5d574e46738d0ecf63": "bin/csverifyrec",
        "1220c09c6ebcf6188148eb27b25a0671bc089ee3bc34d6dafcb490d2a10a542cb528": "dist/chainscript.js",
        "1220b54d61513f31c8f64533e927d8db99a71048922eed5d0bf444f2be86119ec5ab": "dist/chainscript.min.js",
        "1220e1f1449a0d0a626662a44d5ffe169732af6671ea657919ff2385518dbc3c2302": "test/Chainscript.js",
        "12207040c203e53beadca61b6ef2807b3d673e1d333bf6a2165ed0ff591bb9933d17": "examples/change.js",
        "1220885cbc1405f67c8776a951642c8ebd553acc9e112ab9201bcd829273dd03c335": "examples/delta.js",
        "1220df2591cd4837722d33b8e1abcc9481bd20a48852fb706dd2e2729401ad1ef7b8": "examples/get.js",
        "12205c7e7ffa71c2786b690e16423d1cf7e179c6ee24770c6a654092772b73f38300": "examples/load.js",
        "12208d456fe93bfdb00305726b85734d3c8841a5d75c8553632ab31fe093a471ec5c": "examples/multi.js",
        "122071e34144cc164b5b9331f4258b12ed86745bdc9a24fdd67318738962f8605af7": "examples/mutable.js",
        "12204a781076b19887e5e80ec5edba189b53eb1a421a5642290dc79a32a12df83331": "examples/notarize.js",
        "122030cd00c8df57052a274bce72d35cc015e5e10046663cb324b342d6825c2107af": "examples/run.js",
        "12206d0ad54c53258120bc4b99e9085e4f4cf9054908de9ee1107e61d84ae0f7346a": "examples/snapshot.js",
        "1220210b5131a774382f710e3b8c3ee1de96560d99657da1be73d19ee82024ccf0f5": "examples/update.js",
        "12200dedee7275d3bdf846422a59cd4e3a364e9818a6f382164de308322909242a21": "examples/browser/index.html",
        "122013e3231441ce2e99603001f2010069ec3b9e988b181f99886a7d71b21f84c0a4": "lib/Chainscript.js",
        "12203dafec19d276c2f64bd655ef3894b4c95fe885b7455dec7d4059398968c53ac4": "lib/index.js",
        "12207e92bc9c9d0d4d9a825b10a9d1c1c12f635dda44457486d79095af15febfafb8": "lib/utils/clone.js",
        "12201b3c2e8a85f3374c77170f62c26fd35fdf9248be1f91375f4e8ee474d7467492": "lib/utils/deepEquals.js",
        "1220663bb4759b1b85ce8e4c2a8289062e9f8401b17da7627a2e9425ccc48f14f609": "lib/utils/hashFile.js",
        "1220667f8e8bcce8738db78f4a4e6d73647880822245f2fce82c6c27be17d239a7c0": "lib/utils/hashFiles.js",
        "1220fcc8a4f441444b7237468388259903ed6161773e2c3ad721d70047650fcdeaf1": "lib/utils/readPackageSync.js",
        "1220447a836b41871ce3abfbab57c17741b395f2c25e5999861358884e1750771f30": "lib/utils/verifyFiles.js",
        "12207ba8589465d0a82cf1b4a1064787f02efb915128493ae56a865887660e00507d": "src/Chainscript.js",
        "122023949145cec009c2606323be55f9774af456677d824150f348d0b9265ea5312b": "src/index.js",
        "1220ba1f2a91227553135b30eb02c5a1430d8d684967a81faa004a05692e661e93ef": "src/utils/clone.js",
        "122033b32aa8288a4757ab3f2fdc0c79f3f800e9697cc08eed094bd2a80cabdf891e": "src/utils/deepEquals.js",
        "1220078095541833ca8f91dea40fd0f1ffa32f6201d065422427b089c147168d8751": "src/utils/hashFile.js",
        "122061ca01a39896e448b5067d610f964c9d855f117b1f6b322b9efeaf44d469bd85": "src/utils/hashFiles.js",
        "122009b6784a6b00944dec9a56c3061a46b9864573f40b04179fc686937af73390f6": "src/utils/readPackageSync.js",
        "122066efdb20872fc2304467de60003938e9edf6c3d03b4bdd315ebc81885fc9eac2": "src/utils/verifyFiles.js"
      },
      "name": "chainscript",
      "version": "0.1.0"
    },
    "x_meta": {
      "uuid": "chainscript:envelope:d4d3ce41-509f-4930-8ecf-b2afdc4019fe",
      "content_digest": "32cdf7fa0760ab2b770aaa65414739e779535182",
      "revision": 1,
      "previous_hash": "544f0619d36e0f066742f16a678021518c8193a6"
    }
  },
  "x_chainscript": {
    "validation": {
      "agent": "io.chainscript.agent",
      "version": "0.1.alpha",
      "result": "success",
      "validated_on": "2015-09-20T01:13:56+00:00"
    },
    "hash": "79342addd316ebad23bb3a1bd105cd7e48c26b3e",
    "snapshots_enabled": true,
    "snapshot_url": "https://chainscript.firebaseio.com/snapshots/chainscript-envelope-d4d3ce41-509f-4930-8ecf-b2afdc4019fe.json"
  }
}
```

Verify files:

```bash
$ csverifyrec -r body.content.files -- chainscript:envelope:d4d3ce41-509f-4930-8ecf-b2afdc4019fe
```

As you can see, if `--` is present, `cshashrec` will be executed with
`chainscript`'s output with the arguments after `--`.

Output:

```json
Success
```

Update the hashes:

```bash
$ cshashrec -r files -- -u @ -U version:0.1.1 -s chainscript:envelope:d4d3ce41-509f-4930-8ecf-b2afdc4019fe
```

As you can see, you can use the special value `@` in `chainscript`'s arguments
to replace it with the output of `cshashrec`.

Output:

```json
{
  "body": {
    "content": {
      "files": {
        "1220daa569fab6b08709ca8824e8f671d06c7155cdfb9c006e8e853114d0e748ccbe": "README.md",
        "12202c78b45c0ce6f25f535c05c41c01547c41e347c19af414e0fc968caa25283b36": "chainscript.json",
        "12203a342d4c496d9a656b76cd062fbfddf8262f0dfa28a2ac67afad3d888569a572": "package.json",
        "1220589f633aff60e912ce5d959e4f6f55f667f93f703b83577d94623c4d134217d4": "webpack.base.config.js",
        "1220314fc9a01b49ac22a547f02725a8324a0c1d3487c764f3879e73a91fd7df4cc4": "webpack.dev.config.js",
        "12202848e170c19a2cd9df159cf05bb7b579636849b5d91323922f395ae7ada3edbb": "webpack.prod.config.js",
        "1220dd6dc5e409dac666d3360200a2b3014512b8663a9b65e9b8d06b8675a19f6344": "bin/chainscript",
        "122062ee1b5ec5d310f25120ad3317b5e150bf86dc5121e81ccaaaab26ed6d0faffb": "bin/cshashrec",
        "12207ff74a85c22c993cd1fbfb645bca27d17760cdf9edfb6b5d574e46738d0ecf63": "bin/csverifyrec",
        "1220c09c6ebcf6188148eb27b25a0671bc089ee3bc34d6dafcb490d2a10a542cb528": "dist/chainscript.js",
        "1220b54d61513f31c8f64533e927d8db99a71048922eed5d0bf444f2be86119ec5ab": "dist/chainscript.min.js",
        "1220e1f1449a0d0a626662a44d5ffe169732af6671ea657919ff2385518dbc3c2302": "test/Chainscript.js",
        "12207040c203e53beadca61b6ef2807b3d673e1d333bf6a2165ed0ff591bb9933d17": "examples/change.js",
        "1220885cbc1405f67c8776a951642c8ebd553acc9e112ab9201bcd829273dd03c335": "examples/delta.js",
        "1220df2591cd4837722d33b8e1abcc9481bd20a48852fb706dd2e2729401ad1ef7b8": "examples/get.js",
        "12205c7e7ffa71c2786b690e16423d1cf7e179c6ee24770c6a654092772b73f38300": "examples/load.js",
        "12208d456fe93bfdb00305726b85734d3c8841a5d75c8553632ab31fe093a471ec5c": "examples/multi.js",
        "122071e34144cc164b5b9331f4258b12ed86745bdc9a24fdd67318738962f8605af7": "examples/mutable.js",
        "12204a781076b19887e5e80ec5edba189b53eb1a421a5642290dc79a32a12df83331": "examples/notarize.js",
        "122030cd00c8df57052a274bce72d35cc015e5e10046663cb324b342d6825c2107af": "examples/run.js",
        "12206d0ad54c53258120bc4b99e9085e4f4cf9054908de9ee1107e61d84ae0f7346a": "examples/snapshot.js",
        "1220210b5131a774382f710e3b8c3ee1de96560d99657da1be73d19ee82024ccf0f5": "examples/update.js",
        "12200dedee7275d3bdf846422a59cd4e3a364e9818a6f382164de308322909242a21": "examples/browser/index.html",
        "122013e3231441ce2e99603001f2010069ec3b9e988b181f99886a7d71b21f84c0a4": "lib/Chainscript.js",
        "12203dafec19d276c2f64bd655ef3894b4c95fe885b7455dec7d4059398968c53ac4": "lib/index.js",
        "12207e92bc9c9d0d4d9a825b10a9d1c1c12f635dda44457486d79095af15febfafb8": "lib/utils/clone.js",
        "12201b3c2e8a85f3374c77170f62c26fd35fdf9248be1f91375f4e8ee474d7467492": "lib/utils/deepEquals.js",
        "1220663bb4759b1b85ce8e4c2a8289062e9f8401b17da7627a2e9425ccc48f14f609": "lib/utils/hashFile.js",
        "1220667f8e8bcce8738db78f4a4e6d73647880822245f2fce82c6c27be17d239a7c0": "lib/utils/hashFiles.js",
        "1220fcc8a4f441444b7237468388259903ed6161773e2c3ad721d70047650fcdeaf1": "lib/utils/readPackageSync.js",
        "1220f6f480e860949a398184839abbc09444085e513a8bb3e9a7cffb5ce3883ed82c": "lib/utils/verifyFiles.js",
        "12207ba8589465d0a82cf1b4a1064787f02efb915128493ae56a865887660e00507d": "src/Chainscript.js",
        "122023949145cec009c2606323be55f9774af456677d824150f348d0b9265ea5312b": "src/index.js",
        "1220ba1f2a91227553135b30eb02c5a1430d8d684967a81faa004a05692e661e93ef": "src/utils/clone.js",
        "122033b32aa8288a4757ab3f2fdc0c79f3f800e9697cc08eed094bd2a80cabdf891e": "src/utils/deepEquals.js",
        "1220078095541833ca8f91dea40fd0f1ffa32f6201d065422427b089c147168d8751": "src/utils/hashFile.js",
        "122061ca01a39896e448b5067d610f964c9d855f117b1f6b322b9efeaf44d469bd85": "src/utils/hashFiles.js",
        "122009b6784a6b00944dec9a56c3061a46b9864573f40b04179fc686937af73390f6": "src/utils/readPackageSync.js",
        "122066efdb20872fc2304467de60003938e9edf6c3d03b4bdd315ebc81885fc9eac2": "src/utils/verifyFiles.js"
      },
      "name": "chainscript",
      "version": "0.1.1"
    },
    "x_meta": {
      "content_digest": "fb6686aa43cba29a949ef72526dec67b02428d44",
      "previous_hash": "79342addd316ebad23bb3a1bd105cd7e48c26b3e",
      "revision": 2,
      "uuid": "chainscript:envelope:d4d3ce41-509f-4930-8ecf-b2afdc4019fe"
    }
  },
  "x_chainscript": {
    "hash": "10aead856c4efc5d076814513ab7ecc00c0be09e",
    "snapshot_url": "https://chainscript.firebaseio.com/snapshots/chainscript-envelope-d4d3ce41-509f-4930-8ecf-b2afdc4019fe.json",
    "snapshots_enabled": true,
    "validation": {
      "agent": "io.chainscript.agent",
      "result": "success",
      "validated_on": "2015-09-20T01:16:29+00:00",
      "version": "0.1.alpha"
    }
  }
}
```
