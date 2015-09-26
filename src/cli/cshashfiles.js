import path from 'path';
import { execFileSync } from 'child_process';
import commander from 'commander';
import readPackageSync from '../utils/readPackageSync';
import hashFiles from '../utils/hashFiles';

let paths;
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
  .usage('[options] [path...] [-- chainscript args]')
  .option('-a, --algorithm <name>', 'hash algorithm (default sha256)')
  .option('-r, --root <path>', 'JSON root path')
  .parse(args);

if (commander.args.length > 0) {
  paths = commander.args.map(p => path.resolve(process.cwd(), p));
} else {
  paths = [process.cwd()];
}

function handleOutput(output) {
  const str = JSON.stringify(output, null, '\t') + '\n';
  process.stdout.write(str, () => process.exit(0));
}

function handleError(err) {
  process.stderr.write(err.message + '\n', () => process.exit(1));
}

hashFiles(process.cwd(), paths, commander.algorithm, commander.root)
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
