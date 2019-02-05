import React, { Component } from 'react'
import { Stage, Layer } from 'react-konva'
import lodashmap from 'lodash.map'
import { Button } from 'antd'
import Konva from 'konva'
import './index.less'
import img from './pig.jpg'

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
            nodes: []
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

    handleDrop = (e)=>{
        e.preventDefault()
        if(!this.state.nodes.some( el => el === this.state.datatrans)){
            const nodes = this.state.nodes
            nodes.push(this.state.datatrans)

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
        const text = new Konva.Text({
            x: position.x,
            y: position.y,
            fontSize: 12,
            text: this.state.datatrans,
            width: 250,
            padding: 10,
            // draggable: true,
        })

        const rect = new Konva.Rect({
            x: position.x,
            y: position.y,
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
            // draggable: true,
          });

        const  group = new Konva.Group({
            id: this.state.datatrans,
            draggable: true
        });

        group.add(rect)
        group.add(text)

        this.layer.current.add(group)
        
        // this.layer.current.add(rect)
        // this.layer.current.add(text)
        this.layer.current.draw()
    }

    drawImage = (position) => {
        const layer = this.layer.current
        Konva.Image.fromURL(img, function (image) {
            layer.add(image)
            image.position(position)
            image.width(130)
            image.height(130)
            image.draggable(true)
            layer.draw()
        })
    }

    handleSave = () => {
        // const layerJSON = this.layer.current.toJSON()
        // console.log(layerJSON)
        
        const children = this.layer.current.getChildren()
        console.log('Layer Children: ')
        console.log(children)
        const nodes = []
        lodashmap(children, (item)=>{
            // const node = {
            //     type: item.className,
            //     text: item.attrs.text,
            //     x: item.attrs.x,
            //     y: item.attrs.y,
            //     width: item.attrs.width
            // }
            let node = {}
            if(item.nodeType === 'Group'){
                console.log(item.attrs.x)
                node = {
                    type: item.children[1].className,
                    text: item.children[1].attrs.text,
                    x: item.children[1].attrs.x,
                    y: item.children[1].attrs.y,
                    width: item.children[1].attrs.width,
                    fontSize: item.children[1].attrs.fontSize
                }
                item.attrs.x && (node.x = node.x + item.attrs.x)
                item.attrs.y && (node.y = node.y + item.attrs.y)
            } else if( item.nodeType === 'Shape'&& item.className === 'Image'){
                node = {
                    type: item.className,
                    text: item.attrs.text,
                    x: item.attrs.x,
                    y: item.attrs.y,
                    width: item.attrs.width
                }
            }
            nodes.push(node)
        })
        console.log('Nodes: ')
        console.log(nodes)
    }

    render() {
        return (
            <div className="template">
                <p className="tip">拖动票据项目至右边区域！</p>
                <div className="main-container">
                    <div className="tools">
                        <span className="tools-item" draggable onDragStart={(e)=>this.handleDragStart('品名',e)}>品名</span>
                        <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('单位')}>单位</span>
                        <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('原价')}>原价</span>
                        <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('会员价')}>会员价</span>
                        <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('折扣价')}>折扣价</span>
                        <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('日期')}>日期</span>
                        <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('规格')}>规格</span>
                        <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('自定义')}>自定义</span>
                        <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('条码')}>条码</span>
                        <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('数量')}>数量</span>
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