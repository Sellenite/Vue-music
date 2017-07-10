export const commonParams = {
    // 公共请求参数，查看Query String Parameters选项
    // 这是给服务端传的公共参数
    g_tk: 5381,
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    format: 'jsonp'
}

// jsonp传入option选项时有一个param的key 
export const options = {
    param: 'jsonpCallback'
}

export const ERR_OK = 0