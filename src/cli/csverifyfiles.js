import path from 'path';
import { execFileSync } from 'child_process';
import commander from 'commander';
import readPackageSync from '../utils/readPackageSync';
import verifyFiles from '../utils/verifyFiles';

const args = [];
const chainscriptArgs = [];
let execChainscript = false;
let script;

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

function handleError(err) {
  process.stderr.write(err.message + '\n', () => process.exit(1));
}

function handleInput(input) {
  try {
    const json = JSON.parse(input);
    verifyFiles(process.cwd(), json, commander.root)
      .then(() => {
        process.stdout.write('Success\n');
        process.exit(0);
      })
      .catch(handleError);
  } catch (err) {
    handleError(err);
  }
}

if (execChainscript) {
  try {
    script = execFileSync(
      path.resolve(__dirname, '../../bin/chainscript'),
      chainscriptArgs,
      {
        stdio: [process.stdin, null, process.stderr],
        encoding: 'utf8'
      }
    );
  } catch (err) {
    handleError(err);
  }
}

commander
  .version(readPackageSync('version'))
  .usage('[options] [hashes] [-- chainscript args]')
  .option('-r, --root <path>', 'JSON root path')
  .parse(args);

if (script) {
  if (commander.args.length > 0) {
    commander.outputHelp();
    process.exit(1);
  }

  handleInput(script);
} else if (commander.args.length === 0) {
  script = '';

  process.stdin.setEncoding('utf8');

  process.stdin.on('readable', () => {
    const chunk = process.stdin.read();

    if (chunk !== null) {
      script += chunk.toString();
    }
  });

  process.stdin.on('end', () => {
    script = script.replace(/\n$/, '');

    if (script.length) {
      handleInput(script);
    } else {
      commander.outputHelp();
      process.exit(1);
    }
  });
} else {
  handleInput(commander.args[0]);
}
