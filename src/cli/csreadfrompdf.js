import path from 'path';
import commander from 'commander';
import readPackageSync from '../utils/readPackageSync';
import readFromPDF from '../utils/readFromPDF';

function handleOutput(output) {
  const str = JSON.stringify(output, null, '\t') + '\n';
  process.stdout.write(str, () => process.exit(0));
}

function handleError(err) {
  process.stderr.write(err.message + '\n', () => process.exit(1));
}

commander
  .version(readPackageSync('version'))
  .usage('[options] input')
  .parse(process.argv);

if (commander.args.length !== 1) {
  commander.outputHelp();
  process.exit(1);
}

try {
  readFromPDF(path.resolve(process.cwd(), commander.args[0]))
    .then(handleOutput)
    .catch(handleError);
} catch (err) {
  handleError(err);
}
