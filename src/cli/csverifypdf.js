import path from 'path';
import commander from 'commander';
import readPackageSync from '../utils/readPackageSync';
import verifyPDF from '../utils/verifyPDF';

function handleError(err) {
  process.stderr.write(err.message + '\n', () => process.exit(1));
}

commander
  .version(readPackageSync('version'))
  .usage('[options] input')
  .option('-r, --root <path>', 'JSON root path (default body.content.hash)')
  .parse(process.argv);

if (commander.args.length !== 1) {
  commander.outputHelp();
  process.exit(1);
}

verifyPDF(path.resolve(process.cwd(), commander.args[0]), commander.root)
  .then(() => {
    process.stdout.write('Success\n');
    process.exit(0);
  })
  .catch(handleError);
