import React, { Component } from 'react';
import Template from '../components/template';
import RenderBill from '../components/renderBill'
import '../App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Template />
        </header>
        <div>
          <RenderBill />
        </div>
      </div>
    );
  }
}

export default App;
