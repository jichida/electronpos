import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Stage, Layer } from 'react-konva'
import lodashmap from 'lodash.map'
import { Button } from 'antd'
import Konva from 'konva'
import qr from 'qr-image'
import './index.less'
import {posprinter_savetemplate} from '../../actions';

const barcode_data = 'M910.613 200.188H1024V823.81H910.613zM540.613 200.188H654V823.81H540.613zM0 200.188h56.693V823.81H0zM84.173 200.188h28.347V823.81H84.173zM144.173 200.188h28.347V823.81h-28.347zM206.173 200.188h28.347V823.81h-28.347zM361.653 200.188H390V823.81h-28.347zM421.653 200.188H450V823.81h-28.347zM483.653 200.188H512V823.81h-28.347zM691.653 200.188H720V823.81h-28.347zM753.653 200.188H782V823.81h-28.347zM262 200.188h56.693V823.81H262zM814 200.188h56.693V823.81H814z'
const step = 20

class Index extends Component {
    constructor(props) {
        super(props);
        this.containerRef = React.createRef()
        this.stage = React.createRef()
        this.layer = React.createRef()
        this.svg = React.createRef()
        this.state = {
            canvasWidth: 500,
            canvasHeight: 500,
            datatrans: '',
            nodes: this.props.tagnodes,
        }
    }

    componentDidMount() {
        this.initTemplate(this.props.tagnodes)

        // JsBarcode(this._barcodeSVG, 'Bar Code', {
        //     displayValue: false,
        //     width: 1.5,
        //     height: 50,
        //     margin: 0,
        // })
    }

    initTemplate = (template) => {
        lodashmap(template, (v, k) =>{
            if(k === '二维码'){
                this.drawImage(v)
            } else {
                this.drawText(v)
            }
        })
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
        if(!this.state.nodes[this.state.datatrans]){

            const stage = this.stage.current
            stage._setPointerPosition(e)
            const {newx, newy} = this.RoundPosition(stage.getPointerPosition())
            let currentNode = {
                id: this.state.datatrans,
                x: newx,
                y: newy,
                rotation: 0
            }

            const nodes = {...this.state.nodes}
            if(this.state.datatrans === '二维码'){
                const qrcode =  qr.svgObject('票据模板',
                    {  ec_level: 'L',
                        type: 'svg'
                    }
                )

                currentNode = {
                    ...currentNode,
                    data: qrcode.path,
                    fill: 'black',
                    type: "Path",
                    scale: {
                        x : 4,
                        y : 4
                    }
                }                
                nodes[this.state.datatrans] = { ...currentNode}
                this.setState({ nodes })
                this.drawImage(currentNode)
            } else if(this.state.datatrans === '条形码') {
                currentNode = {
                    ...currentNode,
                    data: barcode_data,
                    fill: 'black',
                    type: "Text",
                    scale: {
                        x : 0.1,
                        y : 0.1
                    }
                }                
                nodes[this.state.datatrans] = { ...currentNode}
                this.setState({ nodes })
                this.drawImage(currentNode)
            } else {
                currentNode = {
                    ...currentNode,
                    fontSize: 12,
                    text: this.state.datatrans,
                }                
                nodes[this.state.datatrans] = { ...currentNode}
                this.setState({ nodes })
                this.drawText(currentNode)
            }
        }
    }

    drawText = (node) => {
        const layer = this.layer.current

        const textNode = new Konva.Text({
            ...node,
            draggable: true,
            dragBoundFunc: function(pos) {
                return {
                    x: Math.round(pos.x/step)*step,
                    y: Math.round(pos.y/step)*step
                }
            }
        })
        textNode.on('click tap', (e) => {
            this.setState({
                datatrans: e.target.attrs.id
            })
        })
        textNode.on('mousedown touchstar', (e) => {
            this.setState({
                datatrans: e.target.attrs.id,
            })
        })
        textNode.on('dragend', (e) => {
            const {id, x, y} = e.target.attrs
            let nodes = {...this.state.nodes}
            if(x < 0 || y < 0 || x > this.state.canvasWidth || y > this.state.canvasHeight) {
                delete nodes[id]
                this.setState({
                    nodes
                })
                textNode.destroy()
                layer.draw()
            } else {
                const current = {...nodes[id], x, y}
                nodes[id] = {...current}
                this.setState({
                    nodes
                })
            }
        })
        layer.add(textNode)
        layer.draw()
    }

