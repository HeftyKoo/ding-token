# ding-token

> 获取钉钉服务的access_token，可以同时管理多个access_token，会定时刷新token，避免过期。

## Installation

```javascript
yarn add ding-token
```

## Usage

```javascript
const DingToken = require('ding-token')
const dingToken = new DingToken({
  list: [
    {
      name: 'test1',
      corpid: '',
      corpsecret: '', 
    }, {
      name: 'test2',
      corpid: '',
      corpsecret: '',
    }
  ],
  saveToken (token) {
  	db.save(token)
  },
  onError (err) {},
  onComplete (tokens) {console.log(tokens)}
})
```

## 参数

| 参数名        | 描述                                | 类型       | 回调参数   | 必填    |
| ---------- | --------------------------------- | -------- | ------ | ----- |
| list       | 需要管理的钉钉corpsecret                 | Array    | --     | true  |
| saveToken  | token有更新时会触发的回调函数                 | Function | token  | false |
| onError    | 获取token出错时触发的回调函数                 | Function | err    | false |
| onComplete | 第一次获取所有token或者全部更新token完成时触发的回调函数 | Function | tokens | false |

* list
  * name: <String> 别名，必填
  * corpid: <String> 钉钉的corpid，必填
  * corpsecret <String> 钉钉的corpsecret，必填
* saveToken (token)
  * name <String> 对应token的别名
  * corpid <String> 对应token的corpid
  * corpsecret <String> 对应token的corpsecret
  * errorcode <Number> 错误码（0）
  * errmsg <String> 错误信息（"ok"）
  * access_token <String> access_token

## 方法

### refresh（name）

用来刷新指定的别名的 access_token。

```javascript
dingToken.refresh('test1')
```

### refreshAll()

刷新所有的 access_token，如果所有 token 获取完成，会触发 `onComplete` 回调函数。

```javascript
dingToken.refreshAll()
```

