exports.noop = function () {}

exports.wrapper = function (callback = function(){}) {
  return function (err, res, data) {
    data = data && JSON.parse(data)
    if (err) {
      err.name = 'DingApi' + err.name
      return callback(err, data)
    }
    if (data && data.errcode) {
      err = new Error()
      err.name = 'DingApiError'
      err.code = data.errcode
      return callback(err, data)
    }
    if (data == null) {
      err = new Error('No data received.');
      err.name = 'DingAPIError';
      err.code = -1;
      return callback(err, data);
    }
    callback(err, data)
  }
}

exports.serialize = function(params = {}) {
  const arr = Object.keys(params).map(key => {
    return `${key}=${params[key]}`
  })
  return arr.join('&')
}
