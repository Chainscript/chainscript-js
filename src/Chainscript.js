import request from 'request';

const EXECUTE_URL = 'http://agent.chainscript.io/execute';

export default class Chainscript {

  /**
   * Construct a new chainscript.
   *
   * @param {Object} [document={}] The initial document
   */
  constructor(document) {
    this.script = {document};
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
          delete this.script.execute;
          this.script.numCommands = 0;
          cb && cb(err, this);
          return;
        }

        if (resp.statusCode >= 400) {
          delete this.script.execute;
          this.script.numCommands = 0;
          cb && cb(new Error('Unexpected status: ' + resp.statusCode), this);
          return;
        }

        this.script = body;

        cb(null, this);
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
