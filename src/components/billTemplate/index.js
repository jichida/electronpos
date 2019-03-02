import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Stage, Layer } from 'react-konva'
import lodashmap from 'lodash.map'
import lodashset from 'lodash.set'
import { Button, Select, Switch } from 'antd'
import Konva from 'konva'
import qr from 'qr-image'
import renderPrintTemplate from './renderPrintTemplate'
import './index.less'
import { posprinter_savetemplate } from '../../actions';

const Option = Select.Option;

class Index extends Component {
    constructor(props) {
        super(props);
        this.containerRef = React.createRef()
        this.stage = React.createRef()
        this.layer = React.createRef()
        this.state = {
            canvasWidth: 400,
            canvasHeight: 500,
            datatrans: '',
            nodes: this.props.billnodes
        }
    }

    componentDidMount() {
        this.initTemplate(this.props.billnodes)
        console.log('Current Layer: ', this.layer.current)
    }

    // handleDragStart = (name, e)=>{
    //     this.setState({
    //         datatrans: name
    //     })
    // }

    // handleDragOver = (e) => {
    //     e.preventDefault()
    // }

    // RoundPosition = ({x, y}) => {
    //     const newx = Math.round(x/step)*step
    //     const newy = Math.round(y/step)*step
    //     return {
    //         newx,
    //         newy
    //     }
    // }

    // createQR = (pos) => {
    //     const { newx, newy } = this.RoundPosition(pos)
    //     const qrcode =  qr.svgObject('票据模板',
    //         {  ec_level: 'L',
    //             type: 'svg'
    //         }
    //     )
    //     const node = {
    //         id: this.state.datatrans,
    //         type: 'Path',
    //         x: newx,
    //         y: newy,
    //         data: qrcode.path,
    //         fill: 'black',
    //         rotation: 0,
    //         scale: {
    //             x : 4,
    //             y : 4
    //         }
    //     }
    //     let nodes = {...this.state.nodes}
    //     nodes[this.state.datatrans] = {...node}
    //     this.setState({nodes})

    //     return node
    // }

    // createBarcode = (pos) => {
    //     const { newx, newy } = this.RoundPosition(pos)
    //     const node = {
    //         id: this.state.datatrans,
    //         type: 'Path',
    //         x: newx,
    //         y: newy,
    //         data: barcode_data,
    //         fill: 'black',
    //         rotation: 0,
    //         scale: {
    //             x : 0.1,
    //             y : 0.1
    //         }
    //     }
    //     let nodes = {...this.state.nodes}
    //     nodes[this.state.datatrans] = {...node}
    //     this.setState({nodes})

    //     return node
    // }

    // createText = (pos) => {
    //     const { newx, newy } = this.RoundPosition(pos)
    //     const { datatrans } = this.state
    //     const node = {
    //         id: datatrans,
    //         type: 'Text',
    //         text: datatrans,
    //         x: newx,
    //         y: newy,
    //         rotation: 0,
    //         fontSize: 14
    //     }
    //     console.log('Create Text: ', node)
    //     let nodes = {...this.state.nodes}
    //     nodes[datatrans] = {...node}
    //     this.setState({nodes})

    //     return node
    // }

    // createGroupText = (pos) => {
    //     const { newx, newy } = this.RoundPosition(pos)
    //     let nodes = {...this.state.nodes}
    //     const nodeTemplate = {
    //         type: 'Text',
    //         y: newy,
    //         rotation: 0,
    //         fontSize: 14
    //     }

    //     const node1 = { ...nodeTemplate, id: '原价', text: '原价', x: newx }
    //     nodes[node1.id] = {...node1}
    //     const node2 = { ...nodeTemplate, id: '会员价', text: '会员价', x: newx + 100  }
    //     nodes[node2.id] = {...node2}
    //     const node3 = { ...nodeTemplate, id: '折扣价', text: '折扣价', x: newx + 200 }
    //     nodes[node3.id] = {...node3}
    //     const node4 = { ...nodeTemplate, id: '数量', text: '数量', x: newx + 300 }
    //     nodes[node4.id] = {...node4}

    //     this.setState({
    //         nodes,
    //         datatrans: '数量'
    //     })

    //     return [node1, node2, node3, node4]
    // }

    // handleDrop = (e)=>{
    //     e.preventDefault()
    //     if(!this.state.nodes[this.state.datatrans]){

    //         const stage = this.stage.current
    //         stage._setPointerPosition(e)
    //         const position = stage.getPointerPosition()

