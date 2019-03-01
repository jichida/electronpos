import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Stage, Layer } from 'react-konva'
import lodashmap from 'lodash.map'
import lodashset from 'lodash.set'
import { Button } from 'antd'
import Konva from 'konva'
import qr from 'qr-image'
import './index.less'
import { posprinter_savetemplate } from '../../actions';

const step = 20
const barcode_data = 'M910.613 200.188H1024V823.81H910.613zM540.613 200.188H654V823.81H540.613zM0 200.188h56.693V823.81H0zM84.173 200.188h28.347V823.81H84.173zM144.173 200.188h28.347V823.81h-28.347zM206.173 200.188h28.347V823.81h-28.347zM361.653 200.188H390V823.81h-28.347zM421.653 200.188H450V823.81h-28.347zM483.653 200.188H512V823.81h-28.347zM691.653 200.188H720V823.81h-28.347zM753.653 200.188H782V823.81h-28.347zM262 200.188h56.693V823.81H262zM814 200.188h56.693V823.81H814z'

const priceGroup = ['原价', '折扣价', '会员价', '数量']

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
            activeNode: '',
            nodes: this.props.billnodes
        }
    }

    componentDidMount() {
        this.initTemplate(this.props.billnodes)
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
        return {
            newx,
            newy
        }
    }

    createQR = (pos) => {
        const { newx, newy } = this.RoundPosition(pos)
        const qrcode =  qr.svgObject('票据模板',
            {  ec_level: 'L',
                type: 'svg'
            }
        )
        const node = {
            id: this.state.datatrans,
            type: 'Path',
            x: newx,
            y: newy,
            data: qrcode.path,
            fill: 'black',
            rotation: 0,
            scale: {
                x : 4,
                y : 4
            }
        }
        let nodes = {...this.state.nodes}
        nodes[this.state.datatrans] = {...node}
        this.setState({nodes})

        return node
    }

    createBarcode = (pos) => {
        const { newx, newy } = this.RoundPosition(pos)
        const node = {
            id: this.state.datatrans,
            type: 'Path',
            x: newx,
            y: newy,
            data: barcode_data,
            fill: 'black',
            rotation: 0,
            scale: {
                x : 0.1,
                y : 0.1
            }
        }
        let nodes = {...this.state.nodes}
        nodes[this.state.datatrans] = {...node}
        this.setState({nodes})

        return node
    }

    createText = (pos) => {
        const { newx, newy } = this.RoundPosition(pos)
        const { datatrans } = this.state
        const node = {
            id: datatrans,
            type: 'Text',
            text: datatrans,
            x: newx,
            y: newy,
            rotation: 0,
            fontSize: 14
        }
        console.log('Create Text: ', node)
        let nodes = {...this.state.nodes}
        nodes[datatrans] = {...node}
        this.setState({nodes})

        return node
    }

    createGroupText = (pos) => {
        const { newx, newy } = this.RoundPosition(pos)
        let nodes = {...this.state.nodes}
        const nodeTemplate = {
            type: 'Text',
            y: newy,
            rotation: 0,
            fontSize: 14
        }

        const node1 = { ...nodeTemplate, id: '原价', text: '原价', x: newx }
        nodes[node1.id] = {...node1}
        const node2 = { ...nodeTemplate, id: '会员价', text: '会员价', x: newx + 100  }
        nodes[node2.id] = {...node2}
        const node3 = { ...nodeTemplate, id: '折扣价', text: '折扣价', x: newx + 200 }
        nodes[node3.id] = {...node3}
        const node4 = { ...nodeTemplate, id: '数量', text: '数量', x: newx + 300 }
        nodes[node4.id] = {...node4}

        this.setState({
            nodes,
            datatrans: '数量'
        })

        return [node1, node2, node3, node4]
    }

    handleDrop = (e)=>{
        e.preventDefault()
        if(!this.state.nodes[this.state.datatrans]){

            const stage = this.stage.current
            stage._setPointerPosition(e)
            const position = stage.getPointerPosition()

            if(this.state.datatrans === '二维码'){
                this.initImage(this.createQR(position))
            } else if(this.state.datatrans === '条形码') {
                this.initImage(this.createBarcode(position))
            } else {
                if(this.state.datatrans === '价格') {
                    const textArray = this.createGroupText(position)
                    lodashmap(textArray, (text) => {
                        this.initText(text)
                    })
                }  else {
                    console.log('initText...')
                    this.initText(this.createText(position))
                }
            }
        }
    }

    initTemplate = (template) => {
        lodashmap(template, (v, k) =>{
            if(k === '二维码' || k === '条形码'){
                this.initImage(v)
            } else {
                this.initText(v)
            }
        })
        
    }

    initText = (node) => {
        console.log('Init Text: ', node)
        const layer = this.layer.current

        const text = new Konva.Text({
            ...node,
            draggable: true,
            dragBoundFunc: function(pos) {
                return {
                    x: Math.round(pos.x/step)*step,
                    y: Math.round(pos.y/step)*step
                }
            }
        })
        text.on('click tap', (e) => {
            this.setState({
                datatrans: e.target.attrs.id
            })
        })
        text.on('mousedown touchstar', (e) => {
            this.setState({
                datatrans: e.target.attrs.id,
            })
        })
        text.on('dragend', (e) => {
            const {id, x, y} = e.target.attrs
            let nodes = {...this.state.nodes}
            if(x < 0 || y < 0 || x > this.state.canvasWidth || y > this.state.canvasHeight) {
                delete nodes[id]
                this.setState({
                    nodes
                })
                text.destroy()
                layer.draw()
            } else {
                if(priceGroup.includes(id)){
                    console.log('Price Group Dragend...')
                    lodashmap(priceGroup, (nodeName)=>{
                        let node = this.stage.current.findOne(`#${nodeName}`)
                        node.setAttr('y', y)
                        nodes[nodeName] = {...nodes[nodeName], y}
                    })
                    layer.draw()
                }
                const current = {...nodes[id], x, y}
                nodes[id] = {...current}
                this.setState({
                    nodes
                })
            }
        })

        layer.add(text)
        layer.draw()
    }

    initImage = (node) => {
        const layer = this.layer.current
        console.log('Path Node:', node)
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
        // this.props.dispatch(posprinter_savetemplate({billnodes:this.state.nodes}));
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
            if(priceGroup.includes(this.state.datatrans)&&id!=='x') {
                let nodes = {...this.state.nodes}
                lodashmap(priceGroup, (nodeName) => {
                    let node = this.stage.current.findOne(`#${nodeName}`)
                    node.setAttr(id, value)
                    lodashset(nodes, `${nodeName}.${id}`, value)
                })
                this.setState({nodes})
            } else {
                sharp.setAttr(id, value)
            }
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
            <div className="template">
                <p className="tip">拖动票据项目至右边区域！(拖动项目至画框外可移除项目)</p>
                <div className="main-container">
                    <div className="tools-container">
                        <div className="tools">
                            <span className="tools-item" draggable onDragStart={(e)=>this.handleDragStart('品名',e)} onTouchStart ={(e)=>this.handleDragStart('品名', e)}>品名</span>
                            <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('单位')}>单位</span>
                            <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('价格')}>价格信息</span>
                            {/* <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('会员价')}>会员价</span>
                            <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('折扣价')}>折扣价</span> */}
                            <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('日期')} onTouchStart ={(e)=>this.handleDragStart('日期', e)}>日期</span>
                            <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('规格')}>规格</span>
                            <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('自定义')}>自定义</span>
                            <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('条形码')}>条形码</span>
                            {/* <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('数量')}>数量</span> */}
                            <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('库存')}>库存</span>
                            <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('总价')}>总价</span>
                            <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('店名')}>店名</span>
                            <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('产地')}  onTouchStart ={(e)=>this.handleDragStart('产地', e)}>产地</span>
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
const mapStateToProps =  ({posprinter:{billnodes}}) =>{
  return {billnodes};
};
Index = connect(mapStateToProps)(Index);
export default Index
