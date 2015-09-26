import path from 'path';
import commander from 'commander';
import readPackageSync from '../utils/readPackageSync';
import writeToPDF from '../utils/writeToPDF';

let script;

function handleError(err) {
  process.stderr.write(err.message + '\n', () => process.exit(1));
}

function handleInput(input) {
  try {
    const json = JSON.parse(input);

    writeToPDF(
      path.resolve(process.cwd(), commander.args[0]),
      path.resolve(process.cwd(), commander.args[1]),
      json
    )
      .then(() => process.exit(0))
      .catch(handleError);
  } catch (err) {
    handleError(err);
  }
}

commander
  .version(readPackageSync('version'))
  .usage('[options] input output [json]')
  .parse(process.argv);

if (commander.args.length < 2 || commander.args.length > 3) {
  commander.outputHelp();
  process.exit(1);
}

if (commander.args.length === 2) {
  process.stdin.setEncoding('utf8');

  script = '';

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
  handleInput(commander.args[2]);
}
