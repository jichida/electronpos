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
const drawText = (layer,billnodes,text, key, offsetY = 0) => {
      const { x, y, width, align, fontSize } = billnodes[key]
      const konvaText = new Konva.Text({
          x,
          y: y + offsetY,
          text,
          width,
          align,
          fontSize
      })
      layer.current.add(konvaText)
      layer.current.draw()
  };

const drawImage = (layer,billnodes,url, key, offsetY = 0) => {
      const { x, y, width, height } = billnodes[key]
      const  generatePath = (url)=>{
            const qrcode =  qr.svgObject(url,
                {
                    ec_level: 'L',
                    type: 'svg'
                }
            )
            return qrcode.path
        };
      const path = new Konva.Path({
          x,
          y: y + offsetY,
          width,
          height,
          data: generatePath(url),
          fill: 'black',
          scale: {
            x : 4,
            y : 4
          }
      })

      layer.current.add(path)
      layer.current.draw()
  };


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

    setlayer(billdata,billnodes){
      console.log(billdata);
      console.log(billnodes);

      let layer = this.layer;
      layer.current.removeChildren();
      let baseY = 0
      const productDetail = billdata.productdetail;
      if(productDetail.length > 0){
        lodashmap(productDetail[0], (item, key)=>{
          if(!!billnodes[key]){
             if( baseY === 0 ){
                baseY = billnodes[key].y
              }
            drawText(layer,billnodes,key, key)
          }
        })
      }

      let count = 1
      lodashmap(productDetail, (pro)=>{
          lodashmap(pro, (v, key) => {
            if(!!billnodes[key]){
              let offsetY = count*step
              drawText(layer,billnodes,v, key, offsetY)
            }
          })
          count = count +1
      })

      lodashmap(billdata, (v, key)=>{
          console.log(key)
          if (key !== 'productdetail' && !!billnodes[key]) {
              let offsetY = 0

              if(billnodes[key].y >= baseY ){
                  offsetY = count*step
              }

              if(billnodes[key].type === 'Text'){
                  drawText(layer,billnodes,v, key, offsetY)
              } else if( billnodes[key].type === 'Path'){
                  drawImage(layer,billnodes,v, key, offsetY)
              }

          }
      })
      // this.setState({layer});
    }

    componentDidMount() {
      const {billdata,billnodes} = this.props;
      this.setlayer(billdata,billnodes);
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
    shouldComponentUpdate(nextProps, nextState) {
      const nextbilldata = nextProps.billdata;
      const nextbillnodes = nextProps.billnodes;

      const thisbilldata = this.props.billdata;
      const thisbillnodes = this.props.billnodes;

      if(JSON.stringify(nextbilldata) === JSON.stringify(thisbilldata)){
        if(JSON.stringify(nextbillnodes) === JSON.stringify(thisbillnodes)){
          return false;
        }
      }
      return true;//render
    }
    componentWillReceiveProps(nextProps){
      const {billdata,billnodes} = nextProps;
      this.setlayer(billdata,billnodes);
    }
    render () {

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
const mapStateToProps =  ({posprinter:{billnodes,billdata}}) =>{

  return {billnodes,billdata};
};
Index = connect(mapStateToProps)(Index);
export default Index
