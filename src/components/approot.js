import React, { Component } from 'react';
import TagTemplate from './tagTemplate'
import RenderTag from './renderTag'
import BillTemplate from '../components/billTemplate'
import RenderBill from '../components/renderBill'
import '../App.css';

class App extends Component {

  state = {
    current: 'billTemplate'
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="switch-button" onClick={()=> this.setState({current: 'billTemplate'})}>票据模板</div>
          <div className="switch-button" onClick={()=> this.setState({current: 'renderBill'})}>票据生成</div>
          <div className="switch-button" onClick={()=> this.setState({current: 'tagTemplate'})}>标签模板</div>
          <div className="switch-button" onClick={()=> this.setState({current: 'renderTag'})}>标签生成</div>
        </header>
        <div className="content">
           {
              this.state.current === 'billTemplate' && <BillTemplate />
           }
           {
              this.state.current === 'renderBill' && <RenderBill />
           }
           {
              this.state.current === 'tagTemplate' && <TagTemplate />
           }
           {
              this.state.current === 'renderTag' && <RenderTag />
           }
        </div>
      </div>
    );
  }
}

export default App;
