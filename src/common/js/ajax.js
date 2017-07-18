// 使用了原生js实现ajax，结合Promise，代替了axios
export function ajax(options) {
    // 参数初始化
    options = options || {}
    options.type = (options.type || 'GET').toUpperCase()
    options.dataType = options.dataType || 'json'
    let parmas = formatParmas(options.data)

    var xhr
    // 第一步，创建xhr对象
    if (window.XMLHttpRequest) {
        // code for IE7+, FireFox, Chorme, Opera, Safari
        xhr = new XMLHttpRequest()
    }

    // 第二步，发送
    if (options.type === 'GET') {
        xhr.open('GET', options.url + '?' + parmas, true)
        xhr.send(null)
    } else {
        xhr.open('POST', options.url, true)
        // POST请求需要设置HTTP头
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
        xhr.send(parmas)
    }

    // 第三步，接收响应
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let json = JSON.parse(xhr.responseText)
                options.success && options.success(json)
            } else {
                options.fail && options.fail(xhr.status)
            }
        }
    }
}

function formatParmas(data) {
    // data: {a:1, b:2}
    var arr = [];
    for (var key in data) {
        arr.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    }
    return arr.join('&')
}