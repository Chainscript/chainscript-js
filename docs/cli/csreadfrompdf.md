# csreadfrompdf

A CLI tool to read a Chainscript attached to a PDF file. See
[cswritetopdf](cswritetopdf.md).

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
