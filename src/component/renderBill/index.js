import React, { Component } from 'react'
import { Stage, Layer } from 'react-konva'
import lodashmap from 'lodash.map'
import { Button } from 'antd'
import Konva from 'konva'
import './index.less'
import img from './pig.jpg'

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

const groupnodes = [
    {type: "Text", text: "品名", x: 127.39999389648438, y: 62.29999923706055, width: 250},
    {type: "Text", text: "单位", x: 161.39999389648438, y: 130.29999923706055, width: 250},
    {type: "Image", text: undefined, x: 127.39999389648438, y: 175.29999923706055, width: 130, height: 130},
]

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

    drawText = ({text, x, y, width}) => {
        const konvaText = new Konva.Text({
            x,
            y,
            text,
            width,
            fontSize: 12,
        })
        this.layer.current.add(konvaText)
        this.layer.current.draw()
    }

    drawImage = ({x, y, width, height}) => {
        const position = { x, y }
        const layer = this.layer.current
        Konva.Image.fromURL(img, function (image) {
            layer.add(image)
            image.position(position)
            image.width(width)
            image.height(height)
            layer.draw()
        })
    }

    componentDidMount() {
        lodashmap(nodes, (item)=>{
            if(item.type === 'Text'){
                this.drawText(item)
            } else if( item.type === 'Image') {
                this.drawImage(item)
            }
        })
    }

    render () {
        return (
                <Stage width={this.state.canvasWidth} height={this.state.canvasHeight} 
                    ref={this.stage}
                    style={{backgroundColor: '#ddd'}}
                >
                    <Layer ref={this.layer} />
                </Stage>
        )
    }
}

export default Index