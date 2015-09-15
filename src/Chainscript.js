import request from 'request';

const EXECUTE_URL = 'http://agent.chainscript.io/execute';
const SNAPSHOTS_URL = 'https://chainscript.firebaseio.com/snapshots/';

export default class Chainscript {

  static load = (uuid, cb) => {
    request.get(
      SNAPSHOTS_URL + uuid + '.json',
      {json: true},
      (err, resp, body) => {
        console.log(body, SNAPSHOTS_URL + uuid + '.json');
        if (err) {
          cb && cb(err);
          return;
        }

        if (resp.statusCode >= 400) {
          cb && cb(new Error('Unexpected status: ' + resp.statusCode));
          return;
        }

        cb && cb(null, new Chainscript(body));
      }
    );

    return Chainscript;
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
   */
  run(cb) {
    request.post(
      EXECUTE_URL,
      {
        body: this.script,
        json: true
      },
      (err, resp, body) => {
        if (err) {
          cb && cb(err);
          return;
        }

        if (resp.statusCode >= 400) {
          cb && cb(new Error('Unexpected status: ' + resp.statusCode));
          return;
        }

        cb(null, new Chainscript(body));
      }
    );

    return this;
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