    //         if(this.state.datatrans === '二维码'){
    //             this.initImage(this.createQR(position))
    //         } else if(this.state.datatrans === '条形码') {
    //             this.initImage(this.createBarcode(position))
    //         } else {
    //             if(this.state.datatrans === '价格') {
    //                 const textArray = this.createGroupText(position)
    //                 lodashmap(textArray, (text) => {
    //                     this.initText(text)
    //                 })
    //             }  else {
    //                 console.log('initText...')
    //                 this.initText(this.createText(position))
    //             }
    //         }
    //     }
    // }

    initTemplate = (template) => {
        lodashmap(template, (v, k) =>{
            // if(k === '二维码' || k === '条形码'){
            //     this.initImage(v)
            // } else {
                this.initText(v)
            // }
        })
        
    }

    initText = (node) => {
        const layer = this.layer.current

        const text = new Konva.Text({
            ...node,
        })
        text.on('click tap', (e) => {
            this.setState({
                datatrans: e.target.attrs.id
            })
        })

        layer.add(text)
        layer.draw()
    }

    // initImage = (node) => {
    //     const layer = this.layer.current
    //     console.log('Path Node:', node)
    //     const path = new Konva.Path({
    //         ...node,
    //         draggable: true,
    //         dragBoundFunc: function(pos) {
    //             return {
    //                 x: Math.round(pos.x/step)*step,
    //                 y: Math.round(pos.y/step)*step
    //             }
    //         }
    //     })

    //     path.on('click tap', (e) => {
    //         this.setState({
    //             datatrans: e.target.attrs.id
    //         })
    //     })
    //     path.on('mousedown touchstar', (e) => {
    //         this.setState({
    //             datatrans: e.target.attrs.id,
    //         })
    //     })
    //     path.on('dragend', (e) => {
    //         const {id, x, y} = e.target.attrs
    //         let nodes = {...this.state.nodes}
    //         if(x < 0 || y < 0 || x > this.state.canvasWidth || y > this.state.canvasHeight) {
    //             delete nodes[id]
    //             this.setState({
    //                 nodes
    //             })
    //             path.destroy()
    //             layer.draw()
    //         } else {
    //             const current = {...nodes[id], x, y}
    //             nodes[id] = {...current}
    //             this.setState({
    //                 nodes
    //             })
    //         }
    //     })

    //     layer.add(path)
    //     layer.draw()
    // }


    handleSave = () => {
        console.log(this.state.nodes)
        const printTemplate = renderPrintTemplate(this.state.nodes)
        console.log(printTemplate)
        // this.props.dispatch(posprinter_savetemplate({billnodes:this.state.nodes}));
    }

    // UpdateCavas = ( id, value ) => {
    //     const layer = this.layer.current
    //     const sharp =  this.stage.current.findOne(`#${this.state.datatrans}`) //node.absolutePosition
        
    //     if(id === 'scale') {
    //         sharp.setAttr(id, {
    //                 x: value,
    //                 y: value
    //             }
    //         )
    //     } else {
    //         if(priceGroup.includes(this.state.datatrans)&&id!=='x') {
    //             let nodes = {...this.state.nodes}
    //             lodashmap(priceGroup, (nodeName) => {
    //                 let node = this.stage.current.findOne(`#${nodeName}`)
    //                 node.setAttr(id, value)
    //                 lodashset(nodes, `${nodeName}.${id}`, value)
    //             })
    //             this.setState({nodes})
    //         } else {
    //             sharp.setAttr(id, value)
    //         }
    //     }
        
    //     layer.draw()
    //     console.log('Layer: ', layer)
    // }

    handleChange = (name, value) => {
        if(!!this.state.nodes[this.state.datatrans]) {
            console.log('Switch Name: ', name)
            console.log('Switch value: ', value)
            const nodes = this.state.nodes
            const node = { ...nodes[this.state.datatrans]}
            node[name] = value
            nodes[this.state.datatrans] = {...node}
            this.setState({
                nodes
            })
            // this.UpdateCavas(name, value)
        }
    }

    handleInputChange = (name, e) => {
        if(!!this.state.nodes[this.state.datatrans]) {
            const nodes = this.state.nodes
            const node = { ...nodes[this.state.datatrans]}
            node[name] = e.target.value
            
            nodes[this.state.datatrans] = {...node}
            this.setState({
                nodes
            })
           
        }
    }


