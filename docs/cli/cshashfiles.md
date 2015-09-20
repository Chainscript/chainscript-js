# cshashfiles

A CLI tool to create hashes of files and optionally insert them into a
Chainscript.

## Install

```bash
$ npm install -g chainscript
```

## Usage

```bash
$ cshashfiles --help

  Usage: cshashfiles [options] [path...] [-- chainscript args]

  Options:

    -h, --help              output usage information
    -V, --version           output the version number
    -a, --algorithm <name>  hash algorithm (default sha256)
    -r, --root <path>       JSON root path
```

The algorithm can be either `sha1`, `sha256` (default), or `sha512`.

The paths will be resolved relative to the current working directory.

If no paths are given, it uses the current directory.

### Hash format

The hashes use the [multihash](https://github.com/jbenet/multihash) format,
encoded in base58.

Multihash makes it possible to know which hashing algorithm was used from the
hash itself.

Base58 keeps the digests compact and human readable.

### Ignoring files

You can have `.csignore` files to specify files that shouldn't be hashed. It
works just like `.gitignore`. If there are no `.csignore` files, it will use
`.gitignore` files if present.

Ex:

```
*.log
node_modules
coverage
```

## Examples

### Hash files in current directory

```bash
$ cshashfiles
```

Output:

```json
{
  "QmWfMk1nqjYzRUrBknehM5pvWfZ5L5wELJW3EfPtJLrDt8": "Chainscript.js",
  "QmQjYNaJM7jmfZcg1uDnxdhEYqfnyEaULUe1K5n3FHYQFk": "index.js",
  "QmasC73FhU2dySe5ybUDpaD6KPYeqFXUrTgNPKqJpkncfG": "utils/clone.js",
  "QmRpTxWxZocrvu1ndTmJS4pRDw9zREXKH8badyskmRgAcM": "utils/deepEquals.js",
  "QmVBv94bcG9VAD79SPMtiQ6ajp5wgdMvCQWJR9DRRAmzGZ": "utils/hashFile.js",
  "QmVfws9ydJ4VgsvLDQujNb7QWzsEbhqHnFcWLio12iwR9n": "utils/hashFiles.js",
  "QmNzZkoog5nRbf4p27ieEdZHbitXdFDRuDJGnPYwgoH3z5": "utils/readPackageSync.js",
  "QmWPiPb3vSj9pGnkyQj5osWhHZjzh5NyF1ftwmhsMZK18t": "utils/verifyFiles.js"
}
```

### Specify the JSON root key

To work with Chainscripts, it is very useful to be able to change where the
hashes should be inserted.

```bash
$ cshashfiles -r content.files
```

Output:

```json
{
  "content": {
    "files": {
      "QmWfMk1nqjYzRUrBknehM5pvWfZ5L5wELJW3EfPtJLrDt8": "Chainscript.js",
      "QmQjYNaJM7jmfZcg1uDnxdhEYqfnyEaULUe1K5n3FHYQFk": "index.js",
      "QmasC73FhU2dySe5ybUDpaD6KPYeqFXUrTgNPKqJpkncfG": "utils/clone.js",
      "QmRpTxWxZocrvu1ndTmJS4pRDw9zREXKH8badyskmRgAcM": "utils/deepEquals.js",
      "QmVBv94bcG9VAD79SPMtiQ6ajp5wgdMvCQWJR9DRRAmzGZ": "utils/hashFile.js",
      "QmVfws9ydJ4VgsvLDQujNb7QWzsEbhqHnFcWLio12iwR9n": "utils/hashFiles.js",
      "QmNzZkoog5nRbf4p27ieEdZHbitXdFDRuDJGnPYwgoH3z5": "utils/readPackageSync.js",
      "QmWPiPb3vSj9pGnkyQj5osWhHZjzh5NyF1ftwmhsMZK18t": "utils/verifyFiles.js"
    }
  }
}
```

### Pipe the output to chainscript

It is possible to pipe the output the `chainscript`, making it a powerful tool.

```bash
$ cshashfiles -r content.files --
```

Output:

```json
{
  "body": {
    "content": {
      "files": {
        "QmWfMk1nqjYzRUrBknehM5pvWfZ5L5wELJW3EfPtJLrDt8": "Chainscript.js",
        "QmQjYNaJM7jmfZcg1uDnxdhEYqfnyEaULUe1K5n3FHYQFk": "index.js",
        "QmasC73FhU2dySe5ybUDpaD6KPYeqFXUrTgNPKqJpkncfG": "utils/clone.js",
        "QmRpTxWxZocrvu1ndTmJS4pRDw9zREXKH8badyskmRgAcM": "utils/deepEquals.js",
        "QmVBv94bcG9VAD79SPMtiQ6ajp5wgdMvCQWJR9DRRAmzGZ": "utils/hashFile.js",
        "QmVfws9ydJ4VgsvLDQujNb7QWzsEbhqHnFcWLio12iwR9n": "utils/hashFiles.js",
        "QmNzZkoog5nRbf4p27ieEdZHbitXdFDRuDJGnPYwgoH3z5": "utils/readPackageSync.js",
        "QmWPiPb3vSj9pGnkyQj5osWhHZjzh5NyF1ftwmhsMZK18t": "utils/verifyFiles.js"
      }
    },
    "x_meta": {
      "uuid": "chainscript:envelope:a8760f65-fd8c-499d-b466-462e5caf801e",
      "content_digest": "18697857c445fe9e1560d04f63989c95b12c7253"
    }
  },
  "x_chainscript": {
    "validation": {
      "agent": "io.chainscript.agent",
      "version": "0.1.alpha",
      "result": "valid",
      "validated_on": "2015-09-20T13:21:58+00:00",
      "message": "Envelope was executed without a command."
    },
    "hash": "275dcec163080042083256a0ecfa80ad1c637412"
  }
}
```

### Pass flags to chainscript

You can also pass flags to `chainscript`. Say for example you want to add a
version key to your Chainscript:

```bash
$ cshashfiles -r content.files -- -U version:0.1.0
```

Output:

```json
{
  "body": {
    "content": {
      "files": {
        "QmWfMk1nqjYzRUrBknehM5pvWfZ5L5wELJW3EfPtJLrDt8": "Chainscript.js",
        "QmQjYNaJM7jmfZcg1uDnxdhEYqfnyEaULUe1K5n3FHYQFk": "index.js",
        "QmasC73FhU2dySe5ybUDpaD6KPYeqFXUrTgNPKqJpkncfG": "utils/clone.js",
        "QmRpTxWxZocrvu1ndTmJS4pRDw9zREXKH8badyskmRgAcM": "utils/deepEquals.js",
        "QmVBv94bcG9VAD79SPMtiQ6ajp5wgdMvCQWJR9DRRAmzGZ": "utils/hashFile.js",
        "QmVfws9ydJ4VgsvLDQujNb7QWzsEbhqHnFcWLio12iwR9n": "utils/hashFiles.js",
        "QmNzZkoog5nRbf4p27ieEdZHbitXdFDRuDJGnPYwgoH3z5": "utils/readPackageSync.js",
        "QmWPiPb3vSj9pGnkyQj5osWhHZjzh5NyF1ftwmhsMZK18t": "utils/verifyFiles.js"
      },
      "version": "0.1.0"
    },
    "x_meta": {
      "uuid": "chainscript:envelope:abe6671b-0e2f-48fb-9dae-2b0e30236d91",
      "content_digest": "d4b0957f5ff0f4d63c81f05936291fb0ea5364c2",
      "revision": 1,
      "previous_hash": "504eb22289a5dffde991845dda50eb9a42624985"
    }
  },
  "x_chainscript": {
    "validation": {
      "agent": "io.chainscript.agent",
      "version": "0.1.alpha",
      "result": "valid",
      "validated_on": "2015-09-20T13:24:41+00:00",
      "message": "Envelope was executed without a command."
    },
    "hash": "8c20b1bdb8b615d39d9de35be3d34dd82e033e3c"
  }
}
```

### The special `@` argument

Sometimes, you want to use the hash output as the value of a flag passed to
`chainscript`. You can do this by using `@`. For instance, this would update
the hashes in a snapshotted Chainscript.

```bash
$ cshashfiles -r files -- -u @ chainscript:envelope:3f91cb19-0a11-462a-89ef-97894d24f70e
```
