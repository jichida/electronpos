import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Stage, Layer } from 'react-konva'
import lodashmap from 'lodash.map'
import { Button } from 'antd'
import Konva from 'konva'
import qr from 'qr-image'
import './index.less'

const step = 20

// const nodes = [
//     {type: "Text", text: "品名", x: 74.60000610351562, y: 42.29999542236328, width: 250},
//     {type: "Text", text: "单位", x: 391.6000061035156, y: 84.29999542236328, width: 250},
//     {type: "Text", text: "原价", x: 74.60000610351562, y: 85.29999542236328, width: 250},
//     {type: "Text", text: "会员价", x: 174.60000610351562, y: 83.29999542236328, width: 250},
//     {type: "Text", text: "折扣价", x: 276.6000061035156, y: 85.29999542236328, width: 250},
//     {type: "Text", text: "日期", x: 73.60000610351562, y: 123.29999542236328, width: 250},
//     {type: "Text", text: "店名", x: 76.60000610351562, y: 12.299995422363281, width: 250},
//     {type: "Image", text: undefined, x: 67.60000610351562, y: 158.29999542236328, width: 130, height: 130},
// ]

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
        const { x, y, width, align, fontSize } = this.props.groupnodes[key]
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
        const { x, y, width, height } = this.props.groupnodes[key]
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
        const productDetail = this.props.data.productdetail
        lodashmap(productDetail[0], (item, key)=>{
            if( baseY === 0 ){
                baseY = this.props.groupnodes[key].y
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

        lodashmap(this.props.data, (v, key)=>{
            console.log(key)
            if (key !== 'productdetail') {
                let offsetY = 0
                if(this.props.groupnodes[key].y >= baseY ){
                    offsetY = count*step
                }

                if(this.props.groupnodes[key].type === 'Text'){
                    this.drawText(v, key, offsetY)
                } else if( this.props.groupnodes[key].type === 'Path'){
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
        console.log(this.props.groupnodes)
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
const mapStateToProps =  ({posprinter:{groupnodes,data}}) =>{
  return {groupnodes,data};
};
Index = connect(mapStateToProps)(Index);
export default Index
