import React, { Component } from 'react';
import Template from './component/template';
import TagTemplate from './components/tagTemplate'
import RenderBill from './component/renderBill'
import './App.css';

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
