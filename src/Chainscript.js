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
   * @param {int} [numCommands={}] Private
   */
  constructor(script = {}, numCommands = 0) {
    // Clone the script for safety
    this.script = JSON.parse(JSON.stringify(script));
    this.numCommands = numCommands;
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
    return new Chainscript(this.script, this.numCommands);
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
    const script = JSON.parse(JSON.stringify(this.script));
    const numCommands = this.numCommands;
    script.execute = script.execute || {};
    script.execute[numCommands] = command;

    return new Chainscript(script, numCommands + 1);
  }

  /**
   * Adds a snapshot command
   */
  snapshot() {
    return this.addCommand({snapshot: {}});
  }

  /**
   * Adds a notarize command
   */
  notarize() {
    return this.addCommand({notarize: {}});
  }

  /**
   * Adds a send email command
   */
  email(to) {
    return this.addCommand({send_email: {to}});
  }

}
