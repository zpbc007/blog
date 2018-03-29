<template>
    <div class="container">
        <div id="diagram"></div>
        <div class="config">
            <Form :model="form">
                <FormItem label="节点名称">
                    <Input v-model="form.name" />
                </FormItem>
                <FormItem label="节点类型">
                    <Select v-model="form.type">
                        <Option 
                            v-for="item in nodeTypeList"
                            :key="item.value"
                            :value="item.value">
                            {{ item.label }}
                        </Option>
                    </Select>
                </FormItem>
            </Form>
            <Button @click="addNode">添加节点</Button>
        </div>
    </div>
</template>
<script>
import * as d3 from 'd3'

const drag = d3.drag
const line = d3.line
const symbol = d3.symbol

let id = 0
const initNodeList = [
    {
        // 包含的文字
        text: '中间节点',
        // 类型
        type: 'rect',
        x: 600,
        y: 300,
        width: 100,
        height: 80,
        id: 1
    },
    {
        // 包含的文字
        text: '上',
        // 类型
        type: 'rect',
        x: 600,
        y: 120,
        width: 100,
        height: 80,
        id: 2
    },
    {
        // 包含的文字
        text: '下',
        // 类型
        type: 'rect',
        x: 600,
        y: 480,
        width: 100,
        height: 80,
        id: 3
    },
    {
        // 包含的文字
        text: '左',
        // 类型
        type: 'rect',
        x: 400,
        y: 300,
        width: 100,
        height: 80,
        id: 4
    },
    {
        // 包含的文字
        text: '右',
        // 类型
        type: 'rect',
        x: 800,
        y: 300,
        width: 100,
        height: 80,
        id: 5
    }
]

const relList = {
    '1-top': ['2-bottom'],
    '1-right': ['5-left'],
    '1-bottom': ['3-top'],
    '1-left': ['4-right'],
}

// 节点挂载点
const directions = {
    top: 'top',
    right: 'right',
    bottom: 'bottom',
    left: 'left',
}
// x y 方向
const xyDirections = {
    top: 'y',
    right: 'x',
    bottom: 'y',
    left: 'x',
}

