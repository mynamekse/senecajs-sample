var
    seneca = require('seneca')(),
    assert = require('assert');


// normally this would be a `module.exports = function`...
var myWorkflow = function() {
    this.add({
        role: 'entity',
        cmd: 'save',
        base: 'sys',
        name: 'case'
    }, function(args, done) {
        args.ent = {
            foo: 'bar'
        };
        this.prior(args, done);
    });
};


describe('some random test', function() {
    before(function(done) {
        seneca.
        use('entity').
        use(myWorkflow);

        seneca.add({
            role: 'entity',
            cmd: 'save',
            base: 'sys',
            name: 'case'
        }, function(args, reply) {
            reply(null, args);
        });

        seneca.add('role:math,cmd:sum', (msg, reply) => {
            reply(null, {
                answer: (msg.left + msg.right)
            })
        })

        seneca.ready(function() {
            done();
        });
    });


    // it('should return foo bar', function(done) {
    //     seneca
    //         .make$('sys/case')
    //         .save$(function(err, ent) {
    //             console.log("DDDDDDDDDD" + ent.foo);
    //             assert.ok(ent.foo === 'bar');
    //             done();
    //         });
    // });

    it('should return foo 4', function(done) {
        seneca.act({
            role: 'math',
            cmd: 'sum',
            left: 1,
            right: 3
        }, function(err, result) {
            if (err) return console.error(err)
            
             assert.ok(result.answer === 4);
             done();
        })

    });

});
