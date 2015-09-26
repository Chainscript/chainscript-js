import sinon from 'sinon';
import request from 'superagent';
import Message from 'bitcore-message';
import Chainscript from '../src/Chainscript';
import clone from '../src/utils/clone';

const testResponse = {
  ok: true,
  body: {
    body: {
      content: 'Hello World',
      x_meta: {
        uuid: 'chainscript:envelope:a04c92b4-bdd6-4515-be8e-ceb210e512e8',
        content_digest: 'afeade0f531f82d67cf4bd2e7fcf217e3a841702'
      }
    },
    x_chainscript: {
      validation: {
        agent: 'io.chainscript.agent',
        version: '0.1.alpha',
        result: 'valid',
        validated_on: '2015-09-18T20:52:44+00:00',
        message: 'Envelope was executed without a command.'
      },
      hash: '3321cc6f238dc4685d022f80c9aa265156a8b883'
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
            {body: {content: {name: 'Hello World'}}},
            immutable
          );
        });

        it('should return the script as JSON', () => {
          script.toJSON().should.deepEqual(
            {body: {content: {name: 'Hello World'}}}
          );
        });

      });

      describe('#clone()', () => {

        beforeEach(() => {
          script = new Chainscript(
            {body: {content: {name: 'Hello World'}}},
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
            {body: {content: {name: 'Hello World'}}},
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
              body: {
                content: {
                  name: 'Hello World'
                }
              },
              x_chainscript: {
                snapshots_enabled: true
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
            {body: {content: {name: 'Hello World'}}},
            immutable
          );
        });

        it('should return the value if the path exists', () => {
          script.get('body.content.name').should.be.exactly('Hello World');
        });

        it('should return undefined if the path does not exist', () => {
          (script.get('body.content.time') === undefined)
            .should.be.exactly(true);
        });

      });

      describe('#set()', () => {

        beforeEach(() => {
          script = new Chainscript(
            {body: {content: {name: 'Hello World'}}},
            immutable
          );
        });

        it('should set the value at given path', () => {
          script
            .set('body.content.name', 'stephan')
            .get('body.content.name')
            .should.be.exactly('stephan');
        });

      });

      describe('#snapshot()', () => {

        beforeEach(() => {
          script = new Chainscript(
            {body: {content: {name: 'Hello World'}}},
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
            {body: {content: {name: 'Hello World'}}},
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
            {body: {content: {name: 'Hello World'}}},
            immutable
          )
            .notarize();
        });

        it('should add a notarize command', () => {
          script.get('execute.0').should.deepEqual({notarize: {}});
        });

      });

      describe('#email()', () => {

        context('without a subject', () => {

          beforeEach(() => {
            script = new Chainscript(
              {body: {content: {name: 'Hello World'}}},
              immutable
            )
              .email('test@example.com');
          });

          it('should add a email command', () => {
            script.get('execute.0')
              .should.deepEqual({send_email: {to: 'test@example.com'}});
          });

        });

        context('with a subject', () => {

          beforeEach(() => {
            script = new Chainscript(
              {body: {content: {name: 'Hello World'}}},
              immutable
            )
              .email('test@example.com', 'test');
          });

          it('should add a email command with a subject', () => {
            script.get('execute.0')
              .should.deepEqual({
                send_email: {
                  to: 'test@example.com',
                  subject: 'test'
                }
              });
          });

        });

      });

      describe('#change()', () => {

        beforeEach(() => {
          script = new Chainscript({
            body: {
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
            .change(content => content.date = 'today')
            .get('execute.0')
            .should.deepEqual({update: {date: 'today'}});
        });

        it('should be able to add a nested key', () => {
          script
            .change(content => content.meta = {date: 'today'})
            .get('execute.0')
            .should.deepEqual({update: {meta: {date: 'today'}}});
        });

        it('should be able to remove a root key', () => {
          script
            .change(content => delete content.data)
            .get('execute.0')
            .should.deepEqual({update: {data: null}});
        });

        it('should be able to remove a nested key', () => {
          script
            .change(content => delete content.data.test)
            .get('execute.0')
            .should.deepEqual({update: {data: {}}});
        });

      });

      describe('#delta()', () => {

        let content;

        beforeEach(() => {
          script = new Chainscript({
            body: {
              content: {
                name: 'Hello World',
                data: {
                  test: true
                }
              }
            }
          }, immutable);
          content = clone(script.get('body.content'));
        });


        it('should be able to add a root key', () => {
          content.date = 'today';
          script
            .delta(content)
            .get('execute.0')
            .should.deepEqual({update: {date: 'today'}});
        });

        it('should be able to add a nested key', () => {
          content.data.test2 = true;
          script
            .delta(content)
            .get('execute.0')
            .should.deepEqual({update: {data: {test: true, test2: true}}});
        });

        it('should be able to remove a root key', () => {
          delete content.data;
          script
            .delta(content)
            .get('execute.0')
            .should.deepEqual({update: {data: null}});
        });

        it('should be able to remove a nested key', () => {
          delete content.data.test;
          script
            .delta(content)
            .get('execute.0')
            .should.deepEqual({update: {data: {}}});
        });

      });

      describe('#sign()', () => {

        beforeEach(() => {
          script = new Chainscript(
            testResponse.body,
            immutable
          ).sign('Kx1ofTinaoNEb74pU7sfmNsmpffXH8SRbtQF28EiZ9Vij5Kbh8s8');
        });

        it('should add a sign_content command', () => {
          const sig = script.get(
            'execute.0.sign_content.1QAE28K4eD7TzkarH3b4FCtWE8nLizJKzZ'
          );
          sig.digest
            .should.be.exactly(script.get('body.x_meta.content_digest'));
          Message(script.get('body.x_meta.content_digest')).verify(
            '1QAE28K4eD7TzkarH3b4FCtWE8nLizJKzZ',
            sig.signature).should.be.exactly(true);
        });

      });

    });

  }

  tests(false);
  tests(true);

});
