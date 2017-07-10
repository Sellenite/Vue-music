import originJSONP from 'jsonp';

/**
 * jsonp请求封装
 * @param {*string} url 请求原始网址
 * @param {*object} data 所带的参数，写成对象样式
 * @param {*object} option 
 */
export default function jsonp(url, data, option) {
    url += (url.indexOf('?') < 0 ? '?' : '&') + parma(data)
    return new Promise((resolve, reject) => {
        // 原始jsonp的API，第三个是一个callback
        // 如果err是none的话表示成功
        // 这个url是需要带参数的，与axios不同，所以这里在前面进行了字符串拼接
        // url参考：https://www.baidu.com?a=123&b=456&c=789
        originJSONP(url, option, (err, data) => {
            if (!err) {
                resolve(data)
            } else {
                reject(err)
            }
        })
    })
}

function parma(data) {
    let query = ''
    // 拼接query对象
    for (let k in data) {
        let value = data[k] !== undefined ? data[k] : ''
        query += `&${k}=${encodeURIComponent(value)}`
    }
    // 删去最前面的&，因为第一个的位置是?
    return query ? query.substring(1) : ''
}