# cshashpdf

A CLI tool to hash a PDF file.

## Install

```bash
$ npm install -g chainscript
```

## Usage

```bash
$ cshashpdf --help

  Usage: cshashpdf [options] input [-- chainscript args]

  Options:

    -h, --help              output usage information
    -V, --version           output the version number
    -a, --algorithm <name>  hash algorithm (default sha256)
    -r, --root <path>       JSON root path (default content.hash)
```

The hash is a hash of the file minus any data that was written to the PDF using
`cswritetopdf`.

## Examples

### Output the hash of a PDF file

```bash
$ cshashpdf document.pdf
```

Output:

```json
{
	"content": {
		"hash": "QmX9gpK67Rx4PHFkpTxo2FFPyfaGmQnJCVZhCRSm8jC9Ei"
	}
}
```
