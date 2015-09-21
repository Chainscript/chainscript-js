# csverifypdf

A CLI tool to check if a hash embedded in a PDF is valid.

## Install

```bash
$ npm install -g chainscript
```

## Usage

```bash
$ csverifypdf --help

  Usage: csverifypdf [options] [hashes] [-- chainscript args]

  Options:

    -h, --help         output usage information
    -V, --version      output the version number
    -r, --root <path>  JSON root path (default body.content.hash)
```

## Examples

### Inject a hash into a PDF then verify it

```bash
$ cshashpdf document.pdf -r body.content.hash | cswritetopdf document.pdf output.pdf
$ csverifypdf output.pdf 
```

Output:

```json
Success
```
