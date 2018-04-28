let expando = 'zp'
function Data () {
    this.cache = {}
}

Data.uid = 1

Data.prototype = {
    locker: function (owner) {
        // 保存owner重写之前的valueOf方法
        let ovalueOf,
            unlock = owner.valueOf(Data)
        
        if (typeof unlock !== 'string') {// valueOf返回值不为字符串则对象的valueOf方法还没有被重写
            unlock = expando + Data.uid++
            ovalueOf = owner.valueOf

            Object.defineProperty(owner, 'valueOf', {
                value: function (pick) {
                    if (pick === Data) {
                        return unlock
                    }
                    return ovalueOf.apply(owner)
                }
            })
        }

        // 开辟空间
        if (!this.cache[unlock]) {
            this.cache[unlock] = {}
        }    

        return unlock
    },
    set: function (owner, data, value) {
        let prop, 
            unlock = this.locker(owner),
            cache = this.cache[unlock]

        // 传入三个参数 第二个为字符串直接跟新键值对 
        if (typeof data === 'string') {
            cache[data] = value
        } else {// 传入两个参数第二个为对象 
            for (prop in data) {
                cache[prop] = data[prop]
            }
        }
        this.cache[unlock] = cache
        
        return this
    },
    get: function (owner, key) {
        let cache = this.cache[this.locker(owner)]

        return key === undefined ? cache : cache[key]
    },
    access: function (owner, key, value) {
        // 判断是读操作还是写操作
        if (key === undefined || 
            ((key && typeof key === 'string') && value === undefined)) {
            return this.get(owner, key)
        }
        this.set(owner, key, value)
        return value !== undefined ? value : key
    },
    hasData: function (owner) {
        return Object.keys(this.cache[this.locker(owner)]).length > 0
    },
    // 删除数据
    discard: function (owner) {
        delete this.cache[this.locker(owner)]
    }
}

let data_user = new Data(), data_priv = new Data()

function data_discard(owner) {
    data_user.discard(owner)
    data_priv.discard(owner)
}