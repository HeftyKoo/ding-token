const TokenTimer = require('../lib/timer')
const assert = require('assert')

describe('TokenTimer', function () {
  const list = [{
    name: 'test1',
    corpid: '',
    corpsecret: '', 
  }, {
    name: 'test2',
    corpid: '',
    corpsecret: '',
  }]
  const saveToken = function (result) {
    
  }
  const onError = function (err) {
    
  }
  let onComplete
  let tokenTimer
  let isCalled = false
  before(function (done) {
    onComplete = function () {
      if (!isCalled) {
        isCalled = true
        done()       
      }
    }
    tokenTimer = new TokenTimer({
      list,
      onError,
      saveToken,
      onComplete 
    })
  })
  it('constructor()', function () {
    assert.equal(tokenTimer.list, list)
    assert.equal(tokenTimer.saveToken, saveToken)
    assert.equal(tokenTimer.onError, onError)
    assert.equal(tokenTimer.onComplete, onComplete)
    assert.equal(tokenTimer.timer.length, list.length)
  })
  it('tokens', function () {
    const first = tokenTimer.tokens[0]
    const keys = Object.keys(first)
    assert.equal(tokenTimer.tokens.length, list.length)
    assert.ok(keys.includes('name'))
    assert.ok(keys.includes('corpid'))
    assert.ok(keys.includes('corpsecret'))
    assert.ok(keys.includes('errcode'))
    assert.ok(keys.includes('access_token'))
    assert.ok(keys.includes('errmsg'))
  })
  it('refresh()', function () {
    tokenTimer.refresh('test1')
    assert.equal(tokenTimer.timer.length, list.length)
  })
  it('refreshAll()', function () {
    tokenTimer.refreshAll()
    assert.equal(tokenTimer.timer.length, list.length)
  })
  after(function() {
    process.exit(0)
  })
})