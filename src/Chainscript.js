import request from 'request';
import Q from 'q';

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

    request.get(
      SNAPSHOTS_URL + 'chainscript-document-' + uuid + '.json',
      {json: true},
      (err, resp, body) => {
        if (err) {
          return deferred.reject(err);
        }

        if (resp.statusCode >= 400) {
          return deferred.reject(
            new Error('Unexpected status: ' + resp.statusCode)
          );
        }

        deferred.resolve(new Chainscript(body));
      }
    );

    return deferred.promise;
  };

  /**
   * Construct a new chainscript.
   *
   * @param {Object | string} [document={}] The initial script
   */
  constructor(script = {}) {
    this.script = script;
    this.numCommands = 0;
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
   * Run the script.
   *
   * @returns {Promise} A promise that resolves with a new Chainscript
   */
  run() {
    const deferred = Q.defer();

    request.post(
      EXECUTE_URL,
      {
        body: this.script,
        json: true
      },
      (err, resp, body) => {
        if (err) {
          return deferred.reject(err);
        }

        if (resp.statusCode >= 400) {
          return deferred.reject(
            new Error('Unexpected status: ' + resp.statusCode)
          );
        }

        deferred.resolve(new Chainscript(body));
      }
    );

    return deferred.promise;
  }

  addCommand(command) {
    this.script.execute = this.script.execute || {};
    this.script.execute[this.numCommands] = command;
    this.numCommands++;

    return this;
  }

  /**
   * Adds a snapshot command
   */
  snapshot() {
    return this.addCommand({snapshot: {}});
  }

  /**
   * Adds a send email command
   */
  email(to) {
    return this.addCommand({send_email: {to}});
  }

}
