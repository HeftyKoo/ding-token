const { noop } = require('./util')
const { EXPIRE_TIME } = require('./CONSTANT')
const Token = require('./token')
class TokenTimer extends Token {
  /**
   * 
   * @param {Object[]} list 配置列表
   * @param {string} list[].name 钉钉corpsecret别名
   * @param {string} list[].corpid 钉钉corpid
   * @param {string} list[].corpsecret 钉钉corpsecret
   * @param {Function} saveToken 保存token的函数，每组更新时调用一次
   * @param {Function} onError 获取出错时调用
   * @param {Function} onComplete 在第一次获取完成或全部刷新完成时调用
   * 
   */
  constructor ({list = [], saveToken = noop, onError = noop, onComplete = noop}) {
    super()
    this.isComplete = false // 是否获取完成 
    this.list = list
    this.saveToken = saveToken
    this.onError = onError
    this.onComplete = onComplete
    this.timer = []
    this.tokens = [] // tokens列表
    this._getAccessTokenList()
  }
  // 保存指定组的access_token
  async _saveAccessToken (config) {
    try {
      const result = await this.getAccessToken(config)
      const token = Object.assign({}, config, result)
      this.tokens.push(token)
      this.saveToken(token)
      return result
    } catch (err) {
      this.error(err)
    }
  }
  // 更新access_token定时器
  _setTimer (config) {
    this._clearTimer(config.name)
    const timer = setTimeout(() => this._setTimer(config), (EXPIRE_TIME - 2 * 60) * 1000)
    this.timer.push(Object.assign({}, config, {id: timer}))
    return this._saveAccessToken(config)
  }
  // 获取所有access_token
  async _getAccessTokenList () {
    const tasks = this.list.map(config => {
      return this._setTimer(config)
    })
    await Promise.all(tasks)
    if (!this.isComplete) {
      this.isComplete = true
      this.onComplete(this.tokens)
    }
  }
  // 清除指定获取access_token的定时器
  _clearTimer (name) {
    const timer = this.timer.find(item => item.name === name)
    if (timer) {
      const index = this.timer.findIndex(item => item.name === name)
      clearTimeout(timer.id)
      this.timer.splice(index, 1)
    }
  }
  // 清除指定的token
  _clearToken (name) {
    const token = this.tokens.find(item => item.name === name)
    if (token) {
      const index = this.tokens.findIndex(item => item.name === name)
      this.tokens.splice(index, 1)
    }
  }
  // 更新指定的token
  refresh (name) {
    this._clearTimer(name)
    this._clearToken(name)
    const config = this.list.find(item => item.name === name)
    this._setTimer(config)
  }
  // 更新所有的token
  refreshAll () {
    this.isComplete = false
    this.timer.forEach(function(timer) {
      clearTimeout(timer.id)
    })
    this.timer = []
    this.tokens = []
    this._getAccessTokenList()
  }
}

module.exports = TokenTimer

