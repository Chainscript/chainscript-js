import commander from 'commander';
import objectPath from 'object-path';
import Bitcore from 'bitcore';
import mergeDeep from 'merge-deep';
import readPackageSync from '../utils/readPackageSync';
import Chainscript from '..';

function collectUpdates(val, memo) {
  memo.push(val);
  return memo;
}

function collectUpdateKeys(val, memo) {
  memo.push(val);
  return memo;
}

function parseBool(v) {
  return v === 'true' || v === '1' ? true : false;
}

commander
  .version(readPackageSync('version'))
  .usage('[options] [script | uuid]')
  .option('-u, --update <updates>', 'Update script', collectUpdates, [])
  .option(
    '-U, --update-key <key:value>',
    'Update specific content key',
    collectUpdateKeys, []
  )
  .option('-s, --snapshot', 'Snapshot script')
  .option('-n, --notarize', 'Notarize script')
  .option('-e, --email <address>', 'Email')
  .option('--subject <subject>', 'Email subject')
  .option('-g, --get <path>', 'Output value at path')
  .option('-S, --sign <wif>', 'Sign the digest')
  .option(
    '--command-auditing <bool>',
    'Enable or disable command auditing',
    parseBool
  )
  .option(
    '--revision-auditing <bool>',
    'Enable or disable revision auditing',
    parseBool
  )
  .option('-K, --gen-key', 'Generate and print a key pair and address')
  .option('-T, --testnet', 'Use testnet')
  .option(
    '--execute-url <url>',
    'Set execute url'
  )
  .option(
    '--snapshots-url <url>',
    'Set snapshots url'
  )
  .parse(process.argv);

function handleOutput(o) {
  const output = commander.get ? objectPath.get(output, commander.get) : o;
  let str;

  if (typeof output === 'object' && output) {
    str = JSON.stringify(output, null, '\t') + '\n';
  } else {
    str = output + '\n';
  }

  process.stdout.write(str, () => process.exit(0));
}

function handleError(err) {
  process.stderr.write(err.message + '\n', () => process.exit(1));
}

function stage0(cs) {
  if (typeof cs.get('x_chainscript') === 'undefined') {
    return cs.run();
  }

  return Promise.resolve(cs);
}

function stage1(cs) {
  let s = cs;

  if (typeof commander.commandAuditing !== 'undefined') {
    s = s.set('x_chainscript.command_auditing', commander.commandAuditing);
  }

  if (typeof commander.revisionAuditing !== 'undefined') {
    s = s.set('x_chainscript.revision_auditing', commander.revisionAuditing);
  }

  if (commander.update.length > 0 || commander.updateKey.length > 0) {
    let updates;

    commander.update.forEach(u => {
      let update;

      try {
        update = JSON.parse(u);
      } catch (e) {
        update = u;
      }

      if (typeof updates === 'object' && updates &&
          typeof update === 'object' && update) {
        updates = mergeDeep(updates, update);
      } else {
        updates = update;
      }
    });

    commander.updateKey.forEach(update => {
      const parts = update.split(':');
      const key = parts[0];
      const raw = parts.slice(1).join(':');
      const value = {};

      try {
        objectPath.set(value, key, JSON.parse(raw));
      } catch (e) {
        objectPath.set(value, key, raw);
      }

      updates = mergeDeep(updates, value);
    });

    return s.update(updates).run();
  }

  return Promise.resolve(s);
}

function stage2(cs) {
  let s = cs;

  if (commander.sign) {
    s = s.sign(commander.sign);
  }

  if (commander.snapshot) {
    s = s.snapshot();
  }

  if (commander.notarize) {
    s = s.notarize();
  }

  if (commander.email) {
    s = s.email(commander.email, commander.subject);
  }

  return s.run();
}

function run(cs) {
  if (typeof commander.executeUrl !== 'undefined') {
    Chainscript.EXECUTE_URL = commander.executeUrl;
  }

  if (typeof commander.snapshotsUrl !== 'undefined') {
    Chainscript.SNAPSHOTS_URL = commander.snapshotsUrl;
  }

  stage0(cs)
    .then(stage1)
    .then(stage2)
    .then(s => handleOutput(s.toJSON()))
    .catch(handleError);
}

function handleInput(input) {
  if (input.match(/^chainscript:/)) {
    Chainscript.load(input, true).then(run).catch(handleError);
  } else {
    let json;

    try {
      json = JSON.parse(input);
    } catch (e) {
      json = {content: input};
    }

    run(new Chainscript(json, true));
  }
}

if (commander.genKey) {
  const privateKey = new Bitcore.PrivateKey();
  const publicKey = privateKey.toPublicKey();
  let address;

  if (commander.testnet) {
    address = publicKey.toAddress(Bitcore.Networks.testnet);
  } else {
    address = publicKey.toAddress(Bitcore.Networks.livenet);
  }

  handleOutput({
    private: privateKey.toWIF(),
    public: publicKey.toString(),
    address: address.toString()
  });
}

if (commander.args.length > 1) {
  commander.outputHelp();
  process.exit(1);
}

if (commander.args.length === 0) {
  process.stdin.setEncoding('utf8');

  let input = '';

  process.stdin.on('readable', () => {
    const chunk = process.stdin.read();

    if (chunk !== null) {
      input += chunk.toString();
    }
  });

  process.stdin.on('end', () => {
    input = input.replace(/\n$/, '');

    if (input.length) {
      handleInput(input);
    } else {
      commander.outputHelp();
      process.exit(1);
    }
  });
} else {
  handleInput(commander.args[0]);
}
