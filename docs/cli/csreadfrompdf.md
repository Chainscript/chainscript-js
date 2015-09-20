# csreadfrompdf

A CLI tool to read a Chainscript attached to a PDF file. See
[cswritetopdf](cswritetopdf.md).

**Requires [pdftk](https://www.pdflabs.com/tools/pdftk-server) to be
installed.**

## Install

```bash
$ npm install -g chainscript
```

## Usage

```bash
$ csreadfrompdf --help

  Usage: csreadfrompdf [options] input

  Options:

    -h, --help                    output usage information
    -V, --version                 output the version number
    -n, --attachment-name <name>  attachment name (default chainscript.json)
```

## Examples

### Read a script attached to a PDF file

```bash
$ csreadfrompdf document.pdf
```

Output:

```json
{
	"body": {
		"content": "hello world"
	}
}
```
