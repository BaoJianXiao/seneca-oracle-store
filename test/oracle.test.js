/* Copyright (c) 2010-2014 Paolo Chiodi */
"use strict";


var assert = require('assert')


var seneca = require('seneca')
var async = require('async')


var shared = require('seneca-store-test')




var si = seneca()
si.use(require('..'),{
  hostname: 'localhost',
  database: 'xe',
  user: 'TEST',
  password: 'TEST'
})

si.__testcount = 0
var testcount = 0


describe('oracle', function(){
  it('basic', function(done){
    testcount++
    shared.basictest(si,done)
  })

  it('limits', function(done){
    testcount++
    limitstest(si,done)
  })

  it('close', function(done){
    shared.closetest(si,testcount,done)
  })
})


function limitstest(si,done) {
  console.log('LIMITS')

  async.series(
    {

      remove: function (cb) {
        console.log('remove')

        var cl = si.make$('lmt')
        // clear 'lmt' collection
        cl.remove$({all$: true}, function (err, foo) {
          assert.ok(null == err)
          cb()
        })
      },

      insert1st: function (cb) {
        console.log('insert1st')

        var cl = si.make$('lmt')
        cl.p1 = 'v1'
        cl.save$(function (err, foo) {
          assert.ok(null == err)
          cb()
        })
      },

      insert2nd: function (cb) {
        console.log('insert2nd')

        var cl = si.make$('lmt')
        cl.p1 = 'v2'
        cl.save$(function (err, foo) {
          assert.ok(null == err)
          cb()
        })
      },

      insert3rd: function (cb) {
        console.log('insert3rd')

        var cl = si.make$('lmt')
        cl.p1 = 'v3'
        cl.save$(function (err, foo) {
          assert.ok(null == err)
          cb()
        })
      },

      listall: function (cb) {
        console.log('listall')

        var cl = si.make({name$: 'lmt'})
        cl.list$({}, function (err, lst) {
          assert.ok(null == err)
          assert.equal(3, lst.length)
          cb()
        })
      },

      listlimit1skip1: function (cb) {
        console.log('listlimit1skip1')

        var cl = si.make({name$: 'lmt'})
        cl.list$({limit$: 1, skip$: 1}, function (err, lst) {
          assert.ok(null == err)
          assert.equal(1, lst.length)
          cb()
        })
      },

      listlimit2skip3: function (cb) {
        console.log('listlimit2skip3')

        var cl = si.make({name$: 'lmt'})
        cl.list$({limit$: 2, skip$: 3}, function (err, lst) {
          assert.ok(null == err)
          assert.equal(0, lst.length)
          cb()
        })
      },

      listlimit5skip2: function (cb) {
        console.log('listlimit5skip2')

        var cl = si.make({name$: 'lmt'})
        cl.list$({limit$: 5, skip$: 2}, function (err, lst) {
          assert.ok(null == err)
          assert.equal(1, lst.length)
          cb()
        })
      },

      insertUpdate: function (cb) {
        console.log('insertUpdate')

        var cl = si.make$('lmt')
        cl.p1 = 'value1'
        cl.p2 = 2
        cl.save$(function (err, foo) {
          assert.ok(null == err)
          assert.ok(foo.id)
          assert.equal(foo.p1, 'value1')
          assert.equal(foo.p2, 2)

          delete foo.p1
          foo.p2 = 2.2

          foo.save$(function (err, foo) {
            assert.ok(null == err)

            foo.load$({id: foo.id}, function(err, foo) {

              assert.ok(foo.id)
              assert.equal(foo.p1, 'value1')
              assert.equal(foo.p2, 2.2)
            })
            cb()
          })
        })
      }
    },
    function (err, out) {
      si.__testcount++
      done()
    }
  )

  si.__testcount++
}