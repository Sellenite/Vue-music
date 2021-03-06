function hasClass(el, className) {
    // 以classname开头或者空白字符在它前面
    // 以classname结束或者空白字符在它后面
    let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
    return reg.test(el.className)
}

function addClass(el, className) {
    if (hasClass(el, className)) {
        return
    }
    // 将el本来的className变成一个数组
    let newClass = el.className.split(' ')
    // 将需要添加的classNamepush进去
    newClass.push(className)
    // 将数组变成字符串，赋值给el的class
    el.className = newClass.join(' ')
}

function removeClass(el, className) {
    if (hasClass(el, className)) {
        let newClass = el.className.replace(className, '')
        el.className = newClass
    }
}

function toggleClass(el, className) {
    if (hasClass(el, className)) {
        removeClass(el, className)
    } else {
        addClass(el, className)
    }
}

function toggleData(el, name, val) {
    const prefix = 'data-'
    name = prefix + name
    if (val) {
        return el.setAttribute(name, val)
    } else {
        return el.getAttribute(name)
    }
}

// 低配autoprefixer，用.style[]访问
function prefixStyle(style) {
    // 浏览器检测
    let elementStyle = document.createElement('div').style
    let vendor = (() => {
        let transformNames = {
            webkit: 'webkitTransform',
            moz: 'mozTransform',
            o: 'oTransform',
            ms: 'msTransform',
            standard: 'transform'
        }
        for (let key in transformNames) {
            if (elementStyle[transformNames[key]] !== undefined) {
                return key
            } else {
                return false
            }
        }
    })()
    if (vendor === false) {
        return
    }
    if (vendor === 'standard') {
        return style
    }

    let prefix = vendor + style.charAt(0).toUpperCase() + style.substr(1)
    return prefix
}

export default {
    hasClass,
    addClass,
    removeClass,
    toggleClass,
    toggleData,
    prefixStyle
}