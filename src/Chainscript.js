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
    request.post(EXECUTE_URL, {body: this.script, json: true}, (err, resp, body) => {
      if (err) {
        cb && cb(err, this);
        return;
      }

      if (resp.statusCode >= 400) {
        cb && cb(new Error('Unexpected status: ' + resp.statusCode), this);
        return;
      }

      this.script = body;

      cb(null, this);
    });
  }

}