export default {
    data () {
        return {
            form: {
                name: '',
                type: ''
            },
            nodeTypeList: [
                {
                    label: '矩形',
                    value: 'rect'
                }
            ],
            flowchart: null,
            // key为图形id
            nodeList: {},
            // key为图形id-position
            relList: {},
            svg: null,
            minLen: 20,
            // 图形id数组
            selectedNodeList: []
        }
    },
    watch: {
        nodeList: {
            handler () {
                this.draw()
                this.genLines()
            },
            deep: true
        },
        relList () {
            this.genLines()
        },
        // todo 测试用
        selectedNodeList (newVal) {
            this.svg.selectAll('.zpTestLine')
                .remove()
            let vue = this
            if (newVal.length === 2) {
                let result = this.genLinesCollect(this.nodeList[newVal[0]], this.nodeList[newVal[1]])
                let minXNodes = [{x :result.minX, y: 0}, {x: result.minX, y: 800}],
                    maxXNodes = [{x :result.maxX, y: 0}, {x: result.maxX, y: 800}],
                    minYNodes = [{x: 0, y: result.minY}, {x: 1200, y: result.minY}],
                    maxYNodes = [{x: 0, y: result.maxY}, {x: 1200, y: result.maxY}],
                    midXNodes = [{x :result.midX, y: 0}, {x: result.midX, y: 800}],
                    midYNodes = [{x: 0, y: result.midY}, {x: 1200, y: result.midY}]

                let testLine = line()
                        .x(item => {
                            return item.x
                        })
                        .y(item => {
                            return item.y
                        })
                    
                drawLine(minXNodes, 'minXNodes')
                drawLine(maxXNodes, 'maxXNodes')
                drawLine(minYNodes, 'minYNodes')
                drawLine(maxYNodes, 'maxYNodes')
                drawLine(midXNodes, 'midXNodes')
                drawLine(midYNodes, 'midYNodes')
                
                function drawLine (nodes, className) {
                    vue.svg
                        .append('path')
                        .attr('d', testLine(nodes))
                        .attr('stroke-width', '1.5px')
                        .attr("stroke", "#FAD7A0")
                        .attr('class', `zpTestLine ${className}`)
                }

                console.log(JSON.stringify(result))
            }
        }
    },
    methods: {
        // 初始化 
        init () {
            this.initCanvas()
            this.initData()
            this.genLines()
        },
        // 准备画布
        initCanvas () {
            const width = 1200,
                height = 800
            this.svg = d3.select("#diagram")
                .append('svg')
                .attr('width', width)
                .attr('height', height)
                .append('g')
        },
        // 初始数据绘制到画布上
        initData () {
            for (let node of initNodeList) {
               if (node.id >= id) {
                    id = node.id + 1
                }
                this.addNodeToNodeList(node)
            }
            // 关联数据
            this.relList = relList
        },
        // 添加节点
        addNode () {
            let node = null
            switch (this.form.type) {
                case 'rect':
                    node = {
                        // 包含的文字
                        text: this.form.name,
                        // 类型
                        type: this.form.type,
                        x: 0,
                        y: 0,
                        width: 100,
                        height: 80
                    }
                    break
                default:
                    throw new Error(`没有此类型的图形: ${this.form.type}`)
            }
            this.addNodeToNodeList(node)

            this.form = {
                name: '',
                type: ''
            }
        },
        // 为节点添加id
        addNodeToNodeList (node) {
            let nodeId = node.id ? node.id : id++
            this.$set(this.nodeList, nodeId, {...node, id: nodeId})
        },
        // 遍历节点 绘图  todo应该只绘制改变的部分
        draw () {
            let nodeObj = {
                'rect': []
            }
            // 根据节点类型分批绘制
            for (let nodeId in this.nodeList) {
                nodeObj[this.nodeList[nodeId].type].push(this.nodeList[nodeId])
            }
            for (let type in nodeObj) {
                switch(type) {
                    case 'rect':
                        const obj = this.drawRect(nodeObj[type])
                        this.addText(obj.group)
                        this.addDragEvent(obj.group)
                        this.addClickEvent(obj.rects)
                        this.addCircle(obj)
                        break
                    default:
                        throw new Error(`错误的类型: ${type}`)
                }
            }
        },
        // 批量绘制矩形
        drawRect (nodeList) {
            const rectGroup = this.svg.selectAll('.zpRectGroup')
                .data(nodeList)
                .enter()
                .append('g')
                .attr('class', 'zpRectGroup')
                .attr('transform', item => `translate(${item.x}, ${item.y})`)
            
            const rects = rectGroup.append('rect')
                .attr('class', 'zpRect')
                .attr('x', item => 0)
                .attr('y', item => 0)
                .attr('width', item => item.width)
                .attr('height', item => item.height)
                .attr('fill-opacity', '0')
                .attr('stroke-width', '1.5px')
                .attr('stroke', 'steelblue')
            
            return {
                group: rectGroup,
                rects: rects
            }
        },
        // 为图形添加拖动事件
        addDragEvent (nodeList) {
            const vue = this
            nodeList.call(drag()
                .on('drag', function (data) {
                    vue.$set(data, 'x', data.x + d3.event.dx)
                    vue.$set(data, 'y', data.y + d3.event.dy)
                    d3.select(this)
                        .attr('transform', `translate(${data.x}, ${data.y})`)
                })
            )
        },
        // 添加点击事件
        addClickEvent (nodeList) {
            const vue = this
            nodeList.on('click', function (data, index) {
                let idIndex = vue.selectedNodeList.indexOf(data.id)
                if (idIndex !== -1) {
                    // 已经被选中取消选中
                    vue.selectedNodeList.splice(idIndex, 1)
                    d3.select(this)
                        .attr('fill-opacity', '0')
                } else {
                    // 添加选中效果
                    vue.selectedNodeList.push(data.id)
                    d3.select(this)
                        .attr('fill-opacity', '0.5')
                }
                

            })
        },
        // 向图形添加四周圆形
        addCircle (obj) {
            let { group, rects } = obj
            // 遍历每一个矩形
            rects.each((item, index) => {
                // 计算四个圆的坐标
                switch (item.type) {
                    case 'rect':
                        let points = []
                        for (let dir in directions) {
                            points.push({
                                // g有偏移
                                ...this.calCoordinateByPos({...item, x: 0, y: 0}, dir),
                                r: '5px'
                            })
                        }
                        this.drawCircle(points, d3.select(group.nodes()[index]))
                        break
                    default:
                        throw new Error(`不支持的节点类型: ${item.type}`)
                }
            })
        },
        // 绘制圆形 四个
        drawCircle (points, group) {
            group.selectAll('.circle')
                .data(points)
                .enter()
                .append('circle')
                .attr('class', 'circle')
                .attr('cx', item => item.x)
                .attr('cy', item => item.y)
                .attr('r', item => item.r)
                .attr('fill-opacity', '1')
                .attr('fill', 'white')
                .attr('stroke', 'blue')
                .attr('stroke-width', '1px')
        },
        // 向图形添加文字
        addText (nodeList) {
            nodeList.append('text')
                .text(item => item.text)
                .attr("text-anchor", "middle")
                .attr('x', item => item.width / 2)
                .attr('y', item => item.height / 2)
                .attr("fill", "black")
        },
        // 绘制线
        genLines () {
            let lines = []
            for (let key in this.relList) {
                this.relList[key].forEach(item => {
                    lines.push(this.genPointsByRel(key, item))
                })
            }
            this.drawLine(lines)
        },
        // 根据端点坐标绘制直线
        drawLine (linePoints) {
            let curveLine = line().x(item => item.x).y(item => item.y),
                symbolLine = symbol().type(d3.symbolTriangle)

            let lineGroupUpdate = this.svg.selectAll('.zpLineGroup')
                    .data(linePoints),
                lineGroupEnter = lineGroupUpdate.enter()
                    .append('g')
                    .attr('class', 'zpLineGroup')
            
            let appendLines = lineGroupEnter.append('path')
                    .attr('d', item => {
                        return curveLine(item)
                    })
                    .attr('stroke', 'blue')
                    .attr('stroke-width', '1.5px')
                    .attr('class', 'zpLine')
                    .attr('fill-opacity', '0')
                    
                    
            
            let updateLines = lineGroupUpdate.select('.zpLine')
                    .attr('d', item => {
                        return curveLine(item)
                    })
            
            let appendArrow =  lineGroupEnter.append('path')
                    .attr('d', symbolLine())
                    .attr('stroke', 'blue')
                    .attr('class', 'zpArrow')
                    .attr('stroke-width', '1.5px')
                    .attr('fill', 'black')
                    .attr('transform', item => this.calArrorwTransform(item[item.length - 1]))
            let updateArrow = lineGroupUpdate.select('.zpArrow')
                    .attr('transform', item => this.calArrorwTransform(item[item.length - 1]))
            
        },
        calArrorwTransform (node) {
            let x = null,
                y = null,
                rotate = null,
                len = 10

            switch (node.position) {
                case directions.top:
                    x = node.x
                    y = node.y - len
                    rotate = 180
                    break
                case directions.bottom:
                    x = node.x
                    y = node.y + len
                    rotate = 0
                    break
                case directions.left:
                    x = node.x - len
                    y = node.y
                    rotate = -30
                    break
                case directions.right:
                    x = node.x + len
                    y = node.y
                    rotate = 30
                    break
                default:
                    throw new Error(`不支持的方向类型 ${node.position}`)
            }
            return `translate(${x}, ${y}) rotate(${rotate})`
        },
        // 根据关联关系生成端点坐标
        genPointsByRel (start, end) {
            // 解析字符串
            let startObj = this.parseIdString(start),
                endObj = this.parseIdString(end)
            
            // 获取对应节点
            let startNode = this.nodeList[startObj.id],
                endNode = this.nodeList[endObj.id]
            
            // 根据位置计算坐标
            // result.push({...this.calCoordinateByPos(startNode, startObj.position), position: startObj.position})
            // result.push({...this.calCoordinateByPos(endNode, endObj.position), position: endObj.position})
            return this.genPathPoints(
                        {
                            ...this.calCoordinateByPos(startNode, startObj.position), 
                            position: startObj.position
                        }, 
                        {
                            ...this.calCoordinateByPos(endNode, endObj.position), 
                            position: endObj.position
                        },
                        startNode, 
                        endNode)
        },
        // 解析id-position
        parseIdString (string) {
            let temp = string.split('-')
            return {
                id: temp[0],
                position: temp[1]
            }
        },
        // 根据位置计算坐标
        calCoordinateByPos (node, position) {
            switch (node.type) {
                case 'rect':
                    let x = null,
                        y = null

                    switch (position) {
                        case directions.top:
                            x = node.x + node.width / 2
                            y = node.y
                            break
                        case directions.bottom:
                            x = node.x + node.width / 2
                            y = node.y + node.height
                            break
                        case directions.left:
                            x = node.x
                            y = node.y + node.height / 2
                            break
                        case directions.right:
                            x = node.x + node.width
                            y = node.y + node.height / 2
                            break
                        default:
                            throw new Error(`不支持的方向类型: ${position}`)
                    }

                    return {x, y}
                    break
                default:
                    throw new Error(`不支持的节点类型: ${node.type}`)
            }
        },
        // 根据起始点，终点，以及起始方向生成连线中的节点坐标
        genPathPoints (startPoint, endPoint, startEl, endEl) {
            let linesCollect = this.genLinesCollect(startEl, endEl)
            let midNode = {
                x: linesCollect.midX,
                y: linesCollect.midY
            }
            let startPoints = [],
                endPoints = []
            let sameLine = this.isSameLine(startPoint, endPoint),
                haveInter = this.calIntersectionByTwoPoints(startPoint, startPoint)
            // 递归 直到有交点或在同一条线上
            while (!sameLine && !haveInter) {
                debugger
                startPoints.push(startPoint)
                endPoints.unshift(endPoint)

                startPoint = this.calIntersection(startPoint, midNode, linesCollect)
                endPoint = this.calIntersection(endPoint, midNode, linesCollect)

                sameLine = this.isSameLine(startPoint, endPoint),
                haveInter = this.calIntersectionByTwoPoints(startPoint, startPoint)
            }
            if (haveInter) {
                points.push(haveInter)
            } 
            startPoints.push(startPoint)
            endPoints.unshift(endPoint)
            debugger
            return startPoints.concat(endPoints)
        },
        // 根据两个元素生成包围的线及坐标线的集合
        genLinesCollect (startEl, endEl) {
            let linesCollect = {},
                minWidth = null,
                minHeight = null

            // y方向的最小边
            if (startEl.y < endEl.y) {
                linesCollect.minY = startEl.y
                minHeight = startEl.height
            } else {
                linesCollect.minY = endEl.y
                minHeight = endEl.height
            }

            // y方向的最大边
            if (startEl.y + startEl.height > endEl.y + endEl.height) {
                linesCollect.maxY = startEl.y + startEl.height
            } else {
                linesCollect.maxY = endEl.y + endEl.height
            }

            // x方向的最小边
            if (startEl.x < endEl.x) {
                linesCollect.minX = startEl.x
                minWidth = startEl.width
            } else {
                linesCollect.minX = endEl.x
                minWidth = endEl.width
            }

            // x方向的最大边
            if (startEl.x + startEl.width > endEl.x + endEl.width) {
                linesCollect.maxX = startEl.x + startEl.width
            } else {
                linesCollect.maxX = endEl.x + endEl.width
            }

            linesCollect.midX = Math.abs(((endEl.x + endEl.width / 2) - (startEl.x + startEl.width / 2)) / 2) + linesCollect.minX + minWidth / 2
            linesCollect.midY = Math.abs(((endEl.y + endEl.height /2) - (startEl.y + startEl.height / 2)) / 2) + linesCollect.minY + minHeight / 2

            linesCollect.minX = linesCollect.minX - this.minLen
            linesCollect.maxX = linesCollect.maxX + this.minLen
            linesCollect.minY = linesCollect.minY - this.minLen
            linesCollect.maxY = linesCollect.maxY + this.minLen
            return  {
                        ...linesCollect, 
                        x: [linesCollect.minX, linesCollect.midX, linesCollect.maxX], 
                        y: [linesCollect.minY, linesCollect.midY, linesCollect.maxY]
                    }
        },
        // 给定点坐标及点的初始方向与线的集合以及中点(控制转向)，计算与集合的交点
        calIntersection (node, midNode, linesCollect) {
            // 当前节点的方向
            let nodeDirection = xyDirections[node.position],
                // 垂直于节点的方向
                hDirection = nodeDirection === 'x' ? 'y' : 'x'
            // 在集合中取垂直的
            let currentCollect = linesCollect[nodeDirection]
            // 只要在线上的集合
            let onlineCollect = currentCollect.filter(item => {
                return this.isNodeInLine({[hDirection]: node[hDirection], [nodeDirection]: item}, node)
            })

            let minCollect = null,
                position = null

            // 取最近的点
            switch (node.position) {
                case directions.top:
                    minCollect = this.maxValInArr(onlineCollect)
                    position = node.x < midNode.x ? directions.right : directions.left
                    break
                case directions.bottom:
                    minCollect = this.minValInArr(onlineCollect)
                    position = node.x < midNode.x ? directions.right : directions.left
                    break
                case directions.left:
                    minCollect = this.maxValInArr(onlineCollect)
                    position = node.y > midNode.y ? directions.top : directions.bottom
                    break
                case directions.right:
                    minCollect = this.minValInArr(onlineCollect)
                    position = node.y > midNode.y ? directions.top : directions.bottom
                    break
            }
            return {
                    [hDirection]: node[hDirection],
                    [nodeDirection]: minCollect,
                    position
                }
        },
        // 两个点是否同线 不判断方向
        isSameLine (node1, node2) {
            return node1.x === node2.x || node1.y === node2.y
        },
        // 点是否在线上 判断方向
        isNodeInLine (node, line) {
            // 不在一条线上
            if (node.x !== line.x && node.y !== line.y) {
                return false
            }
            switch (line.position) {
                case directions.left:
                    return node.x < line.x
                case directions.right:
                    return node.x > line.x
                case directions.top:
                    return node.y < line.y
                case directions.bottom:
                    return node.y > line.y
                default:
                    throw new Error(`不支持的方向类型 ${lien.position}`) 
            }
        },
        // 两个点的交点
        calIntersectionByTwoPoints (node1, node2) {
            // 平行无交点
            if (xyDirections[node1.position] === xyDirections[node2.position]) {
                return null
            }

            let xNode = null,
                yNode = null
            if (xyDirections[node1.position] === 'x') {
                xNode = node1
                yNode = node2
            } else {
                xNode = node2
                yNode = node1
            }
            
            // 交点
            let intersection = {
                x: xNode.x,
                y: yNode.y
            }

            if (this.isNodeInLine(intersection, xNode) && this.isNodeInLine(intersection, yNode)) {
                // 有交点
                return intersection
            } else {
                // 交点不在线上(反向)
                return null
            }
        },
        minValInArr (arr) {
            return Math.min.apply({}, arr)
        },
        maxValInArr (arr) {
            return Math.max.apply({}, arr)
        }
    },
    mounted () {
        this.init()
    }
}
</script>
<style scoped>
#diagram {
    border: 1px solid seagreen;
    width: 1200px;
    height: 800px;
}
</style>
