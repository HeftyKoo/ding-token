const request = require('request')
const { wrapper, serialize } = require('./util')
const { BASE_PATH } = require('./CONSTANT')
class Token {
  async getAccessToken ({corpid, corpsecret}) {
    return await this._request('gettoken', {corpid, corpsecret})
  }
  _request (path, params) {
    return new Promise (function (resolve, reject) {
      request(`${BASE_PATH}/${path}?${serialize(params)}`, wrapper(function (err, data) {
        if (err) {
          return reject(err)
        } else {
          return resolve(data)
        }
      }))
    })
  }
}

module.exports = Token