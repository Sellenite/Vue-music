import jsonp from 'common/js/jsonp'
import { commonParams, options } from './config'
/*import axios from 'axios'*/

export function getSingerList(page) {
    const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'

    const data = Object.assign({}, commonParams, {
        channel: 'singer',
        page: 'list',
        key: 'all_all_all',
        pagesize: 100,
        pagenum: page,
        loginUin: 0,
        hostUin: 0,
        platform: 'yqq',
        needNewCode: 0
    })

    return jsonp(url, data, options)
}

export function getSingerDetail(singerID) {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'

    const data = Object.assign({}, commonParams, {
        loginUin: 0,
        hostUin: 0,
        platform: 'yqq',
        needNewCode: 0,
        singermid: singerID,
        order: 'listen',
        begin: 0,
        num: 100,
        songstatus: 1
    })

    return jsonp(url, data, options)
}
