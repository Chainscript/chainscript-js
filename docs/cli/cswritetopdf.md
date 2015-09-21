# cswritetopdf

A CLI tool to attach a Chainscript to a PDF file.

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
```

## Examples

### Attach a script to a PDF file

```bash
$ cswritetopdf input.pdf output.pdf '{"body": {"content": "hello world"}}'
```
