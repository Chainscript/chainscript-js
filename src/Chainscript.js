import request from 'superagent';
import Q from 'q';
import objectPath from 'object-path';
import { PrivateKey } from 'bitcore';
import Message from 'bitcore-message';

const EXECUTE_URL = 'http://agent.chainscript.io/execute';
const SNAPSHOTS_URL = 'https://chainscript.firebaseio.com/snapshots/';

export default class Chainscript {

  /**
   * Loads a script from an existing uuid
   *
   * @param {string} uuid The uuid of the script
   * @param {bool} [immutable=false] Whether to create an immutable instance
   * @returns {Promise} A promise that resolves with a new Chainscript
   */
  static load = (uuid, immutable = false) => {
    const deferred = Q.defer();

    request
      .get(SNAPSHOTS_URL + uuid.replace(/:/g, '-') + '.json')
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) {
          return deferred.reject(err);
        }

        if (!res.ok) {
          return deferred.reject(new Error(res.text));
        }

        deferred.resolve(new Chainscript(
          JSON.parse(JSON.stringify(res.body)),
          immutable
        ));
      });

    return deferred.promise;
  };

  /**
   * Construct a new chainscript.
   *
   * @param {Object | string} [script={}] The initial script
   * @param {bool} [immutable=false] Whether to create an immutable instance
   */
  constructor(script = {}, immutable = false) {
    // Clone the script for safety
    this.script = JSON.parse(JSON.stringify(script));
    this.immutable = immutable;

    if (!immutable) {
      this.initial = JSON.parse(JSON.stringify(script));
    }
  }

  /**
   * Returns the script as JSON.
   *
   * @returns {Object} JSON representation of the script
   */
  toJSON() {
    // Clone the script for safety
    return JSON.parse(JSON.stringify(this.script));
  }

  /**
   * Clones the script.
   *
   * @returns {Chainscript} A clone of the script
   */
  clone() {
    const clone = new Chainscript(this.script, this.immutable);

    if (!this.immutable) {
      clone.initial = JSON.parse(JSON.stringify(this.initial));
    }

    return clone;
  }

  /**
   * Run the script.
   *
   * @returns {Promise} A promise that resolves with a new Chainscript
   */
  run() {
    const deferred = Q.defer();

    if (!this.immutable) {
      const initialContent = objectPath.get(this.initial, 'body.content', {});
      const currentContent = objectPath.get(this.script, 'body.content', {});
      if (JSON.stringify(initialContent) !== JSON.stringify(currentContent)) {
        this.script.body = this.script.body || {};
        this.script.body.content = initialContent;
        this.delta(currentContent, true);
      }
    }

    request
      .post(EXECUTE_URL)
      .send(this.script)
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) {
          return deferred.reject(err);
        }

        if (!res.ok) {
          return deferred.reject(new Error(res.text));
        }

        if (this.immutable) {
          deferred.resolve(new Chainscript(res.body, true));
        } else {
          this.script = res.body;
          this.initial = JSON.parse(JSON.stringify(this.script));
          deferred.resolve(this);
        }
      });

    return deferred.promise;
  }

  addCommand(command, first = false) {
    const index = first ? 0 : this.getNumCommands();
    let script;

    if (this.immutable) {
      script = JSON.parse(JSON.stringify(this.script));
    } else {
      script = this.script;
    }

    script.execute = script.execute || {};

    if (first) {
      const tmp = {};

      for (const s in script.execute) {
        if (script.execute.hasOwnProperty(s)) {
          tmp[parseInt(s, 10) + 1] = script.execute[s];
        }
      }

      script.execute = tmp;
    }

    script.execute[index] = command;

    if (this.immutable) {
      return new Chainscript(script, true);
    }

    return this;
  }

  /**
   * Returns the value at specified path.
   */
  get(path) {
    const value = objectPath.get(this.script, path);

    if (typeof value === 'undefined') {
      return undefined;
    }

    return JSON.parse(JSON.stringify(value));
  }

  /**
   * Adds a snapshot command
   *
   * @returns {Chainscript} A new instance of Chainscript
   */
  snapshot() {
    return this.addCommand({snapshot: {}});
  }

  /**
   * Adds an update command
   *
   * @param {Object} updates An object with updates to apply
   * @param {bool} [first=false] Whether to put the command first
   * @returns {Chainscript} A new instance of Chainscript
   */
  update(updates, first = false) {
    return this.addCommand({update: updates}, first);
  }

  /**
   * Adds a notarize command
   *
   * @returns {Chainscript} A new instance of Chainscript
   */
  notarize() {
    return this.addCommand({notarize: {}});
  }

  /**
   * Adds a send email command
   *
   * @param {string} to Destination email address
   * @returns {Chainscript} A new instance of Chainscript
   */
  email(to) {
    return this.addCommand({send_email: {to}});
  }

  /**
   * Adds an update command to change the content at specified path.
   *
   * @param {function} fn A function that changes the content
   * @returns {Chainscript} A new instance of Chainscript
   */
  change(fn) {
    const next = this.get('body.content');

    fn(next);

    return this.delta(next);
  }

  /**
   * Adds an update command to change the content to the given content.
   *
   * @param {Object} next The new content
   * @param {bool} [first=false] Whether to put the command first
   * @returns {Chainscript} A new instance of Chainscript
   */
  delta(next, first = false) {
    const prev = this.get('body.content');

    for (const s in prev) {
      if (prev.hasOwnProperty(s)) {
        if (typeof next[s] === 'undefined') {
          next[s] = null;
        } else if (JSON.stringify(prev[s]) === JSON.stringify(next[s])) {
          delete next[s];
        }
      }
    }

    return this.update(next, first);
  }

  /**
   * Signs the digest.
   *
   * @param {string} wif A private key in WIF format
   * @returns {Chainscript} A new instance of Chainscript
   */
  sign(wif) {
    if (typeof this.script.x_chainscript === 'undefined' ||
        typeof this.script.x_chainscript.digest === 'undefined') {
      throw new Error('Script has no digest');
    }

    const digest = this.script.x_chainscript.digest;
    const privateKey = PrivateKey.fromWIF(wif);
    const address = privateKey.toPublicKey().toAddress().toString();
    const message = new Message(digest);
    const signature = message.sign(privateKey);

    let script;

    if (this.immutable) {
      script = JSON.parse(JSON.stringify(this.script));
    } else {
      script = this.script;
    }

    const xChainscript = script.x_chainscript;
    xChainscript.signatures = xChainscript.signatures || {};
    xChainscript.signatures[address] = {digest, signature};

    if (this.immutable) {
      return new Chainscript(script, true);
    }

    return this;
  }

  getNumCommands() {
    let numCommands = 0;

    if (typeof this.script.execute !== 'undefined') {
      for (const s in this.script.execute) {
        if (this.script.execute.hasOwnProperty(s)) {
          numCommands++;
        }
      }
    }

    return numCommands;
  }

}
