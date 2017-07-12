export function shuffle(arr) {
    // 0到i之间取一个数，然后和arr[i]做交换，洗牌就会洗得很乱
    // 副本
    let _arr = arr.slice()
    for (let i = 0; i < _arr.length; i++) {
        let j = getRandomInt(0, i)
        let save = _arr[i]
        _arr[i] = _arr[j]
        _arr[j] = save
    }
    return _arr
}

function getRandomInt(min, max) {
    // 随机返回max和min之间的数，并且包括max和min
    return Math.floor(Math.random() * (max - min + 1) + min)
}