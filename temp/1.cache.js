// version 1.2
let expando = 'zp' + (new Date()).getTime(),
        uuid = 0,
        // 存放id
        windowData = {}

// 缓存对象
CacheObj = {
    cache: {},
    data: function (elem, name, data) {
        // window对象特殊处理
        elem = elem === window ? windowData : elem
        let id = elem[expando]
        if (!id) {// 没有uuid 新增一个
            id = elem[expando] = ++uuid
        }
        if (name && !CacheObj.cache[id]) {
            CacheObj.cache[id] = {}
        }
        // data不为空为写操作
        if (data !== undefined ) {
            CacheObj.cache[id][name] = data
        }

        return name ? CacheObj.cache[id][name] : id
    },
    removeData: function (elem, name) {
        elem = elem === window ? windowData : elem
        let id = elem[expando]
        if (name) {// 移除目标数据
            if (CacheObj.cache[id]) {
                delete CacheObj.cache[id][name]
                name = ""
                // 遍历缓存体 如果有其他属性 name就为非空
                for (name in CacheObj.cache[id]) {
                    break
                }
                if (!name) { // 没有其他属性直接删除数据
                    CacheObj.removeData(elem)
                }   
            }
        } else {// 移除elem上的uuid
            delete elem[expando]
            delete CacheObj.cache[id]
        }
    }
}

