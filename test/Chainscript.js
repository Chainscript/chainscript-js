import sinon from 'sinon';
import request from 'superagent';
import Chainscript from '../src/Chainscript';

const testResponse = {
  ok: true,
  body: {
    document: {
      content: {
        name: 'Hello World'
      },
      x_meta: {
        uuid: 'chainscript:document:1323e127-e659-4ab7-9f53-e82b6dbaf12d'
      }
    },
    x_chainscript: {
      validation: {
        agent: 'io.chainscript.agent',
        version: '0.1.alpha',
        result: 'success',
        validated_on: '2015-09-15T15:52:07+00:00'
      },
      digest: 'b0136c9923e72737a80c58d7aba140add16cdac4'
    }
  }
};

describe('Chainscript', () => {

  function tests(immutable) {

    let script;

    context('when immutable is ' + immutable, () => {

      describe('load()', () => {

        const methods = {
          set: sinon.spy(() => methods),
          end: sinon.spy(() => methods)
        };

        let afterEnd;

        beforeEach(() => {
          sinon.stub(request, 'get', () => methods);
          Chainscript
            .load('chainscript:document:1234', immutable)
            .then(s => afterEnd(s));
        });

        afterEach(() => {
          request.get.restore();
          methods.set.reset();
          methods.end.reset();
        });

        it('should do a get request', () => {
          request.get.calledOnce.should.be.exactly(true);
          request.get.firstCall.args[0]
            .should.be.exactly(
              'https://chainscript.firebaseio.com/snapshots/' +
              'chainscript-document-1234.json'
            );
        });

        it('should create a new script', (done) => {
          afterEnd = s => {
            s.toJSON().should.deepEqual(testResponse.body);
            done();
          };
          methods.end.calledOnce.should.be.exactly(true);
          methods.end.firstCall.args[0](null, testResponse);
        });

      });

      describe('#toJSON()', () => {

        beforeEach(() => {
          script = new Chainscript(
            {document: {content: {name: 'Hello World'}}},
            immutable
          );
        });

        it('should return the script as JSON', () => {
          script.toJSON().should.deepEqual(
            {document: {content: {name: 'Hello World'}}}
          );
        });

      });

      describe('#clone()', () => {

        beforeEach(() => {
          script = new Chainscript(
            {document: {content: {name: 'Hello World'}}},
            immutable
          );
        });

        it('should clone the script', () => {
          script.clone().toJSON().should.deepEqual(script.toJSON());
        });

      });

      describe('#run()', () => {

        const methods = {
          send: sinon.spy(() => methods),
          set: sinon.spy(() => methods),
          end: sinon.spy(() => methods)
        };

        let afterEnd;

        beforeEach(() => {
          sinon.stub(request, 'post', () => methods);
          new Chainscript(
            {document: {content: {name: 'Hello World'}}},
            immutable
          ) .snapshot()
            .run()
            .then(s => afterEnd(s));
        });

        afterEach(() => {
          request.post.restore();
          methods.send.reset();
          methods.set.reset();
          methods.end.reset();
        });

        it('should do a post request', () => {
          request.post.calledOnce.should.be.exactly(true);
          request.post.firstCall.args[0]
            .should.be.exactly('http://agent.chainscript.io/execute');
        });

        it('should send the script', () => {
          methods.send.calledOnce.should.be.exactly(true);
          methods.send.firstCall.args[0]
            .should.deepEqual({
              execute: {
                0: {snapshot: {}}
              },
              document: {
                content: {
                  name: 'Hello World'
                }
              }
            });
        });

        it('should create a new script', (done) => {
          afterEnd = s => {
            s.toJSON().should.deepEqual(testResponse.body);
            done();
          };
          methods.end.calledOnce.should.be.exactly(true);
          methods.end.firstCall.args[0](null, testResponse);
        });

      });

      describe('#get()', () => {

        beforeEach(() => {
          script = new Chainscript(
            {document: {content: {name: 'Hello World'}}},
            immutable
          );
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
          script = new Chainscript(
            {document: {content: {name: 'Hello World'}}},
            immutable
          )
            .snapshot();
        });

        it('should add a snapshot command', () => {
          script.get('execute.0').should.deepEqual({snapshot: {}});
        });

      });

      describe('#update()', () => {

        beforeEach(() => {
          script = new Chainscript(
            {document: {content: {name: 'Hello World'}}},
            immutable
          )
            .update({name: 'Hey!'});
        });

        it('should add an update command', () => {
          script.get('execute.0').should.deepEqual({update: {name: 'Hey!'}});
        });

      });

      describe('#notarize()', () => {

        beforeEach(() => {
          script = new Chainscript(
            {document: {content: {name: 'Hello World'}}},
            immutable
          )
            .notarize();
        });

        it('should add a notarize command', () => {
          script.get('execute.0').should.deepEqual({notarize: {}});
        });

      });

      describe('#email()', () => {

        beforeEach(() => {
          script = new Chainscript(
            {document: {content: {name: 'Hello World'}}},
            immutable
          )
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
          }, immutable);
        });


        it('should be able to add a root key', () => {
          script
            .change(doc => doc.date = 'today')
            .get('execute.0')
            .should.deepEqual({update: {date: 'today'}});
        });

        it('should be able to add a nested key', () => {
          script
            .change(doc => doc.meta = {date: 'today'})
            .get('execute.0')
            .should.deepEqual({update: {meta: {date: 'today'}}});
        });

        it('should be able to remove a root key', () => {
          script
            .change(doc => delete doc.data)
            .get('execute.0')
            .should.deepEqual({update: {data: null}});
        });

        it('should be able to remove a nested key', () => {
          script
            .change(doc => delete doc.data.test)
            .get('execute.0')
            .should.deepEqual({update: {data: {}}});
        });

      });

      describe('#delta()', () => {

        let doc;

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
          }, immutable);
          doc = script.get('document.content');
        });


        it('should be able to add a root key', () => {
          doc.date = 'today';
          script
            .delta(doc)
            .get('execute.0')
            .should.deepEqual({update: {date: 'today'}});
        });

        it('should be able to add a nested key', () => {
          doc.data.test2 = true;
          script
            .delta(doc)
            .get('execute.0')
            .should.deepEqual({update: {data: {test: true, test2: true}}});
        });

        it('should be able to remove a root key', () => {
          delete doc.data;
          script
            .delta(doc)
            .get('execute.0')
            .should.deepEqual({update: {data: null}});
        });

        it('should be able to remove a nested key', () => {
          delete doc.data.test;
          script
            .delta(doc)
            .get('execute.0')
            .should.deepEqual({update: {data: {}}});
        });

      });

    });

  }

  tests(true);
  tests(false);

});
