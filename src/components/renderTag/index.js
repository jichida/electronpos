import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Stage, Layer } from 'react-konva'
import lodashmap from 'lodash.map'
import { Button } from 'antd'
import Konva from 'konva'
import qr from 'qr-image'
import './index.less'

const drawText = (layer,nodesTemplate,text, key) => {
      const { x, y, fontSize, rotation } = nodesTemplate[key]
      const konvaText = new Konva.Text({
          x,
          y,
          text,
          rotation,
          fontSize
      })
      layer.current.add(konvaText)
      layer.current.draw()
  };

const drawImage = (layer,nodesTemplate,url, key) => {
      const { x, y, rotation, scale } = nodesTemplate[key]
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
          y,
          rotation,
          data: generatePath(url),
          fill: 'black',
          scale
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

    setlayer(data,nodesTemplate){
      console.log(data);
      console.log(nodesTemplate);

      let layer = this.layer;
      layer.current.removeChildren();

      lodashmap(data, (v, key)=>{
          console.log(key)
          if (!!nodesTemplate[key]) {

              if(nodesTemplate[key].type === 'Text'){
                  drawText(layer,nodesTemplate,v, key)
              } else if( nodesTemplate[key].type === 'Path'){
                  drawImage(layer,nodesTemplate,v, key)
              }

          }
      })
    }

    componentDidMount() {
      const { tagdata, tagnodes } = this.props;
      this.setlayer(tagdata, tagnodes);
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
      const nextdata = nextProps.tagdata;
      const nextnodesTemplate = nextProps.tagnodes;

      const thisdata = this.props.tagdata;
      const thisnodesTemplate = this.props.tagnodes;

      if(JSON.stringify(nextdata) === JSON.stringify(thisdata)){
        if(JSON.stringify(nextnodesTemplate) === JSON.stringify(thisnodesTemplate)){
          return false;
        }
      }
      return true;//render
    }

    componentWillReceiveProps(nextProps){
      const {tagdata,tagnodes} = nextProps;
      this.setlayer(tagdata,tagnodes);
    }
    
    render () {

        return (
            <div className="render-tag">
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
const mapStateToProps =  ({posprinter:{ tagnodes, tagdata}}) =>{

  return { tagnodes, tagdata};
};
Index = connect(mapStateToProps)(Index);
export default Index
