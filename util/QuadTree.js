let MAX_OBJECTS = 10
let MAX_DEPTH = 10
// 四叉树
class QuadTree {
    /**
     * 构建树节点
     * @param {*} depth 当前节点深度
     * @param {*} rect 当前节点对应的矩形区域
     */
    constructor (depth, rect) {
        // 划分前能够用于节点的最大数量
        this.MAX_OBJECTS = MAX_OBJECTS
        this.MAX_DEPTH = MAX_DEPTH
        // 节点对应的矩形区域
        this.rect = rect
        // 子节点
        this.child = []
        // 当前节点深度
        this.depth = depth
        // 存储节点
        this.nodes = []
    }

    // 清空树
    clear () {
        this.child = []
        this.nodes.forEach((node, index) => {
            node.clear()
            this.nodes[index] = null
        })
    }

    // 将当前节点划分为四个象限
    split () {
        let subWidth = this.rect.width / 2,
            subHeight = this.rect.height / 2,
            x = this.rect.x,
            y = this.rect.y
        
        this.child[0] = new QuadTree(this.depth + 1, new Rectangle(x + subWidth, y, subWidth, subHeight))
        this.child[1] = new QuadTree(this.depth + 1, new Rectangle(x, y, subWidth, subHeight))
        this.child[2] = new QuadTree(this.depth + 1, new Rectangle(x, y + subHeight, subWidth, subHeight))
        this.child[3] = new QuadTree(this.depth + 1, new Rectangle(x + subWidth, y + subHeight, subWidth, subHeight))
    }

    // 图形所在象限即数组中的位置
    getIndex (rect) {
        let verticalLine = this.rect.x + this.rect.width / 2,
            horizontalLine = this.rect.y + this.rect.height / 2
        
        const inTop = rect.y < horizontalLine && rect.y + rect.height < horizontalLine,
            inBootom = rect.y > horizontalLine

        if (rect.x < verticalLine && rect.x + rect.width < verticalLine) {
            if (inTop) {
                return 1
            } else if (inBootom) {
                return 2
            }
        } else if (rect.x > verticalLine) {
            if (inTop) {
                return 0
            } else if (inBootom) {
                return 3
            }
        }

        return -1
    }

    // 插入
    insert (rect) {
        if (this.child[0]) {
            let index = this.getIndex(rect)

            if (index !== -1) {
                this.child[index].insert(rect)

                return 
            }
        }

        this.nodes.push(rect)
        // 超出容量进行分裂
        if (this.nodes.length > this.MAX_OBJECTS && this.depth < this.MAX_DEPTH) {
            if (!this.child[0]) {
                this.split()
            }
            let i = 0
            while (i < this.nodes.length) {
                let index = this.getIndex(this.nodes[i])
                if (index !== -1) {
                    this.child[index].insert(this.nodes.splice(i, 1)[0])
                } else {
                    i++
                }
            }
        }
    }

    // 获取当前节点的所有点
    getAllNodes () {
        let result = []
        result = result.concat(this.nodes)
        // 有子节点 遍历子节点
        if (this.child[0]) {
            this.child.forEach(child => {
                result = result.concat(child.getAllNodes())
            })
        }

        return result
    }

    search (num, rect, result) {
        // 数量够了返回
        if (result.length >= num) {
            return
        }

        // 没有子节点 将当前树的节点放入
        if (!this.child[0]) {
            for (let node of this.nodes) {
                if (result.length >= num) {
                    return
                }
                result.push(node)
            }
            return 
        } 
        
        let index = this.getIndex(rect)
        if (index !== -1) {
            // 去子节点中查找
            this.child[index].search(num, rect, result)

            // 子节点中不够 把自己与兄弟的放入
            if (result.length < num) {
                this.child.forEach((child, i) => {
                    if (i !== index) {
                        result.push.apply(result, child.getAllNodes())
                    }
                })
                result.push.apply(result, this.nodes)
            }
        } else {
            // 只属于当前节点把所有节点都给它
            result.push.apply(result, this.getAllNodes())
        }
    }
}
// 矩形区域
class Rectangle {
    constructor (x, y, width, height) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
    }
}

/**
 * 初始化树
 * @param {*} maxObjects 每个区域中放入的最大节点数
 * @param {*} maxDepth 树的最大深度
 * @param {*} rect 根节点区域
 */
function initTree (maxObjects, maxDepth, rect) {
    MAX_OBJECTS = maxObjects
    MAX_DEPTH = maxDepth

    return new QuadTree(0, rect)
}

export {
    Rectangle,
    initTree
}