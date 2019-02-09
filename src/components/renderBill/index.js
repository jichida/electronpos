import React, { Component } from 'react'
import { Stage, Layer } from 'react-konva'
import lodashmap from 'lodash.map'
import { Button } from 'antd'
import Konva from 'konva'
import qr from 'qr-image'
import './index.less'

const step = 20

const nodes = [
    {type: "Text", text: "品名", x: 74.60000610351562, y: 42.29999542236328, width: 250},
    {type: "Text", text: "单位", x: 391.6000061035156, y: 84.29999542236328, width: 250},
    {type: "Text", text: "原价", x: 74.60000610351562, y: 85.29999542236328, width: 250},
    {type: "Text", text: "会员价", x: 174.60000610351562, y: 83.29999542236328, width: 250},
    {type: "Text", text: "折扣价", x: 276.6000061035156, y: 85.29999542236328, width: 250},
    {type: "Text", text: "日期", x: 73.60000610351562, y: 123.29999542236328, width: 250},
    {type: "Text", text: "店名", x: 76.60000610351562, y: 12.299995422363281, width: 250},
    {type: "Image", text: undefined, x: 67.60000610351562, y: 158.29999542236328, width: 130, height: 130},
]

const groupnodes = {
    '二维码': { height: 130, id: "二维码", type: "Path", width: 130, x: 200, y: 140 },
    '会员价': { 
        fontSize: 12,
        id: "会员价",
        text: "会员价",
        type: "Text",
        width: 100,
        height: 32,
        align: "center",
        x: 125,
        y: 120
    },
    '店名': { 
        fontSize: 12,
        id: "单位",
        text: "单位",
        type: "Text",
        width: 100,
        height: 32,
        align: "center",
        x: 180,
        y: 20,
    },
    '原价': {
        fontSize: 12,
        id: "原价",
        text: "原价",
        type: "Text",
        width: 100,
        height: 32,
        align: "center",
        x: 0,
        y: 120,
    },
    '品名': {
        fontSize: 12,
        id: "品名",
        text: "品名",
        type: "Text",
        width: 100,
        height: 32,
        align: "center",
        x: 0,
        y: 80,
    },
    '折扣价': { 
        fontSize: 12,
        id: "折扣价",
        text: "折扣价",
        type: "Text",
        width: 100,
        height: 32,
        align: "center",
        x: 250,
        y: 120,
    },
    '数量': { 
        fontSize: 12,
        id: "数量",
        text: "数量",
        type: "Text",
        width: 100,
        height: 32,
        align: "center",
        x: 375,
        y: 120,
    },
    '日期': {
        fontSize: 12,
        id: "日期",
        text: "日期",
        type: "Text",
        width: 100,
        height: 32,
        align: "center",
        x: 400,
        y: 80,
    },
}

const data = {
    '店名': '武进万达',
    '品名': '麻辣烫',
    productdetail:[
        {
            '原价': 20,
            '会员价': 18,
            '折扣价': 15,
            '数量': 2,
        },
        {
            '原价': 30,
            '会员价': 28,
            '折扣价': 25,
            '数量': 1,
        },
    ],
    '二维码': '二维码',
    }
    

class Index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            canvasWidth: 500,
            canvasHeight: 500,
        }
        this.stage = React.createRef()
        this.layer = React.createRef()

        
    }

    // drawText = ({text, x, y, width, fontSize}) => {
    //     const konvaText = new Konva.Text({
    //         x,
    //         y,
    //         text,
    //         width,
    //         fontSize
    //     })
    //     this.layer.current.add(konvaText)
    //     this.layer.current.draw()
    // }

    drawText = (text, key, offsetY = 0) => {
        const { x, y, width, align, fontSize } = groupnodes[key]
        const konvaText = new Konva.Text({
            x,
            y: y + offsetY,
            text,
            width,
            align,
            fontSize
        })
        this.layer.current.add(konvaText)
        this.layer.current.draw()
    }

    // drawImage = ({x, y, width, height, svgpath}) => {
    //     // const position = { x, y }
    //     const layer = this.layer.current
    //     const path = new Konva.Path({
    //         x,
    //         y,
    //         width,
    //         height,
    //         data: svgpath,
    //         fill: 'black',
    //         scale: {
    //           x : 4,
    //           y : 4
    //         }
    //     })

    //     layer.add(path)
    //     layer.draw()
    // }

    drawImage = (url, key, offsetY = 0) => {
        const layer = this.layer.current
        const { x, y, width, height } = groupnodes[key]
        const path = new Konva.Path({
            x,
            y: y + offsetY,
            width,
            height,
            data: this.generatePath(url),
            fill: 'black',
            scale: {
              x : 4,
              y : 4
            }
        })

        layer.add(path)
        layer.draw()
    }

    generatePath = (url)=>{
        const qrcode =  qr.svgObject(url, 
            {  
                ec_level: 'L',
                type: 'svg'
            }
        )
        return qrcode.path
    }

    componentDidMount() {
        // lodashmap(nodes, (item)=>{
        //     if(item.type === 'Text'){
        //         this.drawText(item)
        //     } else if( item.type === 'Path') {
        //         const qrcode =  qr.svgObject(item.二维码, 
        //             {  
        //                 ec_level: 'L',
        //                 type: 'svg'
        //             }
        //         )
        //         item.svgpath = qrcode.path
        //         this.drawImage(item)
        //     }
        // })
        let baseY = 0
        const productDetail = data.productdetail
        lodashmap(productDetail[0], (item, key)=>{
            if( baseY === 0 ){
                baseY = groupnodes[key].y
            } 
            this.drawText(key, key)
        })

        let count = 1
        lodashmap(productDetail, (pro)=>{
            lodashmap(pro, (v, key) => {
                let offsetY = count*step
                this.drawText(v, key, offsetY)
            })
            count = count +1
        })

        lodashmap(data, (v, key)=>{
            console.log(key)
            if (key !== 'productdetail') {
                let offsetY = 0
                if(groupnodes[key].y >= baseY ){
                    offsetY = count*step
                }

                if(groupnodes[key].type === 'Text'){
                    this.drawText(v, key, offsetY)
                } else if( groupnodes[key].type === 'Path'){
                    this.drawImage(v, key, offsetY)
                }
            }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
        })
    }

    handleRender = () => {
        const that = this
        this.layer.current.toImage({
            mimeType: 'image/png',
            callback(img) {
                console.log(img)
                that.setState({
                    renderBill: img
                })
            }
        })
    }

    render () {
        console.log(this.state.renderBill)
        return (
            <div className="render-bill">
                <Stage width={this.state.canvasWidth} height={this.state.canvasHeight} 
                    ref={this.stage}
                    style={{backgroundColor: '#ddd'}}
                >
                    <Layer ref={this.layer} />
                </Stage>
                <div className="submit-zone">
                    <Button type="primary" onClick={this.handleRender}>生成图片</Button>
                    <Button>取消</Button>
                </div>
                <div>
                    {this.state.renderBill&&(<img src={this.state.renderBill.src} alt='' />)}
                </div>
            </div>
        )
    }
}

export default Index