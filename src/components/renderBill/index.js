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
const drawText = (layer,groupnodes,text, key, offsetY = 0) => {
      const { x, y, width, align, fontSize } = groupnodes[key]
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

const drawImage = (layer,groupnodes,url, key, offsetY = 0) => {
      const { x, y, width, height } = groupnodes[key]
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

    setlayer(data,groupnodes){
      console.log(data);
      console.log(groupnodes);

      let layer = this.layer;
      layer.current.removeChildren();
      let baseY = 0
      const productDetail = data.productdetail;
      if(productDetail.length > 0){
        lodashmap(productDetail[0], (item, key)=>{
          if(!!groupnodes[key]){
             if( baseY === 0 ){
                baseY = groupnodes[key].y
              }
            drawText(layer,groupnodes,key, key)
          }
        })
      }

      let count = 1
      lodashmap(productDetail, (pro)=>{
          lodashmap(pro, (v, key) => {
            if(!!groupnodes[key]){
              let offsetY = count*step
              drawText(layer,groupnodes,v, key, offsetY)
            }
          })
          count = count +1
      })

      lodashmap(data, (v, key)=>{
          console.log(key)
          if (key !== 'productdetail' && !!groupnodes[key]) {
              let offsetY = 0

              if(groupnodes[key].y >= baseY ){
                  offsetY = count*step
              }

              if(groupnodes[key].type === 'Text'){
                  drawText(layer,groupnodes,v, key, offsetY)
              } else if( groupnodes[key].type === 'Path'){
                  drawImage(layer,groupnodes,v, key, offsetY)
              }

          }
      })
      // this.setState({layer});
    }

    componentDidMount() {
      const {data,groupnodes} = this.props;
      this.setlayer(data,groupnodes);
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
      const nextdata = nextProps.data;
      const nextgroupnodes = nextProps.groupnodes;

      const thisdata = this.props.data;
      const thisgroupnodes = this.props.groupnodes;

      if(JSON.stringify(nextdata) === JSON.stringify(thisdata)){
        if(JSON.stringify(nextgroupnodes) === JSON.stringify(thisgroupnodes)){
          return false;
        }
      }
      return true;//render
    }
    componentWillReceiveProps(nextProps){
      const {data,groupnodes} = nextProps;
      this.setlayer(data,groupnodes);
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
const mapStateToProps =  ({posprinter:{groupnodes,data}}) =>{

  return {groupnodes,data};
};
Index = connect(mapStateToProps)(Index);
export default Index
