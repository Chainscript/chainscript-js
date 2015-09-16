import request from 'superagent';
import Q from 'q';
import objectPath from 'object-path';

const EXECUTE_URL = 'http://agent.chainscript.io/execute';
const SNAPSHOTS_URL = 'https://chainscript.firebaseio.com/snapshots/';

export default class Chainscript {

  /**
   * Loads a script from an existing uuid
   *
   * @param {string} uuid The uuid of the script
   * @param {bool} immutable Whether to create an immutable instance
   * @returns {Promise} A promise that resolves with a new Chainscript
   */
  static load = (uuid, immutable = true) => {
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

        deferred.resolve(new Chainscript(res.body, immutable));
      });

    return deferred.promise;
  };

  /**
   * Construct a new chainscript.
   *
   * @param {Object | string} [script={}] The initial script
   * @param {bool} [immutable=true] Whether to create an immutable instance
   */
  constructor(script = {}, immutable = true) {
    // Clone the script for safety
    this.script = JSON.parse(JSON.stringify(script));
    this.immutable = immutable;
    this.numCommands = 0;

    if (typeof script.execute !== 'undefined') {
      for (const s in script.execute) {
        if (script.execute.hasOwnProperty(s)) {
          this.numCommands++;
        }
      }
    }

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
        this.delta(currentContent, initialContent);
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
          deferred.resolve(new Chainscript(res.body));
        } else {
          this.script = res.body;
          this.initial = JSON.parse(JSON.stringify(this.script));
          this.numCommands = 0;
          deferred.resolve(this);
        }
      });

    return deferred.promise;
  }

  addCommand(command) {
    if (this.immutable) {
      const script = JSON.parse(JSON.stringify(this.script));

      script.execute = script.execute || {};
      script.execute[this.numCommands] = command;

      return new Chainscript(script);
    }

    this.script.execute = this.script.execute || {};
    this.script.execute[this.numCommands] = command;
    this.numCommands++;

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
   * @returns {Chainscript} A new instance of Chainscript
   */
  update(updates) {
    return this.addCommand({update: updates});
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
   * @returns {Chainscript} A new instance of Chainscript
   */
  delta(next, from) {
    const prev = from || this.get('body.content');

    for (const s in prev) {
      if (prev.hasOwnProperty(s)) {
        if (typeof next[s] === 'undefined') {
          next[s] = null;
        } else if (JSON.stringify(prev[s]) === JSON.stringify(next[s])) {
          delete next[s];
        }
      }
    }

    return this.update(next);
  }

}
