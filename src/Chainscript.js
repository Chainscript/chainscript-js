import request from 'superagent';
import Q from 'q';
import objectPath from 'object-path';
import deepMerge from 'deepmerge';

const EXECUTE_URL = 'http://agent.chainscript.io/execute';
const SNAPSHOTS_URL = 'https://chainscript.firebaseio.com/snapshots/';

export default class Chainscript {

  /**
   * Loads a script from an existing uuid
   *
   * @param {String} uuid The uuid of the script
   * @returns {Promise} A promise that resolves with a new Chainscript
   */
  static load = uuid => {
    const deferred = Q.defer();

    request
      .get(SNAPSHOTS_URL + 'chainscript-document-' + uuid + '.json')
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) {
          return deferred.reject(err);
        }

        if (!res.ok) {
          return deferred.reject(new Error(res.text));
        }

        deferred.resolve(new Chainscript(res.body));
      });

    return deferred.promise;
  };

  /**
   * Construct a new chainscript.
   *
   * @param {Object | string} [document={}] The initial script
   */
  constructor(script = {}) {
    // Clone the script for safety
    this.script = JSON.parse(JSON.stringify(script));
    this.numCommands = 0;

    if (typeof script.execute !== 'undefined') {
      for (const s in script.execute) {
        if (script.execute.hasOwnProperty(s)) {
          this.numCommands++;
        }
      }
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
    return new Chainscript(this.script);
  }

  /**
   * Run the script.
   *
   * @returns {Promise} A promise that resolves with a new Chainscript
   */
  run() {
    const deferred = Q.defer();

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

        deferred.resolve(new Chainscript(res.body));
      });

    return deferred.promise;
  }

  addCommand(command) {
    const script = JSON.parse(JSON.stringify(this.script));

    script.execute = script.execute || {};
    script.execute[this.numCommands] = command;

    return new Chainscript(script);
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
   * Adds an update command to change a document value at specified path.
   *
   * @param {string} fn A function that changes the document
   * @returns {Chainscript} A new instance of Chainscript
   */
  change(fn) {
    const content = this.get('document.content');
    const updates = {};

    function get(path) {
      const contentValue = objectPath.get(content, path);
      const updatesValue = objectPath.get(updates, path);

      if (typeof contentValue === 'object' &&
          typeof updatesValue === 'object') {
        return deepMerge(contentValue, updatesValue);
      }

      if (typeof updatesValue === 'undefined') {
        if (typeof contentValue !== 'undefined') {
          return JSON.parse(JSON.stringify(contentValue));
        }

        return undefined;
      }

      return JSON.parse(JSON.stringify(updatesValue));
    }

    function set(path, value) {
      objectPath.set(updates, path, value);
    }

    fn(get, set);

    for (const s in updates) {
      if (updates.hasOwnProperty(s)) {
        const contentValue = content[s];
        const updatesValue = updates[s];

        if (typeof contentValue === 'object' &&
            typeof updatesValue === 'object') {
          updates[s] = deepMerge(contentValue, updatesValue);
        }
      }
    }

    return this.update(updates);
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

}
