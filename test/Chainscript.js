import Chainscript from '../src/Chainscript';

describe('Chainscript', () => {

  let script;

  describe('#toJSON()', () => {

    beforeEach(() => {
      script = new Chainscript({document: {content: {name: 'Hello World'}}});
    });

    it('should return the script as JSON', () => {
      script.toJSON().should.deepEqual(
        {document: {content: {name: 'Hello World'}}}
      );
    });

  });

  describe('#clone()', () => {

    beforeEach(() => {
      script = new Chainscript({document: {content: {name: 'Hello World'}}});
    });

    it('should clone the script', () => {
      script.clone().toJSON().should.deepEqual(script.toJSON());
    });

  });

  describe('#get()', () => {

    beforeEach(() => {
      script = new Chainscript({document: {content: {name: 'Hello World'}}});
    });

    it('should return the value if the path exists', () => {
      script.get('document.content.name').should.be.exactly('Hello World');
    });

    it('should return undefined if the path does not exist', () => {
      (script.get('document.content.time') === undefined)
        .should.be.exactly(true);
    });

  });

  describe('#snapshot()', () => {

    beforeEach(() => {
      script = new Chainscript({document: {content: {name: 'Hello World'}}})
        .snapshot();
    });

    it('should add a snapshot command', () => {
      script.get('execute.0').should.deepEqual({snapshot: {}});
    });

  });

  describe('#update()', () => {

    beforeEach(() => {
      script = new Chainscript({document: {content: {name: 'Hello World'}}})
        .update({name: 'Hey!'});
    });

    it('should add an update command', () => {
      script.get('execute.0').should.deepEqual({update: {name: 'Hey!'}});
    });

  });

  describe('#notarize()', () => {

    beforeEach(() => {
      script = new Chainscript({document: {content: {name: 'Hello World'}}})
        .notarize();
    });

    it('should add a notarize command', () => {
      script.get('execute.0').should.deepEqual({notarize: {}});
    });

  });

  describe('#email()', () => {

    beforeEach(() => {
      script = new Chainscript({document: {content: {name: 'Hello World'}}})
        .email('test@example.com');
    });

    it('should add a email command', () => {
      script.get('execute.0')
        .should.deepEqual({send_email: {to: 'test@example.com'}});
    });

  });

  describe('#change()', () => {

    beforeEach(() => {
      script = new Chainscript({
        document: {
          content: {
            name: 'Hello World',
            data: {
              test: true
            }
          }
        }
      });
    });

    it('should be able get a root key', () => {
      script.change(get => {
        get('name').should.be.exactly('Hello World');
      });
    });

    it('should be able get a nested key', () => {
      script.change(get => {
        get('data.test').should.be.exactly(true);
      });
    });

    it('should be able get an undefined root key', () => {
      script.change(get => {
        (get('author') === undefined).should.be.exactly(true);
      });
    });

    it('should be able get an undefined nested key', () => {
      script.change(get => {
        (get('lol.author') === undefined).should.be.exactly(true);
      });
    });

    it('should be able to add a root key', () => {
      script
        .change((get, set) => set('date', 'today'))
        .get('execute.0')
        .should.deepEqual({update: {date: 'today'}});
    });

    it('should be able to add a nested key', () => {
      script
        .change((get, set) => set('meta.date', 'today'))
        .get('execute.0')
        .should.deepEqual({update: {meta: {date: 'today'}}});
    });

    it('should be able get a key after it is changed', () => {
      script.change((get, set) => {
        set('data.test', false);
        get('data.test').should.be.exactly(false);
      });
    });

    it('should be able to remove a root key', () => {
      script
        .change((get, set, remove) => remove('data'))
        .get('execute.0')
        .should.deepEqual({update: {data: null}});
    });

    it('should be able to remove a nested key', () => {
      script
        .change((get, set, remove) => remove('data.test'))
        .get('execute.0')
        .should.deepEqual({update: {data: {test: null}}});
    });

    it('should handle the case of removing an unsaved value', () => {
      script
        .change((get, set, remove) => {
          set('data.new', true);
          remove('data.new');
        })
        .get('execute.0')
        .should.deepEqual({update: {}});
    });

  });

});
