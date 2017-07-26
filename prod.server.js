var express = require('express')
var config = require('./config/index')
var axios = require('axios')

var app = express()

var apiRoutes = express.Router()

apiRoutes.get('/getDiscList', function (req, res) {
  var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'

  axios.get(url, {
    // 欺骗地址
    headers: {
      referer: 'http://c.y.qq.com',
      host: 'c.y.qq.com'
    },
    // 浏览器中发来的请求参数，原封不动的赋值
    params: req.query
  }).then((response) => {
    // res是express的参数，response是axios请求qq音乐服务端返回的
    // axios返回的数据是在.data里
    // 输出返回值
    res.json(response.data)
  }).catch((err) => {
    console.log(err)
  })
})

apiRoutes.get('/lyric', function (req, res) {
  var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'

  axios.get(url, {
    // 欺骗地址
    headers: {
      referer: 'http://c.y.qq.com',
      host: 'c.y.qq.com'
    },
    // 浏览器中发来的请求参数，原封不动的赋值
    params: req.query
  }).then((response) => {
    // 这里请求返回format后还是jsonp，不能直接输出，需要正则处理
    var ret = response.data
    if (typeof ret === 'string') {
      // \w比[0-9a-zA-Z]多_,+是一个或多个
      // [^()]+ 代表不为左括号和右括号的字符，多个
      // {}就是匹配{}
      var reg = /^\w+\(({[^()]+})\)$/
      var matches = ret.match(reg)
      if (matches) {
        // 匹配到第一个是全部，第二个是第一个括号捕获的内容内容
        ret = JSON.parse(matches[1])
      }
    }
    res.json(ret)
  }).catch((err) => {
    console.log(err)
  })
})

app.use('/api', apiRoutes)

app.use(express.static('./dist'))

var port = process.env.PORT || config.build.port

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})