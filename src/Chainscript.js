import request from 'superagent';
import objectPath from 'object-path';
import { PrivateKey } from 'bitcore';
import Message from 'bitcore-message';
import clone from './utils/clone';
import deepEquals from './utils/deepEquals';
import promisify from './utils/promisify';

export default class Chainscript {

  static EXECUTE_URL = 'http://agent.chainscript.io/execute';
  static SNAPSHOTS_URL = 'https://chainscript.firebaseio.com/snapshots/';

  /**
   * Loads a script from an existing uuid
   *
   * @param {string} uuid The uuid of the script
   * @param {bool} [immutable=false] Whether to create an immutable instance
   * @returns {Promise} A promise that resolves with a new Chainscript
   */
  static load = (uuid, immutable = false) => {
    const req = request
      .get(Chainscript.SNAPSHOTS_URL + uuid.replace(/:/g, '-') + '.json')
      .set('Accept', 'application/json');

    return promisify(req.end.bind(req))()
      .then(res => {
        if (!res.ok) {
          throw new Error(res.text);
        }

        return new Chainscript(clone(res.body), immutable);
      });
  };

  /**
   * Construct a new chainscript.
   *
   * @param {Object | string} [script={}] The initial script
   * @param {bool} [immutable=false] Whether to create an immutable instance
   */
  constructor(script = {}, immutable = false) {
    // Clone the script for safety
    this.script = clone(script);
    this.immutable = immutable;

    if (!immutable) {
      this.initial = clone(script);
    }
  }

  /**
   * Returns the script as JSON.
   *
   * @returns {Object} JSON representation of the script
   */
  toJSON() {
    // Clone the script for safety
    return clone(this.script);
  }

  /**
   * Clones the script.
   *
   * @returns {Chainscript} A clone of the script
   */
  clone() {
    const copy = new Chainscript(this.script, this.immutable);

    if (!this.immutable) {
      copy.initial = clone(this.initial);
    }

    return copy;
  }

  /**
   * Run the script.
   *
   * @returns {Promise} A promise that resolves with a new Chainscript
   */
  run() {
    if (!this.immutable) {
      const initialContent = objectPath.get(this.initial, 'body.content');
      const currentContent = objectPath.get(this.script, 'body.content');

      if (!deepEquals(initialContent, currentContent)) {
        this.script.body = this.script.body || {};
        this.script.body.content = initialContent;
        this.delta(currentContent, true);
      }
    }

    const req = request
      .post(Chainscript.EXECUTE_URL)
      .send(this.script)
      .set('Accept', 'application/json');

    return promisify(req.end.bind(req))()
      .then(res => {
        if (!res.ok) {
          throw new Error(res.text);
        }

        if (this.immutable) {
          return new Chainscript(res.body, true);
        }

        this.script = res.body;
        this.initial = clone(this.script);

        return this;
      });
  }

  /**
   * Returns the value at specified path.
   */
  get(path) {
    const value = objectPath.get(this.script, path);

    if (typeof value === 'undefined') {
      return undefined;
    }

    if (this.immutable) {
      return clone(value);
    }

    return value;
  }

  /**
   * Sets the value at specified path.
   *
   * @param {string} path The path of the key to set
   * @param {any} value The value
   * @returns {Chainscript} A new instance of Chainscript
   */
  set(path, value) {
    let script;

    if (this.immutable) {
      script = clone(this.script);
    } else {
      script = this.script;
    }

    objectPath.set(script, path, value);

    if (this.immutable) {
      return new Chainscript(script, true);
    }

    return this;
  }

  /**
   * Adds a snapshot command
   *
   * @returns {Chainscript} A new instance of Chainscript
   */
  snapshot() {
    return this
      .set('x_chainscript.snapshots_enabled', true)
      .addCommand({snapshot: {}});
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
   * @param {string} [subject] Subject
   * @returns {Chainscript} A new instance of Chainscript
   */
  email(to, subject) {
    if (subject) {
      return this.addCommand({send_email: {to, subject}});
    }

    return this.addCommand({send_email: {to}});
  }

  /**
   * Adds an update command to change the content at specified path.
   *
   * @param {function} fn A function that changes the content
   * @returns {Chainscript} A new instance of Chainscript
   */
  change(fn) {
    const next = clone(this.get('body.content'));

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

    if (typeof prev === 'object' && prev && typeof next === 'object' && next) {
      Object.keys(prev).forEach(s => {
        if (typeof next[s] === 'undefined') {
          next[s] = null;
        } else if (deepEquals(prev[s], next[s])) {
          delete next[s];
        }
      });
    }

    return this.update(next, first);
  }

  /**
   * Adds a sign content command.
   *
   * @param {string} wif A private key in WIF format
   * @returns {Chainscript} A new instance of Chainscript
   */
  sign(wif) {
    const digest = objectPath.get(this.script, 'body.x_meta.content_digest');

    if (typeof digest === 'undefined') {
      throw new Error('Content has no digest');
    }

    const privateKey = PrivateKey.fromWIF(wif);
    const address = privateKey.toPublicKey().toAddress().toString();
    const message = new Message(digest);
    const signature = message.sign(privateKey);

    return this.addCommand({sign_content: {[address]: {digest, signature}}});
  }

  getNumCommands() {
    if (typeof this.script.execute === 'undefined') {
      return 0;
    }

    return Object.keys(this.script.execute).length;
  }

  addCommand(command, first = false) {
    const index = first ? 0 : this.getNumCommands();
    let script;

    if (this.immutable) {
      script = clone(this.script);
    } else {
      script = this.script;
    }

    script.execute = script.execute || {};

    if (first) {
      const tmp = {};

      Object.keys(script.execute).forEach(s => {
        tmp[parseInt(s, 10) + 1] = script.execute[s];
      });

      script.execute = tmp;
    }

    script.execute[index] = command;

    if (this.immutable) {
      return new Chainscript(script, true);
    }

    return this;
  }

}
