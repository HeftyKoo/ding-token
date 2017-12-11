const config = require('./config')
const assert = require('assert')
const Token = require('../lib/token')
const token = new Token()
describe('Token', function () {
  describe('getAccessToken()', function() {
    it('it should return errcode 0', async function () {
      const data = await token.getAccessToken(config)
      assert.equal(data.errcode, 0)
    })
  })
})