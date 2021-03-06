import jsonp from 'common/js/jsonp'
import jsonp2 from 'common/js/jsonp2'
import { commonParams, options } from './config'
/* import axios from 'axios' */
import { ajax } from 'common/js/ajax'

export function getRecommend() {
    const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

    const data = Object.assign({}, commonParams, {
        platform: 'h5',
        uin: 0,
        needNewCode: 1
    })

    return jsonp(url, data, options)
}

// 这个使用express代理欺骗源地址，然后这里用axios进行http请求express的地址
// 由于服务端进行了限制，所以jsonp也无法直接获得数据
// 浏览器端是无法修改referer这个header头的
// 注释部分是直接使用axios的API，现在的部分是使用手写的ajax+Promise返回数据
export function getDiscList() {
    const url = '/api/getDiscList'

    const data = Object.assign({}, commonParams, {
        platform: 'yqq',
        hostUin: 0,
        sin: 0,
        ein: 29,
        sortId: 5,
        needNewCode: 0,
        categoryId: 10000000,
        rnd: Math.random(),
        format: 'json'
    })

    // return axios.get(url, {
    //     params: data
    // }).then((res) => {
    //     // promise可以直接用，不用new一个出来
    //     // axios拿到的数据是在.data里
    //     /*return Promise.resolve(res.data)*/
    //     return new Promise((resolve, reject) => {
    //         if (res.data) {
    //             resolve(res.data)
    //         }
    //     })
    // })

    return new Promise((resolve, reject) => {
        ajax({
            url: url,
            type: 'GET',
            data: data,
            dataType: 'json',
            success: function (response) {
                if (response) {
                    resolve(response)
                } else {
                    reject()
                }
            },
            fail: function (status) {
                console.log(status)
            }
        })
    })
}

export function getSongList(disstid) {
    const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'

    const data = Object.assign({}, commonParams, {
        type: 1,
        json: 1,
        utf8: 1,
        onlysong: 0,
        disstid: disstid,
        loginUin: 0,
        hostUin: 0,
        platform: 'yqq',
        needNewCode: 0
    })

    return new Promise((resolve, reject) => {
        jsonp2({
            url: url,
            callbackKey: options.param,
            callbackValue: 'playlistinfoCallback',
            data: data,
            time: 10000,
            success: function (response) {
                if (response) {
                    resolve(response)
                } else {
                    reject()
                }
            },
            fail: function (error) {
                console.log(error)
            }
        })
    })
}