    render() {
        const OthersProps = () => (
            <React.Fragment>
                <div className="item-control">
                    <div className="control">
                        <div className="title">排列：</div>
                        <div className="input-control">
                            <Select 
                                style={{width: '100%', marginLeft: '5px', marginRight: '5px'}} 
                                value={this.state.nodes[this.state.datatrans] ? this.state.nodes[this.state.datatrans].align : ''} 
                                onChange={(value)=>this.handleChange('align', value)}
                            >
                                <Option value="LT">居左</Option>
                                <Option value="CT">居中</Option>
                                <Option value="RT">居右</Option>
                            </Select>
                        </div>
                    </div>
                    <div className="control">
                        <div className="title">字体：</div>
                        <div className="input-control">
                            <Select 
                                style={{width: '100%', marginLeft: '5px', marginRight: '5px'}} 
                                value={this.state.nodes[this.state.datatrans] ? this.state.nodes[this.state.datatrans].font: ''}
                                onChange={(value)=>this.handleChange('font', value)}
                            >
                                <Option value="A">A</Option>
                                <Option value="B">B</Option>
                            </Select>
                        </div>
                    </div>
                    <div className="control">
                        <div className="title">宽度：</div>
                        <div className="input-control">
                            <input 
                                value={this.state.nodes[this.state.datatrans] ? this.state.nodes[this.state.datatrans].fontwidth: ''} 
                                onChange={(e)=>this.handleInputChange('fontwidth', e)} 
                            />
                        </div>
                    </div>
                    <div className="control">
                        <div className="title">高度：</div>
                        <div className="input-control">
                            <input 
                                value={this.state.nodes[this.state.datatrans] ? this.state.nodes[this.state.datatrans].fontheight: ''} 
                                onChange={(e)=>this.handleInputChange('fontheight', e)} 
                            />
                        </div>
                    </div>
                    <div className="control">
                        <div className="title">旋转：</div>
                        <div className="input-control">
                            <input 
                                value={this.state.nodes[this.state.datatrans] ? this.state.nodes[this.state.datatrans].rotation: ''} 
                                onChange={(e)=>this.handleInputChange('rotation', e)} 
                            />
                        </div>
                    </div>
                    <div className="control">
                        <div className="title">是否显示标签：</div>
                        <div className="input-control">
                            <Switch 
                                style={{marginLeft: '5px'}}
                                checked={this.state.nodes[this.state.datatrans] ? this.state.nodes[this.state.datatrans].isprintlabel: true} 
                                onChange={(checked)=>this.handleChange('isprintlabel', checked)} 
                            />
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )

        const ProductsProps = () => (
            <React.Fragment>
                <div className="item-control">
                    <div className="control">
                        <div className="title">排列：</div>
                        <div className="input-control">
                            <Select 
                                style={{width: '100%', marginLeft: '5px', marginRight: '5px'}} 
                                value={this.state.nodes[this.state.datatrans] ? this.state.nodes[this.state.datatrans].align : ''} 
                                onChange={(value)=>this.handleChange('align', value)}
                            >
                                <Option value="LT">居左</Option>
                                <Option value="CT">居中</Option>
                                <Option value="RT">居右</Option>
                            </Select>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )

        const ProductsItemProps = () => (
            <React.Fragment>
                <div className="item-control">
                    <div className="control">
                        <div className="title">FixedWidth：</div>
                        <div className="input-control">
                            <input 
                                value={this.state.nodes[this.state.datatrans] ? this.state.nodes[this.state.datatrans].fixedwidth: ''} 
                                onChange={(e)=>this.handleInputChange('fixedwidth', e)} 
                            />
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
        
        return (
            <div className="template">
                <p className="tip">点击项目设置其属性</p>
                <div className="main-container">
                    <div className="tools-container">
                        {/* <div className="tools">
                            <span className="tools-item" draggable onDragStart={(e)=>this.handleDragStart('shopname',e)}>店名</span>
                            <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('ordersrc')}>订单来源</span>
                            <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('shopno')}>商户流水号</span>
                            <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('orderno')}>订单号</span>
                            <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('ordertime')}>下单时间</span>
                            <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('delivertime')}>送餐时间</span>
                            <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('contactname')}>联系人</span>
                            <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('contacttel')}>联系电话</span>
                            <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('paytype')}>支付类型</span>
                            <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('deliveraddress')}>送餐地址</span>
                            <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('name')}>商品名</span>
                            <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('count')}>数量</span>
                            <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('price')}>价格</span>
                            <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('packetprice')}>打包盒</span>
                            <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('total')}>总计</span>
                            <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('discount')}>优惠金额</span>
                            <span className="tools-item" draggable onDragStart={()=>this.handleDragStart('payprice')}>支付金额</span>
                        </div> */}
                        <div className="item-control">
                            <div className="control">
                                <div className="title">项目：</div>
                                <div className="input-control">
                                    {this.state.nodes[this.state.datatrans] ? this.state.nodes[this.state.datatrans].text: ''} 
                                </div>
                            </div>
                        </div>
                        {
                            this.state.datatrans === 'products' ? <ProductsProps />
                            : ['name', 'count', 'price'].includes(this.state.datatrans) ? <ProductsItemProps /> : <OthersProps />
                        }
                        
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
