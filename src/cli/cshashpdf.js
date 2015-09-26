import path from 'path';
import { execFileSync } from 'child_process';
import commander from 'commander';
import readPackageSync from '../utils/readPackageSync';
import hashPDF from '../utils/hashPDF';

const args = [];
let chainscriptArgs = [];
let execChainscript = false;

process.argv.forEach(arg => {
  if (arg === '--') {
    execChainscript = true;
    return;
  }

  if (execChainscript) {
    chainscriptArgs.push(arg);
  } else {
    args.push(arg);
  }
});

commander
  .version(readPackageSync('version'))
  .usage('[options] input [-- chainscript args]')
  .option('-a, --algorithm <name>', 'hash algorithm (default sha256)')
  .option('-r, --root <path>', 'JSON root path (default content.hash)')
  .parse(args);

if (commander.args.length !== 1) {
  commander.outputHelp();
  process.exit(1);
}

function handleOutput(output) {
  const str = JSON.stringify(output, null, '\t') + '\n';
  process.stdout.write(str, () => process.exit(0));
}

function handleError(err) {
  process.stderr.write(err.message + '\n', () => process.exit(1));
}

hashPDF(
  path.resolve(process.cwd(), commander.args[0]),
  commander.algorithm,
  commander.root
)
  .then(json => {
    if (execChainscript) {
      let hasAt = false;

      chainscriptArgs = chainscriptArgs.map(arg => {
        if (arg === '@') {
          hasAt = true;
          return JSON.stringify(json);
        }

        return arg;
      });

      try {
        execFileSync(
          path.resolve(__dirname, '../../bin/chainscript'),
          chainscriptArgs,
          {
            input: hasAt ? null : JSON.stringify(json),
            stdio: [
              hasAt ? process.stdin : 'pipe',
              process.stdout,
              process.stderr
            ]
          }
        );
      } catch (err) {
        handleError(err);
      }

      return;
    }

    handleOutput(json);
  })
  .catch(handleError);