    drawImage = (node) => {
        const layer = this.layer.current

        const path = new Konva.Path({
            ...node,
            draggable: true,
            dragBoundFunc: function(pos) {
                return {
                    x: Math.round(pos.x/step)*step,
                    y: Math.round(pos.y/step)*step
                }
            }
        })

        path.on('click tap', (e) => {
            this.setState({
                datatrans: e.target.attrs.id
            })
        })
        path.on('mousedown touchstar', (e) => {
            this.setState({
                datatrans: e.target.attrs.id,
            })
        })
        path.on('dragend', (e) => {
            const {id, x, y} = e.target.attrs
            let nodes = {...this.state.nodes}
            if(x < 0 || y < 0 || x > this.state.canvasWidth || y > this.state.canvasHeight) {
                console.log('超出边界...')
                delete nodes[id]
                this.setState({
                    nodes
                })
                path.destroy()
                layer.draw()
            } else {
                const current = {...nodes[id], x, y}
                nodes[id] = {...current}
                this.setState({
                    nodes
                })
            }
        })

        layer.add(path)
        layer.draw()
    }


    handleSave = () => {
        console.log(this.state.nodes)
        // this.props.dispatch(posprinter_savetemplate({tagnodes: this.state.nodes}));
    }

    UpdateCavas = ( id, value ) => {
        const layer = this.layer.current
        const sharp =  this.stage.current.findOne(`#${this.state.datatrans}`) //node.absolutePosition
        
        if(id === 'scale') {
            sharp.setAttr(id, {
                    x: value,
                    y: value
                }
            )
        } else {
            sharp.setAttr(id, value)
        }
        
        layer.draw()
        console.log('Layer: ', layer)
    }

    handleChange = (name, e) => {
        if(!!this.state.nodes[this.state.datatrans]) {
            const value = parseFloat(e.target.value) ? parseFloat(e.target.value) : 0 
            if(name === 'x') {
                if( value < 0 || value > this.state.canvasWidth) {
                    return
                }
            }
            if(name === 'y') {
                if( value < 0 || value > this.state.canvasHeight) {
                    return
                }
            }
            const nodes = this.state.nodes
            const node = { ...nodes[this.state.datatrans]}
            if(name === 'scale') {
                node[name] = {
                    x: value,
                    y: value
                }
            } else {
                node[name] = value
            }
            
            nodes[this.state.datatrans] = {...node}
            this.setState({
                nodes
            })
            console.log('Node: ', node)
            this.UpdateCavas(name, value)
           
        }
    }

