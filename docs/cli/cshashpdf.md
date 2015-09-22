# cshashpdf

A CLI tool to hash a PDF file and optionally insert the result into a
Chainscript.

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

### Pipe the output to chainscript

```bash
$ cshashpdf document.pdf --
```

Output:

```json
{
	"body": {
		"content": {
			"hash": "QmQ2DaCoAfGDMLqE2PT1qP7FzZhxqXwzuB8N2Q19na6eSM"
		},
		"x_meta": {
			"uuid": "chainscript:envelope:0b544fdf-bdc4-4b8a-ad30-3e9830d03508",
			"content_digest": "894c55a524cdc3bb8709d0eff34b6434813a2ffb"
		}
	},
	"x_chainscript": {
		"validation": {
			"agent": "io.chainscript.agent",
			"version": "0.1.alpha",
			"result": "valid",
			"validated_on": "2015-09-22T14:23:18+00:00",
			"message": "Envelope was executed without a command."
		},
		"hash": "a99f24c2ecb7e5ec520eab3e7a4c5ea8eecf3fab"
	}
}
```

### Pipe the output to chainscript, sign, and notarize it

```bash
$ cshashpdf document.pdf -- -n -S KyprE5rcL4fSPmcQjbEE5UAv4nf2y3UErnGZizxhP9dDwp1ANRj9
```

Output:

```json
{
	"body": {
		"content": {
			"hash": "QmX9gpK67Rx4PHFkpTxo2FFPyfaGmQnJCVZhCRSm8jC9Ei"
		},
		"x_meta": {
			"uuid": "chainscript:envelope:a138f468-4c2a-4682-9e39-e9cf2a65a48a",
			"content_digest": "de40f999be08529d79b01a66c7a44a4405bea93b",
			"signatures": {
				"1gYwsscESuJssk2BvcriKumav2ZSn4gWY": {
					"digest": "de40f999be08529d79b01a66c7a44a4405bea93b",
					"signature": "H9wRCNf0L8wTGPGlpxp9vK3htlaZ672vBAq5kNijqIjlcmsAvGxLIyjKzPtfYrw+umNlR1B+m5M9regMsMWplBM="
				}
			},
			"revision": 1,
			"previous_hash": "d5acc74288ebf6074a12bd39e3f404569cfd9c34"
		}
	},
	"x_chainscript": {
		"validation": {
			"agent": "io.chainscript.agent",
			"version": "0.1.alpha",
			"result": "success",
			"validated_on": "2015-09-22T14:24:44+00:00"
		},
		"hash": "04a1ae94ef9a5a7efd6cd16d2504674422aad244",
		"transactions": {
			"chainscript:testnet3:tx:ab19b417c5c55eb49e7efff7623dbf17d2362862ccbefe1abf38e125d8a3ec57": {
				"status": "broadcasted",
				"op_return": "04a1ae94ef9a5a7efd6cd16d2504674422aad244",
				"blockchain": "testnet3",
				"reference": "chainscript:notarization:723e1c3e-d3f5-4473-84a6-159a0f311855",
				"broadcasted_on": "2015-09-22T14:24:44+00:00"
			}
		},
		"notarizations": {
			"chainscript:notarization:723e1c3e-d3f5-4473-84a6-159a0f311855": {
				"hash": "04a1ae94ef9a5a7efd6cd16d2504674422aad244",
				"evidence": "chainscript:testnet3:tx:ab19b417c5c55eb49e7efff7623dbf17d2362862ccbefe1abf38e125d8a3ec57",
				"notarized_at": "2015-09-22T14:24:44+00:00"
			}
		},
		"notarized": true
	}
}
```
