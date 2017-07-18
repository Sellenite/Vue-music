// 使用了原生js实现jsonp，结合Promise，代替了npm引入的jsonp
export default function jsonp(options) {
    // 创建script标签并加入到页面中
    let callbackName = options.callbackValue
    let script = document.createElement('script')
    let head = document.getElementsByTagName('head')[0]
    // 设置传递给后台的回掉函数名
    options.data[options.callbackKey] = callbackName
    let data = formatParmas(options.data)
    head.appendChild(script)

    // 创建jsonp回调函数
    window[callbackName] = function (json) {
        head.removeChild(script)
        clearTimeout(script.timer)
        window[callbackName] = null
        options.success && options.success(json)
    }

    // 发送请求
    script.src = options.url + '?' + data

    // 为了得知这次请求是否成功，设置超时处理
    if (options.time) {
        script.timer = setTimeout(() => {
            window[callbackName] = null
            head.removeChild(script)
            options.fail && options.fail({
                message: '请求超时'
            })
        }, options.time)
    }
}

function formatParmas(data) {
    let arr = []
    for (let key in data) {
        arr.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    }
    return arr.join('&')
}