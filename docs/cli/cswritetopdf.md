# cswritetopdf

A CLI tool to attach a Chainscript to a PDF file.

**Requires [pdftk](https://www.pdflabs.com/tools/pdftk-server) to be
installed.**

## Install

```bash
$ npm install -g chainscript
```

## Usage

```bash
$ cswritetopdf --help

  Usage: cswritetopdf [options] input output [json]

  Options:

    -h, --help                    output usage information
    -V, --version                 output the version number
    -n, --attachment-name <name>  attachment name (default chainscript.json)
```

## Examples

### Attach a script to a PDF file

```bash
$ cswritetopdf input.pdf output.pdf '{"body": {"content": "hello world"}}'
```
