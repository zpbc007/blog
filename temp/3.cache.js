function Data () {
    this.expando = 'zp' + Data.uid++
}
Data.uid = 1
Data.prototype = {
    cache: function (owner) {
        let value = owner[this.expando]
        if (!value) {
            value = {}
            // 只有元素节点，window，document才能进入分支
            if (acceptData(owner)) {
                if (owner.nodeType) {// 不是window
                    owner[this.expando] = value
                } else {
                    Object.defineProperty(owner, this.expando, {
                        value,
                        configurable: true
                    })
                }
            }
        }
        return value
    },
    set: function (owner, data, value) {
        let prop,
            cache = this.cache(owner)

        if (typeof data === 'string') {
            // 转为驼峰？
            cache[jQuery.camelCase(data)] = value
        } else {
            for (let prop in data) {
                cache[jQuery.camelCase(data)][prop] = data
            }
        }
    }
}