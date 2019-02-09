/**
 * Created by wangxiaoqing on 2017/3/27.
 */
import React from 'react';
import { Provider } from 'react-redux';
// import DevTools from './devtools';
import store from './store';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import {history} from './store';
import AppRoot from '../components/approot.js';


const ChildRoot = (props)=>{
  console.log(props);
  return (
    <div>
      <ConnectedRouter history={history}>
          <Route path="/" component={AppRoot}/>
      </ConnectedRouter>
    </div>);
}

const Root = (props)=>
    (
            <Provider store={store}>
                <ChildRoot />
            </Provider>
    );


export default Root;
