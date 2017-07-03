import originJSONP from 'jsonp';

export default function jsonp(url, data, option) {
    url += (url.indexOf('?') < 0 ? '?' : '&') + parma(data)
    return new Promise((resolve, reject) => {
        // 原始jsonp的API，第三个是一个callback
        // 如果err是none的话表示成功
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
    let url = ''
    for (let k in data) {
        let value = data[k] !== undefined ? data[k] : ''
        url += `&${k}=${encodeURIComponent(value)}`
    }
    // 删去最前面的&，因为第一个的位置是?
    return url ? url.substring(1) : ''
}