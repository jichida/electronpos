import React, { Component } from 'react'
import { Stage, Layer } from 'react-konva'
import lodashmap from 'lodash.map'
import { Button } from 'antd'
import Konva from 'konva'
import qr from 'qr-image'
import './index.less'
import img from './pig.jpg'

const step = 20

class Index extends Component {
    constructor(props) {
        super(props);
        this.containerRef = React.createRef()
        this.stage = React.createRef()
        this.layer = React.createRef()
        this.state = {
            canvasWidth: 500,
            canvasHeight: 500,
            datatrans: '',
            nodes: {}
        }
    }

    handleDragStart = (name, e)=>{
        this.setState({
            datatrans: name
        })
    }

    handleDragOver = (e) => {
        e.preventDefault()
    }

    RoundPosition = ({x, y}) => {
        const newx = Math.round(x/step)*step
        const newy = Math.round(y/step)*step
        console.log(newx)
        console.log(newy)
        return {
            newx,
            newy
        }
    }

    handleDrop = (e)=>{
        e.preventDefault()
        console.log(this.state.nodes)
        if(!this.state.nodes[this.state.datatrans]){
            const nodes = this.state.nodes
            nodes[this.state.datatrans] = true
            this.setState({
                nodes
            })

            const stage = this.stage.current
            stage._setPointerPosition(e);
            const position = stage.getPointerPosition()
            if(this.state.datatrans === '二维码'){
                this.drawImage(position)
            } else {
                this.drawText(position)
            }
        }
    }

    drawText = (position) => {
        const newPosition = this.RoundPosition(position)
        const layer = this.layer.current

        const  group = new Konva.Group({
            id: this.state.datatrans,
            draggable: true,
            dragBoundFunc: function(pos) {
                return {
                    x: Math.round(pos.x/step)*step,
                    y: Math.round(pos.y/step)*step
                }
            }
        })

        group.on("dblclick dbltap", () => {
            const nodes = this.state.nodes
            if(group.getChildren().length>2){
                nodes['价格'] = false
            } else {
                nodes[group.getChildren()[1].attrs.id] = false
            }
            this.setState({nodes})
            console.log(this.state.nodes)
            group.destroy();
            layer.draw();
        })
        group.on("mouseover", () => {
            document.body.style.cursor = "pointer";
        })
        group.on("mouseout", () => {
            document.body.style.cursor = "default";
        })

        if(this.state.datatrans === '价格') {
            const org = new Konva.Text({
                id: '原价',
                x: newPosition.newx,
                y: newPosition.newy,
                fontSize: 12,
                text: '原价',
                width: 100,
                padding: 10,
                align: 'center'
            })
            console.log(org.getPosition().x)

            const mem = new Konva.Text({
                id: '会员价',
                x: org.getPosition().x + this.layer.current.getWidth()/4,
                y: newPosition.newy,
                fontSize: 12,
                text: '会员价',
                width: 100,
                padding: 10,
                align: 'center'
            })
            console.log(mem.getPosition().x)

            const discount = new Konva.Text({
                id: '折扣价',
                x: mem.getPosition().x + this.layer.current.getWidth()/4,
                y: newPosition.newy,
                fontSize: 12,
                text: '折扣价',
                width: 100,
                padding: 10,
                align: 'center'
            })
            console.log(discount.getPosition().x)

            const unit = new Konva.Text({
                id: '数量',
                x: discount.getPosition().x + this.layer.current.getWidth()/4,
                y: newPosition.newy,
                fontSize: 12,
                text: '数量',
                width: 100,
                padding: 10,
                align: 'center'
            })
            console.log(unit.getPosition().x)

            const rect = new Konva.Rect({
                x: newPosition.newx,
                y: newPosition.newy,
                stroke: '#555',
                strokeWidth: 1,
                fill: '#ddd',
                width: this.layer.current.getWidth(),
                height: org.getHeight(),
                shadowColor: 'black',
                shadowBlur: 10,
                shadowOffset: [10, 10],
                shadowOpacity: 0.2,
                cornerRadius: 5,
            })
            group.add(rect)
            group.add(org)
            group.add(mem)
            group.add(discount)
            group.add(unit)
            

        } else {

            const text = new Konva.Text({
                id: this.state.datatrans,
                x: newPosition.newx,
                y: newPosition.newy,
                fontSize: 12,
                text: this.state.datatrans,
                width: 100,
                padding: 10,
                align: this.state.datatrans === '单位' ? 'center' : 'left'
            })

            const rect = new Konva.Rect({
                x: newPosition.newx,
                y: newPosition.newy,
                stroke: '#555',
                strokeWidth: 1,
                fill: '#ddd',
                width: text.getWidth(),
                height: text.getHeight(),
                shadowColor: 'black',
                shadowBlur: 10,
                shadowOffset: [10, 10],
                shadowOpacity: 0.2,
                cornerRadius: 5,
            });

            group.add(rect)
            group.add(text)

        }

        this.layer.current.add(group)
        this.layer.current.draw()
    }