    render() {
        return (
            <div className="tag-template">
                <p className="tip">拖动票据项目至右边区域！(拖至画框外可移除项目)</p>
                <div className="main-container">
                    <div className="tools-container">
                        <div className="tools">
                            <span className="tools-item" draggable onDragStart={(e)=>this.handleDragStart('品名',e)}>品名</span>
                            <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('单位')}>单位</span>
                            <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('原价')}>原价</span>
                            <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('会员价')}>会员价</span>
                            <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('折扣价')}>折扣价</span>
                            <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('日期')}>日期</span>
                            <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('规格')}>规格</span>
                            <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('自定义')}>自定义</span>
                            <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('条形码')}>条形码</span>
                            <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('数量')}>数量</span>
                            <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('库存')}>库存</span>
                            <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('总价')}>总价</span>
                            <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('店名')}>店名</span>
                            <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('产地')}>产地</span>
                            <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('二维码')}>二维码</span>
                        </div>
                        <div className="item-control">
                            <div className="control">
                                <div className="title">X坐标：</div>
                                <div className="input-control">
                                    <input 
                                        value={this.state.nodes[this.state.datatrans] ? this.state.nodes[this.state.datatrans].x: ''} 
                                        onChange={(e)=>this.handleChange('x', e)} 
                                    />
                                </div>
                            </div>
                            <div className="control">
                                <div className="title">Y坐标：</div>
                                <div className="input-control">
                                    <input 
                                        value={this.state.nodes[this.state.datatrans] ? this.state.nodes[this.state.datatrans].y: ''} 
                                        onChange={(e)=>this.handleChange('y', e)} 
                                    />
                                </div>
                            </div>
                            <div className="control">
                                <div className="title">旋转：</div>
                                <div className="input-control">
                                    <input 
                                        value={this.state.nodes[this.state.datatrans] ? this.state.nodes[this.state.datatrans].rotation: ''} 
                                        onChange={(e)=>this.handleChange('rotation', e)} 
                                    />
                                </div>
                            </div>
                            { (this.state.datatrans !== '二维码' && this.state.datatrans !== '条形码') ?
                                    <div className="control">
                                        <div className="title">字体：</div>
                                        <div className="input-control">
                                            <input 
                                                value={this.state.nodes[this.state.datatrans] ? this.state.nodes[this.state.datatrans].fontSize: ''} 
                                                onChange={(e)=>this.handleChange('fontSize', e)} 
                                            />
                                        </div>
                                    </div>
                                :
                                    <div className="control">
                                        <div className="title">大小：</div>
                                        <div className="input-control">
                                            <input 
                                                value={this.state.nodes[this.state.datatrans] ? this.state.nodes[this.state.datatrans].scale.x: ''} 
                                                onChange={(e)=>this.handleChange('scale', e)} 
                                            />
                                        </div>
                                    </div>                            
                            }
                            {/* <div className="control">
                                <div className="title">条形码：</div>
                                <div className="input-control">
                                    <svg ref={(ref)=>this._barcodeSVG = ref} ></svg>
                                </div>
                            </div> */}
                        </div>
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

// const templateData = {
//     二维码:{
//         data: "M1 1h7v7h-7zM9 1h2v2h-1v-1h-1zM13 1h1v3h-1zM15 1h7v7h-7zM2 2v5h5v-5zM16 2v5h5v-5zM3 3h3v3h-3zM9 3h1v2h2v1h-3zM11 3h1v1h-1zM17 3h3v3h-3zM12 4h1v1h-1zM9 7h1v1h-1zM11 7h1v3h-1v-1h-1v-1h1zM13 7h1v1h-1zM1 9h4v1h2v1h1v1h-1v1h1v1h-2v-1h-1v1h-2v-3h1v1h2v-1h-2v-1h-1v1h-2zM7 9h1v1h-1zM9 9h1v3h-1zM14 9h1v1h-1zM17 9h3v2h-2v1h-1v-1h-1v4h-1v-2h-2v-3h1v2h1v-2h2zM21 9h1v2h-1zM11 11h1v1h-1zM10 12h1v1h-1zM19 12h1v1h-1zM21 12h1v1h-1zM11 13h2v2h-1v-1h-1zM20 13h1v1h-1zM9 14h2v3h-1v-2h-1zM17 14h3v1h-3zM1 15h7v7h-7zM16 15h1v1h2v1h2v2h-1v-1h-1v1h-1v-1h-2v-1h-2v-1h2zM21 15h1v1h-1zM2 16v5h5v-5zM12 16h1v1h-1zM3 17h3v3h-3zM11 17h1v1h1v-1h1v2h-3zM9 18h1v4h-1zM15 19h3v1h-1v2h-1v-2h-1zM18 20h2v1h-2zM21 20h1v1h-1zM11 21h3v1h-3z",
//         fill: "black",
//         id: "二维码",
//         rotation: 0,
//         scale: {x: 4, y: 4},
//         x: 160,
//         y: 60,
//     },
//     价格:{
//         fontSize: 18,
//         id: "价格",
//         rotation: 0,
//         text: "价格",
//         x: 190,
//         y: 160,
//     },
//     品名:{
//         fontSize: 22,
//         id: "品名",
//         rotation: 0,
//         text: "品名",
//         x: 190,
//         y: 40,
//     }
// }
const mapStateToProps =  ({posprinter:{tagnodes}}) =>{
    return {tagnodes};
};
Index = connect(mapStateToProps)(Index);
export default Index
