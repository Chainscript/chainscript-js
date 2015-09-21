# chainscript

A CLI tool to interact with the [chainscript.io](http://chainscript.io) API.

## Install

```bash
$ npm install -g chainscript
```

## Usage

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
## Examples

### Dry run

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

### Snapshot

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

### Multi Command Awesomeness

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

### Working with a previously snapshotted script

Simply pass a Chainscript UUID instead of a script:

```bash
$ chainscript chainscript:envelope:6efe306c-1d68-4762-ab93-51e49ee12915
```

Output:

```json
{
  "body": {
    "content": {
      "title": "Hello, World!"
    },
    "x_meta": {
      "uuid": "chainscript:envelope:6efe306c-1d68-4762-ab93-51e49ee12915",
      "content_digest": "c6a8db2714ecc172e0302310835fd1f4781fa479"
    }
  },
  "x_chainscript": {
    "digest": "8cda8c896a89830611667008f90aa6ff914b7a60",
    "notarizations": {
      "chainscript:notarization:f6bc32a3-2b60-48b9-bb0c-5880736a293d": {
        "digest": "8cda8c896a89830611667008f90aa6ff914b7a60",
        "evidence": "chainscript:testnet3:tx:579781f31f217644d30490eb0de466f4c687f7cc2832221da8d128680dac535a",
        "notarized_at": "2015-09-16T13:54:54+00:00"
      }
    },
    "notarized": true,
    "snapshot_url": "https://chainscript.firebaseio.com/snapshots/chainscript-envelope-6efe306c-1d68-4762-ab93-51e49ee12915.json",
    "snapshots_enabled": true,
    "transactions": {
      "chainscript:testnet3:tx:579781f31f217644d30490eb0de466f4c687f7cc2832221da8d128680dac535a": {
        "blockchain": "testnet3",
        "broadcasted_on": "2015-09-16T13:54:54+00:00",
        "op_return": "8cda8c896a89830611667008f90aa6ff914b7a60",
        "reference": "chainscript:notarization:f6bc32a3-2b60-48b9-bb0c-5880736a293d",
        "status": "broadcasted"
      }
    },
    "validation": {
      "agent": "io.chainscript.agent",
      "result": "valid",
      "validated_on": "2015-09-20T13:31:10+00:00",
      "version": "0.1.alpha",
      "message": "Envelope was executed without a command."
    },
    "hash": "9dffc7e5f9f183345720452ce0e01984bc0d50c2"
  }
}
```