    drawImage = (position) => {
        console.log(position)
        const newPosition = this.RoundPosition(position)
        console.log(newPosition)

        const layer = this.layer.current
        const qrcode =  qr.svgObject('票据模板', 
            {  ec_level: 'L',
                type: 'svg'
            }
        )
        const path = new Konva.Path({
            id: this.state.datatrans,
            x: position.x,
            y: position.y,
            width: 130,
            height: 130,
            data: qrcode.path,
            fill: 'black',
            draggable: true,
            scale: {
              x : 4,
              y : 4
            },
            dragBoundFunc: function(pos) {
                return {
                    x: Math.round(pos.x/step)*step,
                    y: Math.round(pos.y/step)*step
                }
            }
        })

        path.on("dblclick dbltap", () => {
            const nodes = this.state.nodes
            nodes[path.attrs.id] = false
            this.setState({nodes})
            path.destroy();
            layer.draw();
        })
        path.on("mouseover", () =>{
            document.body.style.cursor = "pointer";
        })
        path.on("mouseout", () =>{
            document.body.style.cursor = "default";
        })

        layer.add(path)
        layer.draw()
    }

    handleSave = () => {
        const children = this.layer.current.getChildren()
        console.log('Layer Children: ')
        console.log(children)
        const nodes = {}
        lodashmap(children, (item)=>{
            if(item.nodeType === 'Group'){
                lodashmap(item.children, (child)=>{
                    if(child.className === 'Text'){
                        let childNode = {
                            id: child.attrs.id,
                            type: child.className,
                            text: child.attrs.text,
                            x: child.attrs.x,
                            y: child.attrs.y,
                            width: child.attrs.width,
                            height: child.getHeight(),
                            align: child.attrs.align,
                            fontSize: child.attrs.fontSize
                        }
                        item.attrs.x && (childNode.x = childNode.x + item.attrs.x)
                        item.attrs.y && (childNode.y = childNode.y + item.attrs.y)

                        nodes[childNode.id] = childNode
                    }
                })

            } else if( item.nodeType === 'Shape'&& item.className === 'Path'){
                let node = {
                    id: item.attrs.id,
                    type: item.className,
                    x: Math.round(item.attrs.x/step)*step,
                    y: Math.round(item.attrs.y/step)*step,
                    width: item.attrs.width,
                    height: item.attrs.height
                }
                nodes[node.id] = node
            }
        })
        console.log('Nodes: ')
        console.log(nodes)
    }

    render() {
        return (
            <div className="template">
                <p className="tip">拖动票据项目至右边区域！(双击可移除项目)</p>
                <div className="main-container">
                    <div className="tools">
                        <span className="tools-item" draggable onDragStart={(e)=>this.handleDragStart('品名',e)}>品名</span>
                        <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('单位')}>单位</span>
                        <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('价格')}>价格信息</span>
                        {/* <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('会员价')}>会员价</span>
                        <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('折扣价')}>折扣价</span> */}
                        <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('日期')}>日期</span>
                        <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('规格')}>规格</span>
                        <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('自定义')}>自定义</span>
                        <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('条码')}>条码</span>
                        {/* <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('数量')}>数量</span> */}
                        <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('库存')}>库存</span>
                        <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('总价')}>总价</span>
                        <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('店名')}>店名</span>
                        <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('产地')}>产地</span>
                        <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('二维码')}>二维码</span>
                    </div>
                    <div className="container" ref={this.containerRef} onDragOver={this.handleDragOver} onDrop={this.handleDrop}>
                        <Stage width={this.state.canvasWidth} height={this.state.canvasHeight} 
                            ref={this.stage}
                            style={{backgroundColor: '#ddd'}}
                        >
                            <Layer ref={this.layer} />
                        </Stage>
                    </div>
                </div>
                <div className="submit-zone">
                    <Button type="primary" onClick={this.handleSave}>保存</Button>
                    <Button>取消</Button>
                </div>
            </div>
        )
    }
}

export default Index